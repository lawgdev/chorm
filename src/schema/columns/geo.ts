import { ColumnBuilder } from "../builder";
import { DATA_TYPE } from "../validation";

type ValidGeoTypes =
  | typeof DATA_TYPE.Point
  | typeof DATA_TYPE.Ring
  | typeof DATA_TYPE.Polygon
  | typeof DATA_TYPE.MultiPolygon;

interface GeoColumnConfig {
  type: ValidGeoTypes;
}

const geoTypeConfig: Record<ValidGeoTypes, any> = {
  [DATA_TYPE.Point]: [Number, Number],
  [DATA_TYPE.Ring]: [[Number, Number]],
  [DATA_TYPE.Polygon]: [[[Number, Number]]],
  [DATA_TYPE.MultiPolygon]: [[[[Number, Number]]]],
};

export function geo(name: string, config: GeoColumnConfig) {
  const { type } = config;
  const columnType = geoTypeConfig[type];

  return new ColumnBuilder({
    name,
    type,
  }).$type<typeof columnType>();
}
