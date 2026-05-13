import {
  getDuplicateField,
  isDuplicateKeyError,
} from "@/lib/shared/mongo.utils";

import { mongoArticlesRepository } from "../articles/articles.repository";
import { hashPassword } from "../auth/password";
import type { UsersRepository } from "./users.repository";
import type { UpdateUserInput, User } from "./users.types";
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
    avatar: null,
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

export async function updateUser(
  repo: UsersRepository,
  id: string,
  updates: UpdateUserInput,
): Promise<User | null> {
  const updated = await repo.updateById(id, updates);

  if (!updated) {
    throw new Error("Failed to update user");
  }

  await mongoArticlesRepository.updateByAuthorId(id, updates);
  return updated;
}

export async function getUserById(repo: UsersRepository, userId: string) {
  return repo.findById(userId);
}

export async function getUserByEmail(repo: UsersRepository, email: string) {
  return repo.findByEmail(email);
}
