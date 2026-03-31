import z from "zod";

export const createLikeSchema = z.object({
  articleId: z.string().min(6),
});
