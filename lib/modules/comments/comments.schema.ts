import z from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .max(280, "Max 280 characters allowed")
    .min(1, "Content is required"),
});
