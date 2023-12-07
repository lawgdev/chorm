import { createClient as internalCHClient } from "@clickhouse/client";
import Migration from "../cli/lib/migration";
import type { Table } from "../types/table";
import { convertValueToString } from "../utils/helpers";
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

export class ClickHouse<T extends Record<string, Table>> {
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

  public async migrate({ folder }: { folder: string } = { folder: "./migrations" }) {
    await this.startMigrations();
    await this.applyMigrations(folder);
  }

  private async startMigrations() {
    try {
      for (const [_objName, table] of Object.entries(this.options.schemas)) {
        const columns = Object.entries(table.columns).map(([_key, column]) => {
          const columnValue = `${column.type}${
            column.value ? `(${convertValueToString(column.type, column.value)})` : ""
          }`;

          return `${column.name} ${column.isNotNull ? columnValue : `Nullable(${columnValue})`}`;
        });

        const primaryKeyColumn = Object.entries(table.columns).find(
          ([_, column]) => column.isPrimaryKey,
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

  private async applyMigrations(migrationsFolder: string) {
    const migration = new Migration();

    try {
      const migrations = await migration.getMigrations(migrationsFolder);

      for (const migrationInfo of migrations) {
        // Check if the migration has already been applied
        const queriedData = await this.client.query({
          query: `SELECT * FROM _migrations WHERE version = '${migrationInfo.version}'`,
        });

        // TODO: strictly type
        const json = (await queriedData.json()) as any;

        if (json.data.length === 0) {
          // Apply the migration
          await this.client.query({
            query: migrationInfo.content,
          });

          // Record the migration in the _migrations table
          await this.client.query({
            query: `INSERT INTO _migrations (version, checksum, migration_name) VALUES (${migrationInfo.version}, '${migrationInfo.checksum}', '${migrationInfo.name}')`,
          });

          Logger.success(`Migration ${migrationInfo.name} applied successfully`);
        } else {
          Logger.info(`Migration ${migrationInfo.name} already applied`);
        }
      }
    } catch (e: unknown) {
      Logger.error(`Error while applying migrations: ${e}`);
      process.exit(1);
    }
  }

  public async ping() {
    await this.client.ping();
  }

  public async close() {
    await this.client.close();
  }
}
