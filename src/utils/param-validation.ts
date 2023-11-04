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
  let argIndex = 0;
  const template = rawQuery.reduce((acc, current) => {
    if (current.trim() !== "") {
      return acc + current;
    }

    const arg = rawArguments[argIndex];
    if (arg instanceof ColumnBuilder) {
      columnType = arg.type;
      argIndex++;

      return acc + arg.name;
    }

    const key = `${prefixer ?? ""}v${argIndex}`;
    params[key] = arg;
    argIndex++;

    return acc + `{${key}: ${columnType}}`;
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
    const columnType = column.isNotNull ? column.type : `Nullable(${column.type})`;

    params[key] = value;
    return acc + (index === 0 ? "" : ", ") + `{${key}: ${columnType}}`;
  }, "");

  return {
    template,
    query_params: params,
  };
}
