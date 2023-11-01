import type { DATA_TYPE } from "./validation";

type ColumnBuilderOptions<T = unknown> = {
  name: string;
  type: DATA_TYPE;
  value?: T;
  parser?: (value: any) => any;
};

export class ColumnBuilder<T = unknown, R extends boolean = false> {
  public readonly name: string;
  public readonly type: DATA_TYPE;
  public isPrimaryKey = false;
  public isNotNull = false;
  public value: T | null;

  public defaultValue: T | string | null = null;
  public sqlParser: (value: any) => any;

  constructor(options: ColumnBuilderOptions<T>) {
    this.name = options.name;
    this.type = options.type;
    this.sqlParser = options.parser ?? (value => value);
    this.value = options.value ?? null;
  }

  default(value: T) {
    this.defaultValue = value;
    return this;
  }

  defaultRandom() {
    this.defaultValue = `generateUUIDv4()`;
    return this;
  }

  notNull() {
    this.isNotNull = true;
    return this as ColumnBuilder<T, true>;
  }

  primaryKey() {
    this.isPrimaryKey = true;
    return this;
  }

  $type<U>() {
    return this as unknown as ColumnBuilder<U, R>;
  }
}
