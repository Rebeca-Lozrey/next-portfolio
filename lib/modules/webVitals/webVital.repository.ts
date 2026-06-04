import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import { WebVital, WebVitalDocument } from "./webVitals.types";

const COLLECTION_NAME = "web-vitals";

export interface WebVitalsRepository {
  insert(webVitalRecord: Omit<WebVital, "id">): Promise<string>;
}

export const mongoWebVitalsRepository: WebVitalsRepository = {
  async insert(webVitalRecord) {
    const collection =
      await getCollection<OptionalId<WebVitalDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(webVitalRecord);
    return result.insertedId.toString();
  },
};
