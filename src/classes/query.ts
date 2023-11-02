import type { QueryParams } from "@clickhouse/client";
import type { Client } from ".";
import { AllExpressions, combineExpression } from "../expressions";
import * as conditions from "../expressions/conditions";
import { ClickhouseJSONResponse, ExtractPropsFromTable } from "../types/clickhouse";
import type { ToOptional } from "../types/helpers";
import type { Table } from "../types/table";
import { validateParam } from "../utils/param-validation";

type GenericParams<T extends Table> = {
  where?: (columns: T["columns"], conditions: AllExpressions) => string;
  orderBy?: (columns: T["columns"], conditions: AllExpressions) => string;
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
    const validation = {
      where: params.where
        ? `WHERE ${combineExpression(params.where(this.table.columns, conditions))}`
        : "",
      orderBy: params.orderBy
        ? `ORDER BY ${combineExpression(params.orderBy(this.table.columns, conditions))}`
        : "",
    };

    const query = `SELECT * FROM ${this.database}.${this.table.name} ${validateParam(
      validation,
    )} LIMIT 1`;

    const queriedData = await this.client.query({
      query,
    });

    const json = await queriedData.json<ClickhouseJSONResponse<T>>();

    return json.data?.[0] ?? null;
  }

  public async findMany(params: GenericParams<T>) {
    const validation = {
      where: params.where
        ? `WHERE ${combineExpression(params.where(this.table.columns, conditions))}`
        : "",
      orderBy: params.orderBy
        ? `ORDER BY ${combineExpression(params.orderBy(this.table.columns, conditions))}`
        : "",
    };

    const query = `SELECT * FROM ${this.database}.${this.table.name} ${validateParam(validation)}`;

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
        return this.table.columns[key]?.defaultValue;
      }

      return values[foundColumn];
    });

    console.log(sortedValuesByColumnIndexes);
    const query = await this.client.insert({
      table: this.table.name,
      values: [sortedValuesByColumnIndexes],
    });

    return query.query_id;
  }

  // Todo: allow user to specify if they want to do a "lightweight" or a "hard" delete
  public async delete(params: GenericParams<T>) {
    const validation = {
      where: params.where
        ? `WHERE ${combineExpression(params.where(this.table.columns, conditions))}`
        : "",
    };

    const query = `ALTER TABLE ${this.database}.${this.table.name} DELETE ${validateParam(
      validation,
    )}`;

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
        params.where(this.table.columns, conditions),
      )}`,
    });

    return query.query_id;
  }

  public async raw(params: QueryParams) {
    return this.client.query(params);
  }
}
