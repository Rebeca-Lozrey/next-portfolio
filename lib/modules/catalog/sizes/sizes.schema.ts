import { z } from "zod";

import { sizeGroupsArray } from "./sizes.types";

export const sizeGroupSchema = z.enum(sizeGroupsArray);

export const createSizeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: z.string().trim().min(1).max(100),
  sizeGroup: sizeGroupSchema,
  order: z.number().int().nonnegative(),
});
