import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import type { AudienceDocument } from "./audiences.types";

const COLLECTION_NAME = "audiences";

export interface AudiencesRepository {
  insert(audience: Omit<AudienceDocument, "_id">): Promise<string>;
  findAll(): Promise<AudienceDocument[]>;
}

export const mongoAudiencesRepository: AudiencesRepository = {
  async insert(audience) {
    const collection =
      await getCollection<OptionalId<AudienceDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(audience);
    return result.insertedId.toString();
  },

  async findAll() {
    const collection = await getCollection<AudienceDocument>(COLLECTION_NAME);

    return collection.find().sort({ slug: 1 }).toArray();
  },
};
