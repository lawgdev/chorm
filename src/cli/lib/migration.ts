import fs from "fs";
import path from "path";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import type { MigrationBase } from "../../types/migrate";
import { Logger } from "../../utils/logger";

export default class Migration {
  public async getMigrations(folder: string): Promise<MigrationBase[]> {
    const migrations: MigrationBase[] = [];
    let files: string[];

    try {
      files = fs.readdirSync(folder);
    } catch (e: unknown) {
      if ((e as { code: string })?.code === "ENOENT") {
        fs.mkdirSync(folder);
        files = [];
      } else {
        Logger.error(e);
        process.exit(1);
      }
    }

    for (const file of files) {
      const migrationPath = path.join(folder, file);

      const migrationContent = fs.readFileSync(migrationPath, "utf-8");

      const [version, name] = file.split("_");
      const checksum = migrationContent.length;

      if (!version || !name) {
        Logger.error("Invalid migration file name");
        process.exit(1);
      }

      migrations.push({
        version: Number(version),
        name,
        checksum,
        content: migrationContent,
      });
    }

    return migrations.sort((m1, m2) => m1.version - m2.version);
  }

  public async generateMigrations(folder: string) {
    const migrations = await this.getMigrations(folder);
    const lastMigration = migrations[migrations.length - 1];

    const newMigrationName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const newMigrationVersion = lastMigration
      ? String(lastMigration.version + 1).padStart(4, "0")
      : "0000";

    // Create a new empty migration file
    this.createMigrationFile(folder, newMigrationVersion, newMigrationName, "");
  }

  private createMigrationFile(
    folder: string,
    newMigrationVersion: string,
    newMigrationName: string,
    migrationContent: string,
  ) {
    const migrationFilePath = `${folder}/${newMigrationVersion}_${newMigrationName}.sql`;

    fs.writeFileSync(migrationFilePath, migrationContent);

    Logger.success(`A new migration file has been created at ${migrationFilePath}`);
  }
}
