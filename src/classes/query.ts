import type { QueryParams } from "@clickhouse/client";
import type { Client } from ".";
import { AllExpressions } from "../expressions";
import * as conditions from "../expressions/conditions";
import { ColumnBuilder } from "../schema/builder";
import { ClickhouseJSONResponse, ExtractPropsFromTable } from "../types/clickhouse";
import type { ToOptional } from "../types/helpers";
import type { Table } from "../types/table";
import { parseQuery, parseValues } from "../utils/param-validation";
import { SQLParser, sql } from "../utils/sql";

type GenericParams<T extends Table> = {
  where: (columns: T["columns"], conditions: AllExpressions) => SQLParser;
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
    const { template, query_params } = parseQuery(params.where(this.table.columns, conditions));

    console.log(template, query_params);
    const queriedData = await this.client.query({
      query: `SELECT * FROM ${this.database}.${this.table.name} WHERE ${template} LIMIT 1`,
      query_params,
    });

    const json = await queriedData.json<ClickhouseJSONResponse<T>>();

    return json.data?.[0] ?? null;
  }

  public async findMany(params: GenericParams<T>) {
    const { template, query_params } = parseQuery(params.where(this.table.columns, conditions));

    const queriedData = await this.client.query({
      query: `SELECT * FROM ${this.database}.${this.table.name} WHERE ${template}`,
      query_params,
    });

    const json = await queriedData.json<ClickhouseJSONResponse<T>>();

    return json.data;
  }

  public async insert(data: ToOptional<ExtractPropsFromTable<T>>) {
    const columns = Object.keys(this.table.columns);
    const values = columns
      .map(columnName => {
        const column = this.table.columns[columnName];
        if (!column) return undefined;

        const value =
          data[columnName as keyof ToOptional<ExtractPropsFromTable<T>>] ??
          column.defaultValue ??
          null;

        return { column, value };
      })
      .filter(Boolean) as Array<{ column: ColumnBuilder; value: unknown }>;

    if (values.length === 0) {
      throw new Error("No values were provided to insert");
    }

    const { template, query_params } = parseValues(...values);

    const query = await this.client.command({
      query: `INSERT INTO ${this.database}.${this.table.name} (${columns.join(
        ", ",
      )}) VALUES (${template})`,
      query_params,
    });

    return query.query_id;
  }

  // Todo: allow user to specify if they want to do a "lightweight" or a "hard" delete
  public async delete(params: GenericParams<T>) {
    const { template, query_params } = parseQuery(params.where(this.table.columns, conditions));

    const queriedData = await this.client.query({
      query: `ALTER TABLE ${this.database}.${this.table.name} DELETE WHERE ${template}`,
      query_params,
    });

    return queriedData.query_id;
  }

  public async update(
    params: GenericParams<T> & {
      data: Partial<ExtractPropsFromTable<T>>;
    },
  ) {
    const { template, query_params } = parseQuery(params.where(this.table.columns, conditions));
    const updateExpressions = Object.entries(params.data).map(([key, value]) => {
      const column = this.table.columns[key];
      return parseQuery(sql`${column} = ${value}`, column?.name);
    });

    const query = await this.client.query({
      query: `ALTER TABLE ${this.database}.${this.table.name} UPDATE ${updateExpressions
        .map(({ template }) => `${template}`)
        .join(", ")} WHERE ${template}`,
      query_params: {
        ...query_params,
        ...updateExpressions.reduce((acc, { query_params }) => ({ ...acc, ...query_params }), {}),
      },
    });

    return query.query_id;
  }

  public async raw(params: QueryParams) {
    return this.client.query(params);
  }
}
