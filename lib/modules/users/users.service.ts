import { hashPassword } from "../auth/password";
import type { UsersRepository } from "./users.repository";
import type { User } from "./users.types";
import type { CreateUserInput } from "./users.types";

export async function createUser(
  repo: UsersRepository,
  input: CreateUserInput,
): Promise<string> {
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

  return id;
}

export async function getUserById(repo: UsersRepository, userId: string) {
  return repo.findById(userId);
}

export async function getUserByEmail(repo: UsersRepository, email: string) {
  return repo.findByEmail(email);
}
