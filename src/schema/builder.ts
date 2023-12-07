import type { DATA_TYPE } from "./validation";

type ColumnBuilderOptions<T = unknown> = {
  name: string;
  type: DATA_TYPE;
  value?: T;
};

export class ColumnBuilder<T = unknown, R extends boolean = false, D = false> {
  public readonly name: string;
  public readonly type: DATA_TYPE;
  public readonly value: T | null;
  public readonly table?: string;
  public isPrimaryKey = false;
  public isNotNull = false;
  public defaultValue: T | null = null;

  constructor(options: ColumnBuilderOptions<T>) {
    this.name = options.name;
    this.type = options.type;
    this.value = options.value ?? null;
  }

  default(value: T): ColumnBuilder<T, R, true> {
    this.defaultValue = value;
    return this as ColumnBuilder<T, R, true>;
  }

  notNull(): ColumnBuilder<T, true> {
    this.isNotNull = true;
    return this as ColumnBuilder<T, true, D>;
  }

  primaryKey(): this {
    this.isPrimaryKey = true;
    return this;
  }

  $type<U>(): ColumnBuilder<U, R> {
    return this as unknown as ColumnBuilder<U, R, D>;
  }
}
