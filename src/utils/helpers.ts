import { ColumnBuilder } from "../schema/builder";
import { DATA_TYPE } from "../schema/validation";
import { EnumKeys, EnumValue } from "../types/helpers";

export function parseFullColumnType(column: ColumnBuilder) {
  let final: string = column.type;

  if (column.value) {
    final = `${final}(${convertValueToString(column.type, column.value)})`;
  }

  if (!column.isNotNull) {
    final = `Nullable(${final})`;
  }

  return final;
}

export function convertValueToString(dataType: DATA_TYPE, value: unknown) {
  switch (dataType) {
    case (DATA_TYPE.Enum8, DATA_TYPE.Enum16):
      return convertEnumToString(value as Record<EnumKeys, EnumValue>);

    default:
      return value;
  }
}

export function convertEnumToString<T extends Record<EnumKeys, EnumValue>>(enumValue: T): string {
  const objectifyEnum = Object.keys(enumValue)
    .filter(key => isNaN(Number(key)))
    .reduce((acc, key) => {
      return {
        ...acc,
        [key]: enumValue[key],
      };
    }, {});

  return Object.entries(objectifyEnum)
    .map(([k, v]) => `'${k}' = ${v}`)
    .join(", ");
}
