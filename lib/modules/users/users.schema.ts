import z from "zod";

export const createUserSchema = z.object({
  email: z.string().check(z.email()),
  username: z.string().min(6),
  password: z.string().min(6),
});
