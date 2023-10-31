import { randomUUID } from "crypto";
import { chorm } from "../index.test";

export let createdUserId: string;

export default async function () {
  const generatedId = randomUUID();
  const rows = await chorm.query.users.insert({
    id: generatedId,
    password: "password",
    username: "username",
    phone_number: "+1 1234567890",
  });

  expect(rows).toEqual(1);
  createdUserId = generatedId;
}
