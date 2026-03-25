import z from "zod";

export const loginSchema = z.object({
  email: z.string().check(z.email()),
  password: z.string().min(6),
});
