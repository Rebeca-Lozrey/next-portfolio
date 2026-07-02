import { z } from "zod";

export const itemTypeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100),
  sizeGroup: z.string().trim().min(1).max(100),
});
