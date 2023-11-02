import { randomUUID } from "crypto";
import { chorm } from "../index.test";
import { createdUserId } from "./createUser";

export default async function () {
  const user = await chorm.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, createdUserId),
  });

  expect(user).toStrictEqual({
    id: createdUserId,
    password: "password",
    username: "username",
    phone_number: "+1 1234567890",
  });

  const users = await chorm.query.users.findMany({
    where: (users, { eq }) => eq(users.id, createdUserId),
  });

  expect(users.length).toBe(1);

  const noMatchingUsers = await chorm.query.users.findMany({
    where: (users, { eq }) => eq(users.id, randomUUID()),
  });

  expect(noMatchingUsers.length).toBe(0);
}
