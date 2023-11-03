import { randomUUID } from "crypto";
import { Test, chorm } from "../../index.test";

export let createdCustomer: NonNullable<
  Awaited<ReturnType<typeof chorm.query.customers.findFirst>>
>;

export default async function () {
  const id = randomUUID();
  const date = new Date();
  const customerQueryId = await chorm.query.customers.insert({
    card_number: 123456789,
    created_at: date,
    is_admin: false,
    id,
    customer_name: "John Doe",
    // todo: figure out why random_enum gives a Enum data type cannot be empty
    random_enum: "A",
    uuid: "123",
    pi: 3.14,
  });

  expect(customerQueryId).toBeDefined();

  const customer = await chorm.query.customers.findFirst({
    where: (table, { eq }) => eq(table.id, customerQueryId),
  });

  expect(customer).toBeDefined();
  expect(customer).toStrictEqual({
    card_number: 123456789,
    created_at: date,
    is_admin: false,
    id,
    customer_name: "John Doe",
    random_enum: Test.A,
    uuid: "123",
    pi: 3.14,
  });

  createdCustomer = customer!;
}
