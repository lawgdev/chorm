import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidFloatTypes =
  | typeof DATA_TYPE.Float32
  | typeof DATA_TYPE.Float64
  | typeof DATA_TYPE.Decimal32
  | typeof DATA_TYPE.Decimal64
  | typeof DATA_TYPE.Decimal128
  | typeof DATA_TYPE.Decimal256;

interface FloatColumnConfig {
  type: ValidFloatTypes;
}

export function float(name: string, config: FloatColumnConfig) {
  const { type } = config;

  return new ColumnBuilder({
    name,
    type,
  }).$type<number>();
}
