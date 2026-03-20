import { hashPassword } from "../auth/password";
import type { UsersRepository } from "./users.repository";
import type { User } from "./users.types";
import type { CreateUserInput } from "./users.types";

export async function createUserService(
  repo: UsersRepository,
  input: CreateUserInput,
): Promise<User> {
  const existing = await repo.findByEmail(input.email);
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(input.password);

  const user: Omit<User, "id"> = {
    email: input.email,
    username: input.username,
    passwordHash,
    createdAt: new Date(),
  };

  const id = await repo.insert(user);

  return {
    ...user,
    id,
  };
}
