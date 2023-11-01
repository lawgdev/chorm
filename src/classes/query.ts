import type { QueryParams } from "@clickhouse/client";
import type { Client } from ".";
import { AllExpressions, combineExpression } from "../expressions";
import type { ColumnBuilder } from "../schema/builder";
import type { ToOptional } from "../types/helpers";
import type { Table } from "../types/table";
import * as conditions from "../expressions/conditions";

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

type GenericParams<T extends Table> = {
  where?: (table: T, conditions: AllExpressions) => string;
  orderBy?: (table: T, conditions: AllExpressions) => string;
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
    let query;

    if (params.where) {
      query = `SELECT * FROM ${this.database}.${this.table.name} WHERE ${combineExpression(
        params.where(this.table, conditions),
      )} LIMIT 1`;
    } else {
      query = `SELECT * FROM ${this.database}.${this.table.name} LIMIT 1`;
    }

    const queriedData = await this.client.query({
      query,
    });

    const json = await queriedData.json<ClickhouseJSONResponse<T>>();

    return json.data?.[0] ?? null;
  }

  public async findMany(params: GenericParams<T>) {
    const validation = {
      where: params.where ? `WHERE ${combineExpression(params.where(this.table, conditions))}` : "",
      orderBy: params.orderBy
        ? `ORDER BY ${combineExpression(params.orderBy(this.table, conditions))}`
        : "",
    };

    const query = `SELECT * FROM ${this.database}.${this.table.name} ${Object.values(validation)
      .join(" ")
      .trim()}`;

    const queriedData = await this.client.query({
      query,
      format: "JSON",
    });

    const json = await queriedData.json<ClickhouseJSONResponse<T>>();

    return json.data;
  }

  public async insert(data: ToOptional<ExtractPropsFromTable<T>>) {
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

  // Todo: allow user to specify if they want to do a "lightweight" or a "hard" delete
  public async delete(params: GenericParams<T>) {
    let query;

    if (params.where) {
      query = `ALTER TABLE ${this.database}.${this.table.name} DELETE WHERE ${combineExpression(
        params.where(this.table, conditions),
      )}`;
    } else {
      query = `ALTER TABLE ${this.database}.${this.table.name} DELETE`;
    }

    const queriedData = await this.client.query({
      query,
    });

    return queriedData.query_id;
  }

  public async update(
    params: GenericParams<T> & {
      data: Partial<ExtractPropsFromTable<T>>;
    },
  ) {
    if (!params.where) return;

    const updateExpression = Object.entries(params.data).map(([key, value]) => {
      const parsedValue = this.table.columns[key]?.sqlParser(value) ?? value;
      return `${key} = ${parsedValue}`;
    });

    const query = await this.client.query({
      query: `ALTER TABLE ${this.database}.${
        this.table.name
      } UPDATE ${updateExpression} WHERE ${combineExpression(
        params.where(this.table, conditions),
      )}`,
    });

    return query.query_id;
  }

  public async raw(params: QueryParams) {
    return this.client.query(params);
  }
}
