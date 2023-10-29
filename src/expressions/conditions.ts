import { events } from "../../_workbench/schemas";
import type { ColumnBuilder } from "../column-types/builder";
import type { ExtractTypeFromColumn } from "../types/table";
import { sql } from "../utils/sql";

export function eq<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} = ${value}`;
}

export function ne<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} <> ${value}`;
}

ne(events.columns.id, 5);

