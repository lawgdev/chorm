import * as conditions from "./conditions";

export type AllExpressions = Omit<typeof conditions, "asc" | "desc">;
export type OrderByExpression = { asc: typeof conditions.asc; desc: typeof conditions.desc };

export function combineExpression(...conditions: string[]) {
  return conditions.join(" AND ");
}
