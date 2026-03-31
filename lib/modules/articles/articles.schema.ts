import z from "zod";

export const createArticleSchema = z.object({
  content: z
    .string()
    .max(280, "Max 280 characters allowed")
    .min(1, "Content is required"),
  imageUrl: z.url().optional(),
});
