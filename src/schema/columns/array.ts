import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

export function array(name: string, config: { type: DATA_TYPE }) {
  return new ColumnBuilder({
    name,
    type: DATA_TYPE.Array,
    value: config.type,
  }).$type<string[]>();
}
