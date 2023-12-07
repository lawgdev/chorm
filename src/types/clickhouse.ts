import { ColumnBuilder } from "../schema/builder";
import { Table } from "./table";

export type ColumnValue<U> = U extends ColumnBuilder<infer V, infer R, infer D>
  ? R extends true
    ? /* If it has a default allow D or null */
      D extends true
      ? V | null
      : V
    : V | null
  : never;

export type ExtractPropsFromTable<T extends Table> = {
  [K in keyof T["columns"]]: ColumnValue<T["columns"][K]>;
};

export type ClickhouseJSONResponse<T extends Table> = {
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
