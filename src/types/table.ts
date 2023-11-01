import type { ColumnBuilder } from "../schema/builder";

export type Table<T extends Record<string, ColumnBuilder> = Record<string, ColumnBuilder>> = {
  name: string;
  columns: T;
};

export type ColumnsFromTable<T extends Table> = T extends Table<infer U>
  ? {
      [K in keyof U]: U[K] extends ColumnBuilder<infer V> ? V : never;
    }
  : never;

export type ExtractTypeFromColumn<T extends ColumnBuilder> = T extends ColumnBuilder<infer U>
  ? U
  : never;
