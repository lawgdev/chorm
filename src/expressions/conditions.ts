import type { ColumnBuilder } from "../schema/builder";
import type { ExtractTypeFromColumn } from "../types/table";
import { SQLParser, sql } from "../utils/sql";

// Where
export function eq<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`(${column} = ${value})`;
}

export function ne<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} <> ${value}`;
}

export function gt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} > ${value}`;
}

export function lt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} < ${value}`;
}

export function gte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} >= ${value}`;
}

export function lte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} <= ${value}`;
}

export function isNull<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return sql`${column} IS NULL`;
}

export function isNotNull<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return sql`${column} IS NOT NULL`;
}

export function inArray<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column} IN (${values})`;
}

export function notInArray<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column} NOT IN (${values})`;
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
  return sql`${column} BETWEEN ${minValue} AND ${maxValue}`;
}

export function like<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column} LIKE ${pattern}`;
}

export function ilike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column} ILIKE ${pattern}`;
}

export function notBetween<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  minValue: ExtractTypeFromColumn<T>,
  maxValue: ExtractTypeFromColumn<T>,
) {
  return sql`${column} NOT BETWEEN ${minValue} AND ${maxValue}`;
}

export function notIlike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column} NOT ILIKE ${pattern}`;
}

export function not(expression: SQLParser) {
  return sql`NOT (${expression})`;
}

export function and(...expressions: SQLParser[]) {
  return sql`(${expressions.join(" AND ")})`;
}

export function or(...expressions: SQLParser[]) {
  return sql`(${expressions.join(" OR ")})`;
}

export function arrayContains<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column} @> ARRAY[${values}]`;
}

export function arrayContained<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return sql`${column} <@ ARRAY[${values}]`;
}

export function arrayOverlaps<T extends ColumnBuilder = ColumnBuilder>(column1: T, column2: T) {
  return sql`${column1.name} && ${column2.name}`;
}

// Order by
export function asc<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return sql`${column} ASC`;
}

export function desc<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return sql`${column} DESC`;
}
