import z from "zod";

export const createWebVitalsSchema = z.object({
  metric: z.enum(["CLS", "FCP", "INP", "LCP", "TTFB"]),

  value: z.number(),

  rating: z.enum(["good", "needs-improvement", "poor"]),

  navigationType: z.string(),

  url: z.string(),

  browser: z.string(),
  browserVersion: z.string(),

  userAgent: z.string(),

  viewportWidth: z.number(),
  viewportHeight: z.number(),

  deviceType: z.enum(["desktop", "mobile", "tablet"]),

  data: z.record(z.string(), z.unknown()),
});
