import ClickHouse from "../src/classes/clickhouse";
import { eq } from "../src/expressions/conditions";
import * as schemas from "./schemas";

(async () => {
  const client = new ClickHouse({
    host: "https://lhe6wu5y42.us-east-2.aws.clickhouse.cloud:8443",
    username: "default",
    password: "Ea2ERtJC0_piS",
    schemas: schemas,
    database: "default",
    debug: true,
  });

  await client.migrate({ folder: "./_workbench/migrations" });

  const items = await client.query.balls.findFirst({
    where: eq(schemas.balls.columns.cancelled, false),
  });

  const items2 = await client.query.balls.insert({
    id: "1",
    cancelled: true,
  });
})();
