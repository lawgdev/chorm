import { AnyEnumValue, EnumKeys, EnumValue } from "../../types/helpers";
import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

export type ValidEnumTypes = typeof DATA_TYPE.Enum8 | typeof DATA_TYPE.Enum16;

interface EnumColumnConfig<T extends Record<EnumKeys, EnumValue>> {
  type: ValidEnumTypes;
  value: T;
}

export function clickhouseEnum<T extends Record<EnumKeys, EnumValue>>(
  name: string,
  config: EnumColumnConfig<T>,
) {
  const { type, value } = config;

  return new ColumnBuilder({
    name,
    type,
    value,
  }).$type<AnyEnumValue<T>>();
}
