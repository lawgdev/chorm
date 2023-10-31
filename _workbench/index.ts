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

  // client.migrate({ folder: "./_workbench/migrations" });

  client.query.balls.insert({
    id: "5",
    cancelled: false,
  });

  const item = await client.query.balls.findFirst({
    where: eq(schemas.balls.columns.id, "true"),
  });

  const foundItemId = item?.id;

  const items = await client.query.balls.findMany({
    where: eq(schemas.balls.columns.cancelled, false),
  });

  const foundItemsId = items.map(i => i.id);
  console.log(foundItemsId);

  const deleteFirstItem = await client.query.balls.delete({
    where: eq(schemas.balls.columns.id, foundItemId!),
  });

  console.log(deleteFirstItem);
})();
