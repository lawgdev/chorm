import { EnumKeys, EnumValue } from "../types/helpers";

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
