import type { Client, Table } from ".";

export class Query<T extends Table> {
  private readonly table: T;
  private readonly client: Client;

  constructor(client: Client, table: T) {
    this.client = client;
    this.table = table;
  }

  public async findFirst() {
    return await this.client.query({
      query: `SELECT * FROM default.${this.table} LIMIT 1`,
    });
  }

  public findMany() {
    //  TODO: implement
  }

  public insert() {
    //  TODO: implement
  }

  public delete() {
    // Todo implement
  }

  public update() {
    // Todo implement
  }
}
