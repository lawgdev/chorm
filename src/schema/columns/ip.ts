import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidIPTypes = typeof DATA_TYPE.IPv4 | typeof DATA_TYPE.IPv6;

interface IPColumnConfig {
  type: ValidIPTypes;
}

export function ip(name: string, config: IPColumnConfig) {
  const { type } = config;

  return new ColumnBuilder({
    name,
    type,
  }).$type<string>();
}
