import { chorm } from "../index.test";

export default async function () {
  const testDesc = await chorm.query.ordering.findMany({
    where: (columns, { isNotNull }) => isNotNull(columns.num),
    offset: 2,
    orderBy(columns, conditions) {
      return conditions.asc(columns.num);
    },
  });

  expect(testDesc).toBeDefined();
  expect(testDesc?.[0]?.num).toBe(2);
}
