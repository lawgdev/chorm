import { createClient as internalCHClient } from "@clickhouse/client";
import { Query } from "./query";
import type { Table } from ".";

type Options<T extends Record<string, object>> = Parameters<
  typeof internalCHClient
>["0"] & {
  schemas: T;
  pingInterval?: number;
};

export type Client = ReturnType<typeof internalCHClient>;

export default class ClickHouse<T extends Record<string, Table>> {
  private readonly client: Client;
  private readonly options: Options<T>;
  private readonly pingInterval: ReturnType<typeof setInterval>;

  public readonly query: Record<keyof T, Query<T[keyof T]>>;

  constructor(options: Options<T>) {
    this.client = internalCHClient(options);
    this.options = options;
    this.client.query({
      query: `CREATE DATABASE IF NOT EXISTS ${options.database}`,
    });

    this.query = Object.entries(options.schemas).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]: new Query(this.client, value),
        };
      },
      {} as Record<keyof T, Query<T[keyof T]>>
    );

    this.pingInterval = setInterval(this.ping, options?.pingInterval ?? 10_000);
    this.migrate(options.schemas);
  }

  private async ping() {
    try {
      await this.client.ping();
    } catch (err) {
      this.close();
      throw err;
    }
  }

  private async close() {
    clearInterval(this.pingInterval);
    return await this.client.close();
  }

  private async migrate(schemas: T) {
    for (const [tableName, tableColumns] of Object.entries(schemas)) {
      const columns = Object.entries(tableColumns.columns).map(
        ([columnName, column]) => {
          return `${columnName} ${column.columnType}`;
        }
      );

      const primaryKeyColumn = Object.entries(tableColumns.columns).find(
        ([_, column]) => column.primaryKey
      )?.[0];

      this.client.query({
        query: `
        CREATE TABLE IF NOT EXISTS ${this.options.database}.${tableName}
        (
          ${columns.join(",\n")}
        )
        ENGINE = MergeTree()
        ${primaryKeyColumn ? `PRIMARY KEY ${primaryKeyColumn}` : ""}
        `,
      });
    }
  }
}
