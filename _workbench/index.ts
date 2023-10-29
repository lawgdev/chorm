import ClickHouse from "../src/classes/clickhouse";
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

  client.migrate(schemas, "./_workbench/migrations");

  client.query.balls.insert({
    id: "5",
    cancelled: false,
  });

  const items = await client.query.balls.findFirst({
    where: ({ eq }) => eq(schemas.balls.columns.id, "5"),
  });

  console.log(await items.json());
})();
