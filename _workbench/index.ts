import ClickHouse from "../src/classes/clickhouse";
import * as schemas from "./schemas";

(async () => {
  const client = new ClickHouse({
    host: "http://localhost:8123",
    username: "default",
    password: "password",
    schemas: schemas,
    database: "default",
    debug: true,
  });

  await client.migrate({ folder: "./_workbench/migrations" });

  const items = await client.query.balls.findFirst({
    where: (table, { eq }) => eq(table.columns.cancelled, false),
  });

  const items2 = await client.query.balls.insert({
    id: "1",
    cancelled: true,
  });

  console.log(items, items2);
})();
