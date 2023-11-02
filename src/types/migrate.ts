export interface MigrationBase {
  version: number;
  name: string;
  checksum: number;
  content: string;
}

export interface MigrationsRowData {
  version: number;
  checksum: string;
  migration_name: string;
}
