import { chorm } from "../index.test";

export default async function () {
  const testDesc = await chorm.query.ordering.findMany({
    where: (columns, { isNotNull }) => isNotNull(columns.num),
    limit: 5,
  });

  expect(testDesc).toBeDefined();
  expect(testDesc).toHaveLength(5);
}
