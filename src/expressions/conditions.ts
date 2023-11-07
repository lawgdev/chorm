import type { ColumnBuilder } from "../schema/builder";
import type { ArrayColumnBuilder, ExtractTypeFromColumn } from "../types/table";
import { SQLParser, sql } from "../utils/sql";

export function eq<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} = ${value}`;
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

export function gte<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} >= ${value}`;
}

export function lt<T extends ColumnBuilder = ColumnBuilder>(
  column: T,
  value: ExtractTypeFromColumn<T>,
) {
  return sql`${column} < ${value}`;
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

export function inArray<T extends ArrayColumnBuilder<ColumnBuilder>>(
  column: T,
  value: ExtractTypeFromColumn<T>[number],
) {
  return sql`has(${column}, ${value})`;
}

export function notInArray<T extends ArrayColumnBuilder<ColumnBuilder>>(
  column: T,
  value: ExtractTypeFromColumn<T>[number],
) {
  return sql`${column} NOT IN (${value})`;
}

export function like<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column} LIKE ${pattern}`;
}

export function ilike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column} ILIKE ${pattern}`;
}

export function notIlike<T extends ColumnBuilder = ColumnBuilder>(column: T, pattern: string) {
  return sql`${column} NOT ILIKE ${pattern}`;
}

function combineExpressions(separator: string, ...expressions: SQLParser[]) {
  let combinedQueryParts: TemplateStringsArray[] = [];
  let combinedArgs: any[] = [];

  expressions.forEach((expression, index) => {
    combinedQueryParts.push(expression.rawQuery);
    if (index < expressions.length - 1) {
      combinedQueryParts.push([` ${separator} `] as unknown as TemplateStringsArray);
    }

    combinedArgs = [...combinedArgs, ...expression.rawArguments];
  });

  const raw = combinedQueryParts.flat() as unknown as TemplateStringsArray;

  return new SQLParser(raw, combinedArgs);
}

export function and(...expressions: SQLParser[]): SQLParser {
  return combineExpressions("AND", ...expressions);
}

export function or(...expressions: SQLParser[]) {
  return combineExpressions("OR", ...expressions);
}

export function arrayContains<T extends ArrayColumnBuilder<ColumnBuilder>>(
  column: T,
  values: ExtractTypeFromColumn<T>[number],
) {
  return sql`${column} @> ARRAY[${values}]`;
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
