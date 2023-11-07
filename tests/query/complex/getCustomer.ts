import { chorm } from "../../index.test";
import { createdCustomer } from "./createCustomer";

export default async function () {
  const fetchCustomerEq = await chorm.query.customers.findFirst({
    where(table, { eq }) {
      return eq(table.id, createdCustomer.id);
    },
  });

  expect(fetchCustomerEq).toStrictEqual(createdCustomer);

  const fetchCustomerNe = await chorm.query.customers.findFirst({
    where(table, { ne }) {
      return ne(table.id, "going_to_be_fall_through");
    },
  });

  expect(fetchCustomerNe).toStrictEqual(createdCustomer);

  const fetchCustomerWithGt = await chorm.query.customers.findFirst({
    where(table, { gt }) {
      return gt(table.card_number, 123456788);
    },
  });

  expect(fetchCustomerWithGt).toStrictEqual(createdCustomer);

  const fetchCustomerWithGte = await chorm.query.customers.findFirst({
    where(table, { gte }) {
      return gte(table.card_number, 123456789);
    },
  });

  expect(fetchCustomerWithGte).toStrictEqual(createdCustomer);

  const fetchCustomerWithLt = await chorm.query.customers.findFirst({
    where(table, { lt }) {
      return lt(table.card_number, 123456790);
    },
  });

  expect(fetchCustomerWithLt).toStrictEqual(createdCustomer);

  const fetchCustomerWithLte = await chorm.query.customers.findFirst({
    where(table, { lte }) {
      return lte(table.card_number, 123456789);
    },
  });

  expect(fetchCustomerWithLte).toStrictEqual(createdCustomer);

  const fetchCustomerWhereNull = await chorm.query.customers.findFirst({
    where(table, { isNull }) {
      return isNull(table.null_column);
    },
  });

  expect(fetchCustomerWhereNull).toStrictEqual(createdCustomer);

  const fetchCustomerWhereNotNull = await chorm.query.customers.findFirst({
    where(table, { isNotNull }) {
      return isNotNull(table.is_admin);
    },
  });

  expect(fetchCustomerWhereNotNull).toStrictEqual(createdCustomer);

  const fetchCustomerWhereLike = await chorm.query.customers.findFirst({
    where(table, { like }) {
      return like(table.customer_name, "John%");
    },
  });

  expect(fetchCustomerWhereLike).toStrictEqual(createdCustomer);

  const fetchCustomerWhereILike = await chorm.query.customers.findFirst({
    where(table, { ilike }) {
      return ilike(table.customer_name, "John%");
    },
  });

  expect(fetchCustomerWhereILike).toStrictEqual(createdCustomer);

  const fetchCustomerWhereNotILike = await chorm.query.customers.findFirst({
    where(table, { notIlike }) {
      return notIlike(table.customer_name, "going_to_be_fall_through");
    },
  });

  expect(fetchCustomerWhereNotILike).toStrictEqual(createdCustomer);

  const fetchCustomerWithAnd = await chorm.query.customers.findFirst({
    where(table, { and, eq }) {
      return and(eq(table.id, createdCustomer.id), eq(table.is_admin, false));
    },
  });

  expect(fetchCustomerWithAnd).toStrictEqual(createdCustomer);

  const fetchCustomerWithOr = await chorm.query.customers.findFirst({
    where(table, { or, eq }) {
      return or(eq(table.id, "going_to_be_fall_through"), eq(table.is_admin, false));
    },
  });

  expect(fetchCustomerWithOr).toStrictEqual(createdCustomer);
}
