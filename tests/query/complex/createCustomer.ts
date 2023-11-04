import { randomUUID } from "crypto";
import { chorm } from "../../index.test";

export let createdCustomer: NonNullable<
  Awaited<ReturnType<typeof chorm.query.customers.findFirst>>
>;

export default async function () {
  const id = randomUUID();
  const uuid = randomUUID();
  const date = new Date("2023-11-03");
  const customerQueryId = await chorm.query.customers.insert({
    card_number: 123456789,
    created_at: date,
    is_admin: false,
    id,
    customer_name: "John Doe",
    uuid,
    pi: 3.14,
  });

  expect(customerQueryId).toBeDefined();

  const customer = await chorm.query.customers.findFirst({
    where: (table, { eq }) => eq(table.id, id),
  });

  expect(customer).toBeDefined();
  expect(customer).toStrictEqual({
    card_number: 123456789,
    created_at: "2023-11-03 00:00:00.000",
    is_admin: false,
    null_column: null,
    id,
    customer_name: "John Doe",
    uuid: uuid,
    pi: 3.14,
  });

  createdCustomer = customer!;
}
