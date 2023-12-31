import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

export function map(name: string) {
  return new ColumnBuilder({
    name,
    type: DATA_TYPE.Map,
  }).$type<Map<string, any>>();
}
