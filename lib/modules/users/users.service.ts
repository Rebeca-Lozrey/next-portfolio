import { ConflictError, NotFoundError } from "@/lib/api/api.errors";
import {
  getDuplicateField,
  isDuplicateKeyError,
} from "@/lib/mongodb/mongo.utils";

import { mongoArticlesRepository } from "../articles/articles.repository";
import { hashPassword } from "../auth/password";
import type { UsersRepository } from "./users.repository";
import type { UpdateUserInput, User } from "./users.types";
import type { CreateUserInput } from "./users.types";

export async function createUser(
  repo: UsersRepository,
  input: CreateUserInput,
): Promise<User> {
  const passwordHash = await hashPassword(input.password);

  const userInput: Omit<User, "id"> = {
    email: input.email,
    username: input.username,
    passwordHash,
    createdAt: new Date(),
    avatar: null,
  };

  try {
    const userid = await repo.insert(userInput);

    return { id: userid, ...userInput };
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const field = getDuplicateField(error);

      if (field === "email") {
        throw new ConflictError("Email already in use");
      }

      if (field === "username") {
        throw new ConflictError("Username already taken");
      }

      throw new ConflictError("Duplicate value");
    }

    throw error;
  }
}

export async function updateUser(
  repo: UsersRepository,
  id: string,
  updates: UpdateUserInput,
): Promise<User> {
  const updated = await repo.updateById(id, updates);

  if (!updated) {
    throw new NotFoundError("User not found");
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
