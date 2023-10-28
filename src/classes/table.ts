import type {ColumnBuilder} from '../column-types/builder';

export type Table<T extends Record<string, ColumnBuilder> = Record<string, ColumnBuilder>> = {
	name: string;
	columns: T;
};

export function table<T extends Record<string, ColumnBuilder>>(name: string, columns: T): Table<T> {
	return {
		name,
		columns,
	};
}
