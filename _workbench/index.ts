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

  await client.query.balls.insert({
    id: "5",
    cancelled: false,
  });

  const items = await client.query.balls.findFirst({
    where: {
      cancelled: false,
    },
  });

  console.log(await items.json());
})();
