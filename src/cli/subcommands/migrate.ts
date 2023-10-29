import { Command } from "commander";

export const migrateCliCommand = new Command()
  .name("migrate")
  .description("migrate your clickhouse schema")
  .action(async () => {
    console.log("i love chorm");
  });
