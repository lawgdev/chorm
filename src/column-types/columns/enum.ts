import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidEnumTypes = typeof DATA_TYPE.Enum8 | typeof DATA_TYPE.Enum16;

interface EnumColumnConfig {
  type: ValidEnumTypes;
}

export function clickhouseEnum(name: string, config: EnumColumnConfig) {
  return new ColumnBuilder({
    name,
    type: config.type,
  }).$type<[string, ...string[]][number]>();
}
