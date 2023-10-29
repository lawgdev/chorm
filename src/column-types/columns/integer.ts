import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidIntTypes =
  | typeof DATA_TYPE.UInt8
  | typeof DATA_TYPE.UInt16
  | typeof DATA_TYPE.UInt32
  | typeof DATA_TYPE.UInt64
  | typeof DATA_TYPE.Int8
  | typeof DATA_TYPE.Int16
  | typeof DATA_TYPE.Int32
  | typeof DATA_TYPE.Int64;

interface IntegerColumnConfig {
  type: ValidIntTypes;
}

export function integer(name: string, config: IntegerColumnConfig) {
  return new ColumnBuilder({
    name,
    type: config.type,
  }).$type<number>();
}
