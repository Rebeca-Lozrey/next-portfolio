import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import type { BrandDocument } from "./brands.types";

const COLLECTION_NAME = "brands";

export interface BrandsRepository {
  insert(brand: Omit<BrandDocument, "_id">): Promise<string>;
  findAll(): Promise<BrandDocument[]>;
}

export const mongoBrandsRepository: BrandsRepository = {
  async insert(brand) {
    const collection =
      await getCollection<OptionalId<BrandDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(brand);
    return result.insertedId.toString();
  },

  async findAll() {
    const collection = await getCollection<BrandDocument>(COLLECTION_NAME);

    return collection.find().sort({ slug: 1 }).toArray();
  },
};
