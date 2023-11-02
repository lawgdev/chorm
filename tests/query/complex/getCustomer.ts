import { chorm } from "../../index.test";
import { createdCustomer } from "./createCustomer";

export default async function () {
  const fetchCustomerEq = await chorm.query.customers.findFirst({
    where(table, { eq }) {
      return eq(table.id, createdCustomer.id);
    },
  });

  expect(fetchCustomerEq).toEqual(createdCustomer);

  const fetchCustomerNe = await chorm.query.customers.findFirst({
    where(table, { ne }) {
      return ne(table.id, "going_to_be_fall_through");
    },
  });

  expect(fetchCustomerNe).toEqual(createdCustomer);

  const fetchCustomerWithAnd = await chorm.query.customers.findFirst({
    where(table, { and, eq }) {
      return and(eq(table.id, createdCustomer.id), eq(table.is_admin, false));
    },
  });

  expect(fetchCustomerWithAnd).toEqual(createdCustomer);

  const fetchCustomerWithOr = await chorm.query.customers.findFirst({
    where(table, { or, eq }) {
      return or(eq(table.id, "going_to_be_fall_through"), eq(table.is_admin, false));
    },
  });

  expect(fetchCustomerWithOr).toEqual(createdCustomer);

  const fetchCustomerWithNot = await chorm.query.customers.findFirst({
    where(table, { not, eq }) {
      return not(eq(table.id, "going_to_be_fall_through"));
    },
  });

  expect(fetchCustomerWithNot).toEqual(createdCustomer);

  const fetchCustomerWithLt = await chorm.query.customers.findFirst({
    where(table, { lt }) {
      return lt(table.card_number, 123456790);
    },
  });

  expect(fetchCustomerWithLt).toEqual(createdCustomer);

  const fetchCustomerWithLte = await chorm.query.customers.findFirst({
    where(table, { lte }) {
      return lte(table.card_number, 123456789);
    },
  });

  expect(fetchCustomerWithLte).toEqual(createdCustomer);

  const fetchCustomerWithGt = await chorm.query.customers.findFirst({
    where(table, { gt }) {
      return gt(table.card_number, 123456788);
    },
  });

  expect(fetchCustomerWithGt).toEqual(createdCustomer);

  const fetchCustomerWithGte = await chorm.query.customers.findFirst({
    where(table, { gte }) {
      return gte(table.card_number, 123456789);
    },
  });

  expect(fetchCustomerWithGte).toEqual(createdCustomer);

  const fetchCustomerWithLike = await chorm.query.customers.findFirst({
    where(table, { like }) {
      return like(table.customer_name, "John%");
    },
  });

  expect(fetchCustomerWithLike).toEqual(createdCustomer);

  // def will not work
  const fetchCustomerWithIn = await chorm.query.customers.findFirst({
    where(table, { inArray }) {
      return inArray(table.id, [createdCustomer.id]);
    },
  });

  expect(fetchCustomerWithIn).toEqual(createdCustomer);
}
