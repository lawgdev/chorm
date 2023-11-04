import type { DATA_TYPE } from "./validation";

type ColumnBuilderOptions<T = unknown> = {
  name: string;
  type: DATA_TYPE;
  value?: T;
};

export class ColumnBuilder<T = unknown, R extends boolean = false> {
  public readonly name: string;
  public readonly type: DATA_TYPE;
  public isPrimaryKey = false;
  public isNotNull = false;
  public value: T | null;
  public table?: string;

  public defaultValue: T | null = null;

  constructor(options: ColumnBuilderOptions<T>) {
    this.name = options.name;
    this.type = options.type;
    this.value = options.value ?? null;
  }

  default(value: T): this {
    this.defaultValue = value;
    return this;
  }

  notNull(): ColumnBuilder<T, true> {
    this.isNotNull = true;
    return this as ColumnBuilder<T, true>;
  }

  primaryKey(): this {
    this.isPrimaryKey = true;
    return this;
  }

  $type<U>(): ColumnBuilder<U, R> {
    return this as unknown as ColumnBuilder<U, R>;
  }

  references(_ref: () => ColumnBuilder): this {
    return this;
  }
}
