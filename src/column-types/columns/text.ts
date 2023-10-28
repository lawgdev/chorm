import { ColumnBuilder } from '../builder';
import { DATA_TYPE } from '../validation';

export function text(name: string) {
	return new ColumnBuilder({
		name,
		type: DATA_TYPE.String,
	}).$type<string>();
}
