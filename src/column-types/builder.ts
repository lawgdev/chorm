import type { DATA_TYPE } from "./validation";

interface ColumnBuilderOptions {
  name: string;
  type: DATA_TYPE;
  primaryKey?: boolean;
}

export class ColumnBuilder<T = unknown> {
  public columnName: string;
  public columnType: DATA_TYPE;
  public columnPrimaryKey: boolean = false;

  constructor(options: ColumnBuilderOptions) {
    this.columnName = options.name;
    this.columnType = options.type;
    this.columnPrimaryKey = options.primaryKey ?? false;
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
    return this as ColumnBuilder<U>;
  }
}
