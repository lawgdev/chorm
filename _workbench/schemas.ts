import { table, text } from "../src";

interface ProjectMemberRole {
  id: number;
}

export const logs = table("logs", {
  id: text("id").notNull().$type<ProjectMemberRole>().primaryKey(),
});

export const events = table("events", {
  id: text("id"),
});
