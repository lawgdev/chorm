import { chorm } from "../index.test";
import { createdUserId } from "./createUser";

export default async function () {
  const queryId = await chorm.query.users.delete({
    where: (users, { eq }) => eq(users.columns.id, createdUserId),
  });

  expect(queryId).toBeDefined();

  setTimeout(async () => {
    const user = await chorm.query.users.findFirst({
      where: (users, { eq }) => eq(users.columns.id, createdUserId),
    });

    expect(user).toBeNull();
  }, 5);
}
