import type { QueryParams } from "@clickhouse/client";
import type { Client, Table } from ".";
import type { ColumnBuilder } from "../column-types/builder";

type ExtractPropsFromTable<T extends Table> = T extends Table<infer U>
  ? {
      [K in keyof U]: U[K] extends ColumnBuilder<infer V> ? V : never;
    }
  : never;

type GenericParams<T extends Table> = {
  where: {
    [K in keyof ExtractPropsFromTable<T>]?: ExtractPropsFromTable<T>[K];
  };
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
    return await this.client.query({
      query: `SELECT * FROM ${this.database}.${this.table.name}`,
    });
  }

  public findMany(params: GenericParams<T>) {
    //  TODO: implement
  }

  public insert(params: ExtractPropsFromTable<T>) {
    //  TODO: implement
  }

  public delete(params: GenericParams<T>) {
    // Todo implement
  }

  public update(params: GenericParams<T>) {
    // Todo implement
  }

  public rawQuery(params: QueryParams) {
    return this.client.query(params);
  }
}
