import { OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import {
  WebVital,
  WebVitalDocument,
  WebVitalsSummary,
} from "./webVitals.types";

const COLLECTION_NAME = "web-vitals";

export interface WebVitalsRepository {
  insert(webVitalRecord: Omit<WebVital, "id">): Promise<string>;
  getWebVitalsSummary(
    from: Date,
    to: Date,
    url?: string,
  ): Promise<WebVitalsSummary[]>;
}

export const mongoWebVitalsRepository: WebVitalsRepository = {
  async insert(webVitalRecord) {
    const collection =
      await getCollection<OptionalId<WebVitalDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(webVitalRecord);
    return result.insertedId.toString();
  },
  async getWebVitalsSummary(from, to, url?) {
    const collection =
      await getCollection<OptionalId<WebVitalDocument>>(COLLECTION_NAME);

    return collection
      .aggregate<WebVitalsSummary>([
        {
          $match: {
            createdAt: {
              $gte: from,
              $lt: to,
            },
            ...(url && { url }),
          },
        },
        {
          $group: {
            _id: "$metric",

            avgValue: { $avg: "$value" },

            p75Value: {
              $percentile: {
                input: "$value",
                p: [0.75],
                method: "approximate",
              },
            },

            maxValue: { $max: "$value" },

            count: { $sum: 1 },

            good: {
              $avg: {
                $cond: [{ $eq: ["$rating", "good"] }, 1, 0],
              },
            },

            needsImprovement: {
              $avg: {
                $cond: [{ $eq: ["$rating", "needs-improvement"] }, 1, 0],
              },
            },

            poor: {
              $avg: {
                $cond: [{ $eq: ["$rating", "poor"] }, 1, 0],
              },
            },
          },
        },
        {
          $project: {
            avgValue: {
              $cond: [
                { $eq: ["$_id", "CLS"] },

                // CLS keeps 3 decimals
                { $round: ["$avgValue", 3] },

                // Everything else becomes an integer
                { $round: ["$avgValue", 0] },
              ],
            },

            p75Value: {
              $cond: [
                { $eq: ["$_id", "CLS"] },

                { $round: [{ $arrayElemAt: ["$p75Value", 0] }, 3] },

                { $round: [{ $arrayElemAt: ["$p75Value", 0] }, 0] },
              ],
            },
            maxValue: {
              $cond: [
                { $eq: ["$_id", "CLS"] },

                { $round: ["$maxValue", 3] },

                { $round: ["$maxValue", 0] },
              ],
            },
            count: 1,
            good: { $round: ["$good", 3] },
            needsImprovement: { $round: ["$needsImprovement", 3] },
            poor: { $round: ["$poor", 3] },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ])
      .toArray();
  },
};
