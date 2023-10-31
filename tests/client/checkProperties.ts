import { chorm } from "../index.test";

export default function () {
  expect(chorm.query).toHaveProperty("users");
  expect(chorm.query).toHaveProperty("customers");
}
