import { chorm, doAsync } from "../index.test";
import { createdUserId } from "./createUser";

export default async function () {
  const queryId = await chorm.query.users.update({
    where: (users, { eq }) => eq(users.id, createdUserId),
    data: {
      password: "yayyy new password",
    },
  });

  expect(queryId).toBeDefined();

  doAsync(async () => {
    const user = await chorm.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, createdUserId),
    });

    expect(user).toStrictEqual({
      id: createdUserId,
      password: "yayyy new password",
      username: "username",
      phone_number: "+1 1234567890",
    });
  });

  // Multiple updates
  const multipleUpdatesQueryId = await chorm.query.users.update({
    where: (users, { eq }) => eq(users.id, createdUserId),
    data: {
      password: "changed newer password",
      phone_number: "+1 changed phon number",
      username: "changed username",
    },
  });

  expect(multipleUpdatesQueryId).toBeDefined();

  doAsync(async () => {
    const multipleUpdatesUser = await chorm.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, createdUserId),
    });

    expect(multipleUpdatesUser).toStrictEqual({
      id: createdUserId,
      password: "changed newer password",
      username: "changed username",
      phone_number: "+1 changed phon number",
    });
  });
}
