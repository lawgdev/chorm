import ClickHouse from "../src/classes/clickhouse";
import checkProperties from "./client/checkProperties";
import defined from "./client/defined";
import createCustomer from "./query/complex/createCustomer";
import getCustomer from "./query/complex/getCustomer";
import createUser from "./query/createUser";
import deleteUser from "./query/deleteUser";
import getUser from "./query/getUser";
import updateUser from "./query/updateUser";
import { testSchemas } from "./testSchemas";
import parseQuery from "./utils/parseQuery";
import "dotenv/config";

export function doAsync(c: () => void) {
  setTimeout(c, 1000);
}

export let chorm: ClickHouse<typeof testSchemas>;

const CLICKHOUSE_HOST = process.env.CLICKHOUSE_URL ?? "http://localhost:8123";

beforeAll(async () => {
  chorm = new ClickHouse({
    host: CLICKHOUSE_HOST,
    username: "default",
    password: "password",
    schemas: testSchemas,
    database: "default",
    debug: true,
  });

  await chorm.migrate();
});

afterAll(async () => {
  // drop all tables, not the database
  await chorm.client.exec({
    query: "DROP TABLE IF EXISTS users",
  });

  await chorm.client.exec({
    query: "DROP TABLE IF EXISTS customers",
  });
  await chorm.close();
});

describe("Test chorm", () => {
  /* parseQuery validation */
  it("should test parseQuery", parseQuery);
  /* Client */
  it("should be defined", defined);
  it("should have all schemas in .query", checkProperties);

  /* Query */
  it("should create a user", createUser);
  it("should fetch a user", getUser);
  it("should update user", updateUser);
  it("should delete user", deleteUser);

  /* Complex Query */
  it("should create customer", createCustomer);
  it("should fetch customer", getCustomer);
});
