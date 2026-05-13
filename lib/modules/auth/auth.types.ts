import z from "zod";

import { loginSchema, singupSchema } from "./auth.schema";

export type LoginDTO = z.infer<typeof loginSchema>;

export type SignupDTO = z.infer<typeof singupSchema>;
