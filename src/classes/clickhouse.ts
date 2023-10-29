import { ClickHouseLogLevel, createClient as internalCHClient } from "@clickhouse/client";
import { Logger } from "../utils/logger";
import { Query } from "./query";
import type { ClickHouseEngine } from "../types/engine";
import fs from "fs";
import type { MigrationBase } from "../types";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import type { Table } from "../types/table";
import path from "path";

type Options<T extends Record<string, Record<string, unknown>>> = Parameters<
  typeof internalCHClient
>["0"] & {
  engine?: ClickHouseEngine;
  schemas: T;
  pingInterval?: number;
  debug?: boolean;
};

export type Client = ReturnType<typeof internalCHClient>;

type Queries<T extends Record<string, Table>> = {
  [K in keyof T]: Query<T[K]>;
};

export default class ClickHouse<T extends Record<string, Table>> {
  public readonly client: Client;
  private readonly options: Options<T>;

  public readonly query: Queries<T>;

  constructor(options: Options<T>) {
    this.client = internalCHClient({
      log: { LoggerClass: Logger, level: ClickHouseLogLevel.DEBUG },
      ...options,
    });
    this.options = options;
    this.client.query({
      query: `CREATE DATABASE IF NOT EXISTS ${options.database}`,
    });

    this.query = Object.entries(options.schemas).reduce<Queries<T>>((acc, [key, value]) => {
      return {
        ...acc,
        [key]: new Query(this.client, this.options.database, value),
      };
    }, {} as Queries<T>);
  }

  public async migrate({ folder }: { folder: string }) {
    this.startMigrations();
    this.generateMigrations(folder);
  }

  private async startMigrations() {
    try {
      for (const [tableName, tableColumns] of Object.entries(this.options.schemas)) {
        const columns = Object.entries(tableColumns.columns).map(([columnName, column]) => {
          return `${columnName} ${column.columnType}`;
        });

        const primaryKeyColumn = Object.entries(tableColumns.columns).find(
          ([_, column]) => column.columnPrimaryKey,
        )?.[0];

        await this.client.query({
          query: `
          CREATE TABLE IF NOT EXISTS ${this.options.database}.${tableName}
          (
            ${columns.join(",\n")}
          )
          ENGINE = MergeTree()
          ${primaryKeyColumn ? `PRIMARY KEY ${primaryKeyColumn}` : ""}
          `,
        });
      }

      await this.client.exec({
        query: `CREATE TABLE IF NOT EXISTS _migrations (
          uid UUID DEFAULT generateUUIDv4(), 
          version UInt32,
          checksum String, 
          migration_name String, 
          applied_at DateTime DEFAULT now()
        ) 
        ENGINE = MergeTree 
        ORDER BY tuple(applied_at)`,
      });
    } catch (e: unknown) {
      Logger.error("Error while creating _migrations table", e);
      process.exit(1);
    }
  }

  private async getMigrations(folder: string): Promise<MigrationBase[]> {
    const migrations: MigrationBase[] = [];
    let files: string[];

    const migrationsFolderPath = path.join(process.cwd(), folder);

    try {
      files = fs.readdirSync(folder);
    } catch (e: unknown) {
      if ((e as { code: string })?.code === "ENOENT") {
        fs.mkdirSync(migrationsFolderPath);
        files = [];
      } else {
        Logger.error("Error while reading migrations folder", e);
        process.exit(1);
      }
    }

    for (const file of files) {
      const migrationPath = path.join(migrationsFolderPath, file);

      const migrationContent = fs.readFileSync(migrationPath, "utf-8");

      const [version, filename] = file.split("_");
      const checksum = migrationContent.length;

      if (!version || !filename) {
        Logger.error("Error while reading migration file", "Invalid migration file name");
        process.exit(1);
      }

      migrations.push({
        version: Number(version),
        filename,
        checksum,
        content: migrationContent,
      });
    }

    return migrations.sort((m1, m2) => m1.version - m2.version);
  }

  private async generateMigrations(folder: string) {
    const migrations = await this.getMigrations(folder);
    const lastMigration = migrations[migrations.length - 1];

    const newMigrationName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });

    const newMigrationVersion = lastMigration
      ? String(lastMigration.version + 1).padStart(4, "0")
      : "0000";

    const newMigrationContent = ``;

    this.createMigrationFile(folder, newMigrationVersion, newMigrationName, newMigrationContent);
  }

  private createMigrationFile(
    folder: string,
    newMigrationVersion: string,
    newMigrationName: string,
    migrationContent: string,
  ) {
    const migrationFilePath = `${folder}/${newMigrationVersion}_${newMigrationName}.sql`;

    fs.writeFileSync(migrationFilePath, migrationContent);

    Logger.success(
      "Migration file created",
      `A new migration file has been created at ${migrationFilePath}`,
    );
  }

  public async ping() {
    await this.client.ping();
  }

  public async reset() {
    await this.client.query({
      query: `DROP DATABASE IF EXISTS ${this.options.database}`,
    });
  }

  public async close() {
    await this.client.close();
  }
}
