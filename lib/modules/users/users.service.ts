import {
  getDuplicateField,
  isDuplicateKeyError,
} from "@/lib/shared/mongo.utils";

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

  try {
    return await repo.insert(user);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const field = getDuplicateField(error);

      if (field === "email") {
        throw new Error("Email already in use");
      }

      if (field === "username") {
        throw new Error("Username already taken");
      }

      throw new Error("Duplicate value");
    }

    throw error;
  }
}

export async function getUserById(repo: UsersRepository, userId: string) {
  return repo.findById(userId);
}

export async function getUserByEmail(repo: UsersRepository, email: string) {
  return repo.findByEmail(email);
}
