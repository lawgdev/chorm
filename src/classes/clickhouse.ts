import { createClient as internalCHClient } from '@clickhouse/client';
import { Logger } from '../utils/logger';
import type { Table } from '.';
import { Query } from './query';

type Options<T extends Record<string, Record<string, unknown>>> = Parameters<
	typeof internalCHClient
>['0'] & {
	schemas: T;
	pingInterval?: number;
	debug?: boolean;
};

export type Client = ReturnType<typeof internalCHClient>;

type Queries<T extends Record<string, Table>> = {
	[K in keyof T]: Query<T[K]>;
};

export default class ClickHouse<T extends Record<string, Table>> {
	private readonly client: Client;
	private readonly options: Options<T>;

	public readonly query: Queries<T>;

	constructor(options: Options<T>) {
		this.client = internalCHClient({
			log: { LoggerClass: Logger },
			...options,
		});
		this.options = options;
		this.client.query({
			query: `CREATE DATABASE IF NOT EXISTS ${options.database}`,
		});

		this.query = Object.entries(options.schemas).reduce<Queries<T>>((acc, [key, value]) => {
			return {
				...acc,
				[key]: new Query(this.client, this.options.database, value),
			};
		}, {} as Queries<T>);

		this.migrate(options.schemas);
	}

	private async migrate(schemas: T) {
		for (const [tableName, tableColumns] of Object.entries(schemas)) {
			const columns = Object.entries(tableColumns.columns).map(([columnName, column]) => {
				return `${columnName} ${column.columnType}`;
			});

			const primaryKeyColumn = Object.entries(tableColumns.columns).find(
				([_, column]) => column.columnPrimaryKey,
			)?.[0];

			await this.client.query({
				query: `
        CREATE TABLE IF NOT EXISTS ${this.options.database}.${tableName}
        (
          ${columns.join(',\n')}
        )
        ENGINE = MergeTree()
        ${primaryKeyColumn ? `PRIMARY KEY ${primaryKeyColumn}` : ''}
        `,
			});
		}
	}
}
