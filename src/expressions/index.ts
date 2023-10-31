import * as conditions from "./conditions";

export type AllExpressions = typeof conditions;

export function combineExpression(...conditions: string[]) {
  return conditions.join(" AND ");
}
