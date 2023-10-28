import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

export function uuid(name: string) {
  return new ColumnBuilder({
    name, 
    type: DATA_TYPE.UUID
  });
}
