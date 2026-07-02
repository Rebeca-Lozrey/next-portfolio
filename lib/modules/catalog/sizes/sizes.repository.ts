import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import type { SizeDocument } from "./sizes.types";

const COLLECTION_NAME = "sizes";

export interface SizesRepository {
  insert(size: Omit<SizeDocument, "_id">): Promise<string>;
  findAll(): Promise<SizeDocument[]>;
}

export const mongoSizesRepository: SizesRepository = {
  async insert(size) {
    const collection =
      await getCollection<OptionalId<SizeDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(size);
    return result.insertedId.toString();
  },

  async findAll() {
    const collection = await getCollection<SizeDocument>(COLLECTION_NAME);

    return collection.find().sort({ sizeGroup: 1, order: 1 }).toArray();
  },
};
