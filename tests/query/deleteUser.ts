import { eq } from "../../src/expressions/conditions";
import { chorm, testSchemas } from "../index.test";
import { createdUserId } from "./createUser";

export default async function () {
  const queryId = await chorm.query.users.delete({
    where: eq(testSchemas.users.columns.id, createdUserId),
  });

  expect(queryId).toBeDefined();

  const user = await chorm.query.users.findFirst({
    where: eq(testSchemas.users.columns.id, createdUserId),
  });

  expect(user).toBeNull();
}
