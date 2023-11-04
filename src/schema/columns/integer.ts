import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidIntTypes =
  | typeof DATA_TYPE.UInt8
  | typeof DATA_TYPE.UInt16
  | typeof DATA_TYPE.UInt32
  | typeof DATA_TYPE.UInt64
  | typeof DATA_TYPE.Int128
  | typeof DATA_TYPE.Int256
  | typeof DATA_TYPE.Int8
  | typeof DATA_TYPE.Int16
  | typeof DATA_TYPE.Int32
  | typeof DATA_TYPE.Int64
  | typeof DATA_TYPE.Int128
  | typeof DATA_TYPE.Int256;

interface IntegerColumnConfig {
  type: ValidIntTypes;
}

export function integer(name: string, config: IntegerColumnConfig = { type: DATA_TYPE.Int32 }) {
  const { type } = config;

  return new ColumnBuilder({
    name,
    type,
  }).$type<number>();
}
