import type { ColumnBuilder } from "../column-types/builder";

export type Table = {
  name: string;
  columns: Record<string, ColumnBuilder>;
};

export function table(name: string, columns: Record<string, ColumnBuilder>) {
  return {
    name,
    columns,
  };
}
