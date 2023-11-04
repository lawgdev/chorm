import { chorm, doAsync } from "../index.test";
import { createdUserId } from "./createUser";

export default async function () {
  const queryId = await chorm.query.users.delete({
    where: (users, { eq }) => eq(users.id, createdUserId),
  });

  expect(queryId).toBeDefined();

  doAsync(async () => {
    const user = await chorm.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, createdUserId),
    });

    expect(user).toBeNull();
  });
}
