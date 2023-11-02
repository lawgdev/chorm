import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidStringTypes = typeof DATA_TYPE.String | typeof DATA_TYPE.FixedString;

interface StringColumnConfig {
  type: ValidStringTypes;
}

export function text(name: string, config: StringColumnConfig = { type: DATA_TYPE.String }) {
  const { type } = config;

  return new ColumnBuilder({
    name,
    type,
    parser(value) {
      return `'${value}'`;
    },
  }).$type<string>();
}
