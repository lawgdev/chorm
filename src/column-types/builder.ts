import type { DATA_TYPE } from "./validation";

interface ColumnBuilderOptions {
  name: string;
  type: DATA_TYPE;
  primaryKey?: boolean;
}

export class ColumnBuilder<T = unknown> {
  public columnName: string;
  public columnType: DATA_TYPE;
  public primaryKey: boolean = false;

  constructor(options: ColumnBuilderOptions) {
    this.columnName = options.name;
    this.columnType = options.type;
  }

  notNull() {
    return this;
  }

  isPrimaryKey() {
    this.primaryKey = true;
    return this;
  }

  $type<U>() {
    return this as ColumnBuilder<U>;
  }
}
