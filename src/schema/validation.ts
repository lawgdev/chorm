export enum DATA_TYPE {
  UInt8 = "UInt8",
  UInt16 = "UInt16",
  UInt32 = "UInt32",
  UInt64 = "UInt64",
  UInt128 = "UInt128",
  UInt256 = "UInt256",
  Int8 = "Int8",
  Int16 = "Int16",
  Int32 = "Int32",
  Int64 = "Int64",
  Int128 = "Int128",
  Int256 = "Int256",
  Float32 = "Float32",
  Float64 = "Float64",
  Decimal32 = "Decimal32",
  Decimal64 = "Decimal64",
  Decimal128 = "Decimal128",
  Decimal256 = "Decimal256",
  Boolean = "Boolean",
  String = "String",
  FixedString = "FixedString",
  UUID = "UUID",
  Date = "Date",
  Date32 = "Date32",
  DateTime = "DateTime",
  DateTime64 = "DateTime64",
  Enum8 = "Enum8",
  Enum16 = "Enum16",
  Array = "Array",
  JSON = "JSON",
  IPv4 = "IPv4",
  IPv6 = "IPv6",
  LowCardinality = "LowCardinality",
  Map = "Map",
  Point = "Point",
  Ring = "Ring",
  Polygon = "Polygon",
  MultiPolygon = "MultiPolygon",

  // TODO: support these types
  Nested = "Nested",
  Tuple = "Tuple",
  SimpleAggregateFunction = "SimpleAggregateFunction",
  AggregateFunction = "AggregateFunction",
  Expression = "Expression",
  Set = "Set",
  Interval = "Interval",
}
