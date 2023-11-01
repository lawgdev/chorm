import { Command } from "commander";
import Migration from "../lib/migration";
import { Logger } from "../../utils/logger";

export const migrateCliCommand = new Command()
  .name("migrate")
  .description("migrate your clickhouse schema")
  .option("-f, --folder <folder>", "folder to store migrations")
  .action(async ({ folder }: { folder: string }) => {
    const migration = new Migration();

    if (!folder) {
      Logger.error("Please provide a folder to store migrations (ex. --folder migrations)");
      process.exit(1);
    }
    
    migration.generateMigrations(folder);
  });
