import z from "zod";

export const createArticleSchema = z.object({
  content: z
    .string()
    .max(280, "Max 280 characters allowed")
    .min(1, "Content is required"),
  imageUrl: z.url().optional(),
});

export const articleModel = createArticleSchema.extend({
  authorId: z.string().min(6),
  authorUsername: z.string().min(6),
  likeCount: z.number().default(0),
  createdAt: z.date().default(() => new Date()),
});
