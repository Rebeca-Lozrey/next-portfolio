import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import type { ColorDocument } from "./colors.types";

const COLLECTION_NAME = "colors";

export interface ColorsRepository {
  insert(audience: Omit<ColorDocument, "_id">): Promise<string>;
  findAll(): Promise<ColorDocument[]>;
}

export const mongoColorsRepository: ColorsRepository = {
  async insert(audience) {
    const collection =
      await getCollection<OptionalId<ColorDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(audience);
    return result.insertedId.toString();
  },

  async findAll() {
    const collection = await getCollection<ColorDocument>(COLLECTION_NAME);

    return collection.find().sort({ slug: 1 }).toArray();
  },
};
