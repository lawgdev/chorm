import { chorm } from "../index.test";

export default async function () {
  const userIds = new Array(100).fill(0).map((_, i) => i);

  for await (const id of userIds) {
    const query = await chorm.query.ordering.insert({
      id: id.toString(),
      num: id,
    });

    expect(query).toBeDefined();
  }

  const testDesc = await chorm.query.ordering.findMany({
    where: (columns, { isNotNull }) => isNotNull(columns.num),
    orderBy: (columns, { desc }) => desc(columns.num),
  });

  expect(testDesc).toBeDefined();
  expect(testDesc).toHaveLength(100);
  expect(testDesc?.[0]?.num).toBe(99);

  const testAsc = await chorm.query.ordering.findMany({
    where: (columns, { isNotNull }) => isNotNull(columns.num),
    orderBy: (columns, { asc }) => asc(columns.num),
  });

  expect(testAsc).toBeDefined();
  expect(testAsc).toHaveLength(100);
  expect(testAsc?.[0]?.num).toBe(0);
}
