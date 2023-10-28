export enum DATA_TYPE {
  UInt8 = "UInt8",
  UInt16 = "UInt16",
  UInt32 = "UInt32",
  UInt64 = "UInt64",
  Int8 = "Int8",
  Int16 = "Int16",
  Int32 = "Int32",
  Int64 = "Int64",
  Float32 = "Float32",
  Float64 = "Float64",
  Boolean = "Boolean",
  String = "String",
  UUID = "UUID",
  Date = "Date",
  Date32 = "Date32",
  DateTime = "DateTime",
  DateTime64 = "DateTime64",
  Enum8 = "Enum8",
  Enum16 = "Enum16",
}

export interface ColumnResponse {
  name: string;
  type: DATA_TYPE;
}
