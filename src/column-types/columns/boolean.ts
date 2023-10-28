import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

export function boolean(name: string) {
  return new ColumnBuilder({
    name,
    type: DATA_TYPE.Boolean,
  });
}
