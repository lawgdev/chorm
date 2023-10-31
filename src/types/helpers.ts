export type NullableKeys<T> = {
  [P in keyof T]: null extends T[P] ? P : never;
}[keyof T];

export type OptionalKeys<T> = {
  [P in keyof T]: undefined extends T[P] ? P : never;
}[keyof T];

export type ToOptional<T, O extends "null" | "optional" = "null"> = Partial<
  Pick<T, O extends "null" ? NullableKeys<T> : OptionalKeys<T>>
> &
  Omit<T, O extends "null" ? NullableKeys<T> : OptionalKeys<T>>;
