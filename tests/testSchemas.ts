import { boolean, date, float, integer, table, text, uuid } from "../src";
import { array } from "../src/schema/columns/array";
import { DATA_TYPE } from "../src/schema/validation";

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
    emails: array("emails", { type: DATA_TYPE.String }).$type<string[]>().notNull(),
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
    array: array("array", { type: DATA_TYPE.String }).$type<string[]>().notNull(),
  }),
  ordering: table("ordering", {
    id: text("id").primaryKey().notNull(),
    num: integer("num").notNull(),
  }),
};
