import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

export function array(name: string) {  
  return new ColumnBuilder({
    name,
    type: DATA_TYPE.Array,
  }).$type<string[]>();
}
