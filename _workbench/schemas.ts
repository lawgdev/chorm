import { table, text } from "../src";
import { boolean } from "../src/column-types/columns/boolean";
import { integer } from "../src/column-types/columns/integer";
import { DATA_TYPE } from "../src/column-types/validation";

interface ProjectMemberRole {
  id: number;
}

export const logs = table("logs", {
  id: text("id").notNull().primaryKey().$type<ProjectMemberRole>(),
});

export const balls = table("events", {
  id: text("id").notNull().primaryKey(),
  cancelled: boolean("cancelled").notNull(),
});

export const events = table("events", {
  id: integer("id", { type: DATA_TYPE.Int16 }).notNull().primaryKey(),
  cancelled: boolean("cancelled").notNull(),
});
