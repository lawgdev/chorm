import { table, text } from "../src";
import { boolean } from "../src/schema/columns/boolean";
import { integer } from "../src/schema/columns/integer";
import { DATA_TYPE } from "../src/schema/validation";

interface ProjectMemberRole {
  id: number;
}

export const logs = table("logs", {
  id: text("id").notNull().primaryKey().$type<ProjectMemberRole>(),
});

export const balls = table("balls", {
  id: text("id").primaryKey(),
  cancelled: boolean("cancelled"),
});

export const events = table("events", {
  id: integer("id", { type: DATA_TYPE.Int16 }).notNull().primaryKey(),
  cancelled: boolean("cancelled").notNull(),
});

export const notNullTest = table("not_null_test", {
  id: integer("id", { type: DATA_TYPE.Int32 }).notNull().primaryKey(),
  cancelled: boolean("cancelled").notNull(),
  nullableNumber: integer("nullable_number", { type: DATA_TYPE.Int32 }),
});
