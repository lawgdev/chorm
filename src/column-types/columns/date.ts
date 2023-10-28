import { ColumnBuilder } from '../builder';
import { DATA_TYPE } from '../validation';

type ValidDateTypes =
	| typeof DATA_TYPE.Date
	| typeof DATA_TYPE.Date32
	| typeof DATA_TYPE.DateTime
	| typeof DATA_TYPE.DateTime64;

interface DateColumnConfig {
	type: ValidDateTypes;
}

export function date(name: string, config: DateColumnConfig) {
	return new ColumnBuilder({
		name,
		type: config.type,
	}).$type<Date>();
}
