import type {QueryParams} from '@clickhouse/client';
import type {Client, Table} from '.';
import type {ColumnBuilder} from '../column-types/builder';

type ExtractPropsFromTable<T extends Table> = T extends Table<infer U>
	? {
			[K in keyof U]: U[K] extends ColumnBuilder<infer V> ? V : never;
	  }
	: never;

type GenericParams<T extends Table> = {
	where: {
		[K in keyof ExtractPropsFromTable<T>]?: ExtractPropsFromTable<T>[K];
	};
};

export class Query<T extends Table> {
	private readonly table: T;
	private readonly client: Client;
	private readonly database: string | undefined;

	constructor(client: Client, database: string | undefined, table: T) {
		this.client = client;
		this.database = database;
		this.table = table;
	}

	public async findFirst(_params: GenericParams<T>) {
		return this.client.query({
			query: `SELECT * FROM ${this.database}.${this.table.name}`,
		});
	}

	public findMany(_params: GenericParams<T>) {
		//  TODO: implement
	}

	public insert(_params: ExtractPropsFromTable<T>) {
		//  TODO: implement
	}

	public delete(_params: GenericParams<T>) {
		//  TODO: implement
	}

	public update(_params: GenericParams<T>) {
		//  TODO: implement
	}

	public async raw(params: QueryParams) {
		return this.client.query(params);
	}
}
