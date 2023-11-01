import { createClient as internalCHClient } from "@clickhouse/client";
import path from "path";
import { EnumKeys, EnumValue } from "../types/helpers";
import type { Table } from "../types/table";
import { convertEnumToString } from "../utils/helpers";
import { Logger } from "../utils/logger";
import { Query } from "./query";

type Options<T extends Record<string, Record<string, unknown>>> = Parameters<
  typeof internalCHClient
>["0"] & {
  schemas: T;
  pingInterval?: number;
  debug?: boolean;
};

export type Client = ReturnType<typeof internalCHClient>;

type Queries<T extends Record<string, Table>> = {
  [K in keyof T]: Query<T[K]>;
};

export default class ClickHouse<T extends Record<string, Table>> {
  public readonly client: Client;
  private readonly options: Options<T>;

  public readonly query: Queries<T>;

  constructor(options: Options<T>) {
    this.client = internalCHClient({
      ...options,
    });
    this.options = options;
    this.client.query({
      query: `CREATE DATABASE IF NOT EXISTS ${options.database}`,
    });

    this.query = Object.entries(options.schemas).reduce<Queries<T>>((acc, [key, value]) => {
      return {
        ...acc,
        [key]: new Query(this.client, this.options.database, value),
      };
    }, {} as Queries<T>);
  }

  public async migrate({ folder }: { folder?: string } = {}) {
    const dirname = process.argv[1];
    if (!dirname) return;
    //@ts-ignore
    const migrationsFolder = folder ?? `${path.dirname(dirname)}/migrations`;

    await this.startMigrations();
    //this.generateMigrations(migrationsFolder);
  }

  private async startMigrations() {
    try {
      for (const [_objName, table] of Object.entries(this.options.schemas)) {
        const columns = Object.entries(table.columns).map(([columnName, column]) => {
          return `${columnName} ${column.type}${
            column.value
              ? `(${convertEnumToString(column.value as Record<EnumKeys, EnumValue>)})`
              : ""
          }`;
        });

        const primaryKeyColumn = Object.entries(table.columns).find(
          ([_, column]) => column.primaryKey,
        )?.[0];

        await this.client.query({
          query: `
          CREATE TABLE IF NOT EXISTS ${this.options.database}.${table.name}
          (
            ${columns.join(",\n")}
          )
          ENGINE = MergeTree()
          ${primaryKeyColumn ? `PRIMARY KEY ${primaryKeyColumn}` : ""}
          `,
        });
      }

      await this.client.exec({
        query: `CREATE TABLE IF NOT EXISTS _migrations (
          uid UUID DEFAULT generateUUIDv4(), 
          version UInt32,
          checksum String, 
          migration_name String, 
          applied_at DateTime DEFAULT now()
        ) 
        ENGINE = MergeTree 
        ORDER BY tuple(applied_at)`,
      });
    } catch (e: unknown) {
      Logger.error("Error while creating _migrations table" + e);
      process.exit(1);
    }
  }

  public async ping() {
    await this.client.ping();
  }

  public async drop() {
    await this.client.query({
      query: `DROP DATABASE IF EXISTS ${this.options.database}`,
    });
  }

  public async close() {
    await this.client.close();
  }
}
