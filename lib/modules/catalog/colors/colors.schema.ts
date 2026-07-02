import { z } from "zod";

export const ColorSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100),
  hex: z.string().trim().min(1).max(100),
  group: z.string().trim().min(1).max(100),
});
