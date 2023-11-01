import type { QueryParams } from "@clickhouse/client";
import type { Client } from ".";
import { combineExpression } from "../expressions";
import type { ColumnBuilder } from "../schema/builder";
import type { ToOptional } from "../types/helpers";
import type { Table } from "../types/table";

type ClickhouseJSONResponse<T extends Table> = {
  meta: Array<{
    name: keyof T["columns"][string]["name"];
    type: keyof T["columns"][string]["type"];
  }>;
  data: Array<ExtractPropsFromTable<T>>;
  rows: number;
  rows_before_limit_at_least: number;
  statistics: {
    elapsed: number;
    rows_read: number;
    bytes_read: number;
  };
};

type ColumnValue<U> = U extends ColumnBuilder<infer V, infer R>
  ? R extends true
    ? V
    : V | null
  : never;

type ExtractPropsFromTable<T extends Table> = {
  [K in keyof T["columns"]]: ColumnValue<T["columns"][K]>;
};

type GenericParams<_T extends Table> = {
  where: string;
};

export class Query<T extends Table> {
  private readonly table: T;
  private readonly client: Client;
  private readonly database: string | undefined;

  constructor(client: Client, database: string | undefined, table: T) {
    this.client = client;
    this.database = database;
    this.table = table;
  }

  public async findFirst(params: GenericParams<T>) {
    const query = await this.client.query({
      query: `SELECT * FROM ${this.database}.${this.table.name} WHERE ${combineExpression(
        params.where,
      )} LIMIT 1`,
    });

    const json = await query.json<ClickhouseJSONResponse<T>>();

    return json.data?.[0] ?? null;
  }

  public async findMany(params: GenericParams<T>) {
    const query = await this.client.query({
      query: `SELECT * FROM ${this.database}.${this.table.name} WHERE ${combineExpression(
        params.where,
      )}`,
      format: "JSON",
    });

    const json = await query.json<ClickhouseJSONResponse<T>>();

    return json.data;
  }

  public async insert(
    data: ToOptional<ExtractPropsFromTable<T>>,
  ) {
    const values = Object.values(data);
    const columnIndexes: Record<string, number> = Object.keys(data).reduce(
      (acc, key, index) => {
        acc[key] = index;

        return acc;
      },
      {} as Record<string, number>,
    );

    // Since we can't guarantee the order of the values, we need to sort them by column indexes
    const sortedValuesByColumnIndexes = Object.keys(this.table.columns).map(key => {
      const foundColumn = columnIndexes[key];
      if (foundColumn === undefined) {
        return null;
      }

      return values[foundColumn];
    });

    const query = await this.client.insert({
      table: this.table.name,
      values: [sortedValuesByColumnIndexes],
    });

    return query.query_id;
  }

  public async delete(params: GenericParams<T>) {
    const query = await this.client.query({
      query: `DELETE FROM ${this.database}.${this.table.name} WHERE ${combineExpression(
        params.where,
      )}`,
    });

    const json = await query.json<ClickhouseJSONResponse<T>>();

    return {
      returning: () => json.data,
    };
  }

  public async update() {
    // TODO: implement
  }

  public async raw(params: QueryParams) {
    return this.client.query(params);
  }
}
