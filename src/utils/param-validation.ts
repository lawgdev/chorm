import { ColumnBuilder } from "../schema/builder";
import { DATA_TYPE } from "../schema/validation";
import { SQLParser } from "./sql";

export function validateParam(obj: { [x: string]: string }) {
  return Object.values(obj).join(" ").trim();
}

export function parseQuery(sqlParser: SQLParser, prefixer?: string) {
  const { rawQuery, rawArguments } = sqlParser;

  const params: Record<string, any> = {};

  let columnType: DATA_TYPE;
  const template = rawQuery.reduce((acc, current, index) => {
    const arg = rawArguments[index];

    if (!arg) return acc + current;
    if (arg instanceof ColumnBuilder) {
      columnType = arg.type;
      return acc + current + arg.name;
    }

    const key = `${prefixer ?? ""}v${index}`;

    params[key] = arg;
    return acc + current + `{${key}: ${columnType}}`;
  }, "");

  return {
    template,
    query_params: params,
  };
}

export function parseValues(...values: Array<{ column: ColumnBuilder; value: any }>) {
  const params: Record<string, any> = {};
  const template = values.reduce((acc, valuePartial, index) => {
    const { column, value } = valuePartial;
    const key = `v${index}`;

    params[key] = value;
    return acc + (index === 0 ? "" : ", ") + `{${key}: ${column.type}}`;
  }, "");

  return {
    template,
    query_params: params,
  };
}
