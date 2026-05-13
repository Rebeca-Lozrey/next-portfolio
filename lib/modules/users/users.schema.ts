import z from "zod";

export const createUserSchema = z
  .object({
    email: z.email(),
    username: z.string().min(6),
    password: z.string().min(6),
    avatar: z.url().nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    avatar: data.avatar ?? null,
  }));

export const updateUserSchema = z
  .object({
    username: z.string().optional(),

    avatar: z.string().nullable().optional(),
  })
  .refine((data) => data.username !== undefined || data.avatar !== undefined, {
    message: "At least one field must be provided",
  });
