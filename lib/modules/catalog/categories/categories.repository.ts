import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import type { CategoryDocument } from "./categories.types";

const COLLECTION_NAME = "categories";

export interface CategoriesRepository {
  insert(audience: Omit<CategoryDocument, "_id">): Promise<string>;
  findAll(): Promise<CategoryDocument[]>;
}

export const mongoCategoriesRepository: CategoriesRepository = {
  async insert(audience) {
    const collection =
      await getCollection<OptionalId<CategoryDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(audience);
    return result.insertedId.toString();
  },

  async findAll() {
    const collection = await getCollection<CategoryDocument>(COLLECTION_NAME);

    return collection.find().sort({ slug: 1 }).toArray();
  },
};
