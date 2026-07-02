import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import type { ItemTypeDocument } from "./itemTypes.types";

const COLLECTION_NAME = "item-types";

export interface ItemTypesRepository {
  insert(audience: Omit<ItemTypeDocument, "_id">): Promise<string>;
  findAll(): Promise<ItemTypeDocument[]>;
}

export const mongoItemTypesRepository: ItemTypesRepository = {
  async insert(audience) {
    const collection =
      await getCollection<OptionalId<ItemTypeDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(audience);
    return result.insertedId.toString();
  },

  async findAll() {
    const collection = await getCollection<ItemTypeDocument>(COLLECTION_NAME);

    return collection.find().sort({ slug: 1 }).toArray();
  },
};
