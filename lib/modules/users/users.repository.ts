import { ObjectId, OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb";

import type { User, UserDocument } from "./users.types";

const COLLECTION_NAME = "users";

export interface UsersRepository {
  insert(user: Omit<User, "id">): Promise<string>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

export const mongoUsersRepository: UsersRepository = {
  async insert(user) {
    const collection =
      await getCollection<OptionalId<UserDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(user);
    return result.insertedId.toString();
  },

  async findByEmail(email) {
    const collection = await getCollection<UserDocument>(COLLECTION_NAME);
    const doc = await collection.findOne({ email });
    if (!doc) return null;

    return mapToUser(doc);
  },

  async findById(id) {
    const collection = await getCollection<UserDocument>(COLLECTION_NAME);
    const doc = await collection.findOne({ _id: new ObjectId(id) });

    if (!doc) return null;

    return mapToUser(doc);
  },
};

function mapToUser(doc: UserDocument): User {
  return {
    id: doc._id.toString(),
    email: doc.email,
    username: doc.username,
    passwordHash: doc.passwordHash,
    createdAt: doc.createdAt,
  };
}
