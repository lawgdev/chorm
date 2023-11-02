import type { ColumnBuilder } from "../schema/builder";
import type { ExtractTypeFromColumn } from "../types/table";

// Where
export function eq<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return `(${column.name} = ${column.sqlParser(value)})`;
}

export function ne<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return `${column.name} <> ${column.sqlParser(value)}`;
}

export function gt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return `${column.name} > ${column.sqlParser(value)}`;
}

export function lt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return `${column.name} < ${column.sqlParser(value)}`;
}

export function gte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return `${column.name} >= ${column.sqlParser(value)}`;
}

export function lte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return `${column.name} <= ${column.sqlParser(value)}`;
}

export function isNull<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return `${column.name} IS NULL`;
}

export function isNotNull<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return `${column.name} IS NOT NULL`;
}

export function inArray<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return `${column.name} IN (${values})`;
}

export function notInArray<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return `${column.name} NOT IN (${values})`;
}

export function exists(subquery: string) {
  return `EXISTS (${subquery})`;
}

export function notExists(subquery: string) {
  return `NOT EXISTS (${subquery})`;
}

export function between<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  minValue: ExtractTypeFromColumn<T>,
  maxValue: ExtractTypeFromColumn<T>,
) {
  return `${column.name} BETWEEN ${minValue} AND ${maxValue}`;
}

export function like<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return `${column.name} LIKE ${pattern}`;
}

export function ilike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return `${column.name} ILIKE ${pattern}`;
}

export function notBetween<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  minValue: ExtractTypeFromColumn<T>,
  maxValue: ExtractTypeFromColumn<T>,
) {
  return `${column.name} NOT BETWEEN ${minValue} AND ${maxValue}`;
}

export function notIlike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return `${column.name} NOT ILIKE ${pattern}`;
}

export function not(expression: string) {
  return `NOT (${expression})`;
}

export function and(...expressions: string[]) {
  return `(${expressions.join(" AND ")})`;
}

export function or(...expressions: string[]) {
  return `(${expressions.join(" OR ")})`;
}

export function arrayContains<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return `${column.name} @> ARRAY[${values}]`;
}

export function arrayContained<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  values: ExtractTypeFromColumn<T>[],
) {
  return `${column.name} <@ ARRAY[${values}]`;
}

export function arrayOverlaps<T extends ColumnBuilder = ColumnBuilder>(column1: T, column2: T) {
  return `${column1.name} && ${column2.name}`;
}

// Order by
export function asc<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return `${column.name} ASC`;
}

export function desc<T extends ColumnBuilder = ColumnBuilder>(column: T) {
  return `${column.name} DESC`;
}
