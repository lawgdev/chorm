import type { QueryParams } from "@clickhouse/client";
import type { Client } from ".";
import type { ColumnBuilder } from "../column-types/builder";
import { combineExpression } from "../expressions";
import type { ToOptional } from "../types/helpers";
import type { Table } from "../types/table";

type ClickhouseJSONResponse<T extends Table> = {
  meta: Array<{
    name: keyof T["columns"][string]["columnName"];
    type: keyof T["columns"][string]["columnType"];
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
      format: "JSON",
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

  public async insert(data: ToOptional<ExtractPropsFromTable<T>>): Promise<number> {
    const columns = Object.keys(data).join(", ");
    const values = Object.values(data).join(", ");

    const query = await this.client.query({
      query: `INSERT INTO ${this.database}.${this.table.name} (${columns}) VALUES (${values})`,
      format: "JSON",
    });

    const json = await query.json<ClickhouseJSONResponse<T>>();

    return json.rows;
  }

  public async delete(params: GenericParams<T>): Promise<number> {
    const query = await this.client.query({
      query: `DELETE FROM ${this.database}.${this.table.name} WHERE ${combineExpression(
        params.where,
      )}`,
    });

    const json = await query.json<ClickhouseJSONResponse<T>>();

    return json.rows;
  }

  public async update() {
    // TODO: implement
  }

  public async raw(params: QueryParams) {
    return this.client.query(params);
  }
}
