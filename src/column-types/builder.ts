import type { DATA_TYPE } from "./validation";

type ColumnBuilderOptions = {
  name: string;
  type: DATA_TYPE;
};

export class ColumnBuilder<_T = unknown> {
  public columnName: string;
  public columnType: DATA_TYPE;
  public columnPrimaryKey = false;

  constructor(options: ColumnBuilderOptions) {
    this.columnName = options.name;
    this.columnType = options.type;
  }

  default() {
    return this;
  }

  notNull() {
    return this;
  }

  primaryKey() {
    this.columnPrimaryKey = true;
    return this;
  }

  $type<U>() {
    return this as unknown as ColumnBuilder<U>;
  }
}
