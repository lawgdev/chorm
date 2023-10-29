import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidFloatTypes = typeof DATA_TYPE.Float32 | typeof DATA_TYPE.Float64;

interface FloatColumnConfig {
  type: ValidFloatTypes;
}

export function float(name: string, config: FloatColumnConfig) {
  return new ColumnBuilder({
    name,
    type: config.type,
  }).$type<number>();
}
