import type { ColumnBuilder } from "../column-types/builder";
import type { Table } from "../types/table";

export function table<T extends Record<string, ColumnBuilder>>(name: string, columns: T): Table<T> {
  return {
    name,
    columns,
  };
}
