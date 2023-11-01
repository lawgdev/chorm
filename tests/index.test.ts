import { boolean, clickhouseEnum, date, float, integer, table, text, uuid } from "../src";
import ClickHouse from "../src/classes/clickhouse";
import { DATA_TYPE } from "../src/schema/validation";
import checkProperties from "./client/checkProperties";
import defined from "./client/defined";
import createUser from "./query/createUser";
import getUser from "./query/getUser";

enum Test {
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
    created_at: date("created_at", { type: DATA_TYPE.Date }).notNull(),
    random_enum: clickhouseEnum("random_enum", {
      type: DATA_TYPE.Enum8,
      value: Test,
    }),
    pi: float("pi", { type: DATA_TYPE.Float32 }).notNull().default(3.14),
    card_number: integer("card_number", { type: DATA_TYPE.Int32 }).notNull(),
    uuid: uuid("uuid").notNull(),
  }),
};

export let chorm: ClickHouse<typeof testSchemas>;

beforeAll(async () => {
  chorm = new ClickHouse({
    host: "https://lhe6wu5y42.us-east-2.aws.clickhouse.cloud:8443",
    username: "default",
    password: "Ea2ERtJC0_piS",
    schemas: testSchemas,
    database: "default",
    debug: true,
  });

  await chorm.migrate();
});

afterAll(async () => {
  await chorm.close();
});

describe("Test chorm", () => {
  /* Client */
  it("should be defined", defined);
  it("should have all schemas in .query", checkProperties);

  /* Query */
  it("should create a user", createUser);
  it("should fetch a user", getUser);
});
