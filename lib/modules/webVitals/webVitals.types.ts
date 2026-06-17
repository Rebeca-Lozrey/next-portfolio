import { ObjectId } from "mongodb";
import z from "zod";

import { createWebVitalsSchema } from "./webVitals.schema";

export type WebVitalDocument = {
  _id: ObjectId;

  metric: "CLS" | "FCP" | "INP" | "LCP" | "TTFB";

  value: number;

  rating: "good" | "needs-improvement" | "poor";

  navigationType: string;

  url: string;

  browser: string;
  browserVersion: string;

  userAgent: string;

  viewportWidth: number;
  viewportHeight: number;

  deviceType: "desktop" | "mobile" | "tablet";

  data: Record<string, unknown>;

  createdAt: Date;
};

export type WebVital = Omit<WebVitalDocument, "_id"> & { id: string };

export type CreateWebVitalsInput = z.infer<typeof createWebVitalsSchema>;

export interface WebVitalsSummary {
  _id: "CLS" | "FCP" | "INP" | "LCP" | "TTFB";

  avgValue: number;

  p75Value: number;

  maxValue: number;

  count: number;

  good: number;

  needsImprovement: number;

  poor: number;
}
