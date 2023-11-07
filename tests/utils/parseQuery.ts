import { and, eq, ne, or } from "../../src/expressions/conditions";
import { parseQuery } from "../../src/utils/param-validation";
import { SQLParser } from "../../src/utils/sql";
import { testSchemas } from "../testSchemas";

const TEST_CASES: Array<{
  sql: SQLParser;
  expected: ReturnType<typeof parseQuery>;
}> = [
  {
    sql: eq(testSchemas.users.columns.username, "test"),
    expected: {
      template: "username = {v1: String}",
      queryParams: {
        v1: "test",
      },
    },
  },
  {
    sql: ne(testSchemas.users.columns.username, "test"),
    expected: {
      template: "username <> {v1: String}",
      queryParams: {
        v1: "test",
      },
    },
  },
  {
    sql: and(
      eq(testSchemas.users.columns.username, "test"),
      ne(testSchemas.users.columns.id, "test"),
    ),
    expected: {
      template: "username = {v1: String} AND id <> {v3: String}",
      queryParams: {
        v1: "test",
        v3: "test",
      },
    },
  },
  {
    sql: or(
      eq(testSchemas.users.columns.username, "test"),
      ne(testSchemas.users.columns.id, "test"),
    ),
    expected: {
      template: "username = {v1: String} OR id <> {v3: String}",
      queryParams: {
        v1: "test",
        v3: "test",
      },
    },
  },
];

export default function () {
  for (const testCase of TEST_CASES) {
    const result = parseQuery(testCase.sql);

    expect(result).toStrictEqual(testCase.expected);
  }
}
