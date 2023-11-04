import { boolean, date, float, integer, table, text, uuid } from "../src";
import ClickHouse from "../src/classes/clickhouse";
import { DATA_TYPE } from "../src/schema/validation";
import checkProperties from "./client/checkProperties";
import defined from "./client/defined";
import createCustomer from "./query/complex/createCustomer";
import getCustomer from "./query/complex/getCustomer";
import createUser from "./query/createUser";
import deleteUser from "./query/deleteUser";
import getUser from "./query/getUser";
import updateUser from "./query/updateUser";

export enum Test {
  A,
  B,
  C,
}

export const testSchemas = {
  users: table("users", {
    id: text("id").primaryKey().notNull(),
    username: text("username").notNull(),
    password: text("password").notNull(),
    phone_number: text("phone_number").$type<`+1 ${string}`>(),
  }),
  customers: table("customers", {
    id: text("id").primaryKey().notNull(),
    customer_name: text("customer_name").notNull(),
    is_admin: boolean("is_admin").notNull().default(false),
    created_at: date("created_at", { type: DATA_TYPE.DateTime64 }).notNull(),
    pi: float("pi", { type: DATA_TYPE.Float32 }).notNull().default(3.14),
    card_number: integer("card_number", { type: DATA_TYPE.Int32 }).notNull(),
    uuid: uuid("uuid").notNull(),
    null_column: text("null_column"),
  }),
};

export function doAsync(c: () => void) {
  setTimeout(c, 1000);
}

export let chorm: ClickHouse<typeof testSchemas>;

beforeAll(async () => {
  chorm = new ClickHouse({
    host: "http://localhost:8123",
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
