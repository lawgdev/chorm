import type { ColumnBuilder } from "../schema/builder";
import type { Table } from "../types/table";

export function table<T extends Record<string, ColumnBuilder>>(name: string, columns: T): Table<T> {
  return {
    name,
    columns,
  };
}
