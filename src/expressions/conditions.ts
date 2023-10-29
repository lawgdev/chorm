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

export function gt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} > ${value}`;
}

export function lt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} < ${value}`;
}

export function gte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} >= ${value}`;
}

export function lte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} <= ${value}`;
}

export function isNull<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return sql`${column.columnName} IS NULL`;
}

export function isNotNull<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return sql`${column.columnName} IS NOT NULL`;
}

export function inArray<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column.columnName} IN (${values})`;
}

export function notInArray<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column.columnName} NOT IN (${values})`;
}

export function exists(subquery: string) {
  return sql`EXISTS (${subquery})`;
}

export function notExists(subquery: string) {
  return sql`NOT EXISTS (${subquery})`;
}

export function between<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  minValue: ExtractTypeFromColumn<T>,
  maxValue: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} BETWEEN ${minValue} AND ${maxValue}`;
}

export function like<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column.columnName} LIKE ${pattern}`;
}

export function ilike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column.columnName} ILIKE ${pattern}`;
}

export function notBetween<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  minValue: ExtractTypeFromColumn<T>,
  maxValue: ExtractTypeFromColumn<T>,
) {
  return sql`${column.columnName} NOT BETWEEN ${minValue} AND ${maxValue}`;
}

export function notIlike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column.columnName} NOT ILIKE ${pattern}`;
}

export function not(expression: string) {
  return sql`NOT (${expression})`;
}

export function and(...expressions: string[]) {
  return sql`(${expressions.join(" AND ")})`;
}

export function or(...expressions: string[]) {
  return sql`(${expressions.join(" OR ")})`;
}

export function arrayContains<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column.columnName} @> ARRAY[${values}]`;
}

export function arrayContained<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column.columnName} <@ ARRAY[${values}]`;
}

export function arrayOverlaps<T extends ColumnBuilder = ColumnBuilder>(column1: T, column2: T) {
  return sql`${column1.columnName} && ${column2.columnName}`;
}
