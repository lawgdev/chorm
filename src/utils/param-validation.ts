import { ColumnBuilder } from "../schema/builder";
import { convertValueToString, parseFullColumnType } from "./helpers";
import { SQLParser } from "./sql";

export function validateParam(obj: { [x: string]: string }) {
  return Object.values(obj).join(" ").trim();
}

export function parseQuery(sqlParser: SQLParser, prefixer?: string) {
  const { rawQuery, rawArguments } = sqlParser;
  const params: Record<string, any> = {};

  let columnType: string;
  let argIndex = 0;
  const template = rawQuery.reduce((acc, current) => {
    if (current.trim() !== "") {
      return acc + current;
    }

    const arg = rawArguments[argIndex];
    if (arg instanceof ColumnBuilder) {
      columnType = !arg.value
        ? arg.type
        : `${arg.type}(${convertValueToString(arg.type, arg.value)})}`;
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
    queryParams: params,
  };
}

export function parseValues(...values: Array<{ column: ColumnBuilder; value: any }>) {
  const params: Record<string, any> = {};
  const template = values.reduce((acc, valuePartial, index) => {
    const { column, value } = valuePartial;
    const key = `v${index}`;
    const columnType = parseFullColumnType(column);

    params[key] = value;
    return acc + (index === 0 ? "" : ", ") + `{${key}: ${columnType}}`;
  }, "");

  return {
    template,
    query_params: params,
  };
}
