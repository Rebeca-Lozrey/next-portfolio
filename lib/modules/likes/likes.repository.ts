import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb";

import type { Like, LikeDocument } from "./likes.types";

const COLLECTION_NAME = "likes";

export interface LikesRepository {
  insert(like: Omit<Like, "id">): Promise<string>;
  delete(userId: string, articleId: string): Promise<boolean>;
  findByUser(userId: string): Promise<LikeDocument[]>;
}

export const mongoLikesRepository: LikesRepository = {
  async insert(like) {
    const collection =
      await getCollection<OptionalId<LikeDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(like);
    return result.insertedId.toString();
  },
  async delete(userId, articleId) {
    const collection =
      await getCollection<OptionalId<LikeDocument>>(COLLECTION_NAME);

    const result = await collection.deleteOne({
      userId,
      articleId,
    });

    return result.deletedCount === 1;
  },
  async findByUser(userId) {
    const collection = await getCollection<LikeDocument>(COLLECTION_NAME);
    return collection.find({ userId }).toArray();
  },
};
