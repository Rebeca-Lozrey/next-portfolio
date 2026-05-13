import z from "zod";

export const loginSchema = z.object({
  email: z.string().check(z.email()),
  password: z.string().min(6),
});

export const singupSchema = z.object({
  email: z.string().check(z.email()),
  username: z.string().min(6),
  password: z.string().min(6),
});
