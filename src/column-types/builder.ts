import type { DATA_TYPE } from "./validation";

type ColumnBuilderOptions = {
  name: string;
  type: DATA_TYPE;
};

export class ColumnBuilder<T = unknown, R extends boolean = false> {
  public columnName: string;
  public columnType: DATA_TYPE;
  public columnPrimaryKey = false;
  public columnRequired = false;

  public defaultValue: T | null = null;

  constructor(options: ColumnBuilderOptions) {
    this.columnName = options.name;
    this.columnType = options.type;
  }

  default(value: T) {
    this.defaultValue = value;
    return this;
  }

  notNull() {
    this.columnRequired = true;
    return this as ColumnBuilder<T, true>;
  }

  primaryKey() {
    this.columnPrimaryKey = true;
    return this;
  }

  $type<U>() {
    return this as unknown as ColumnBuilder<U, R>;
  }
}
