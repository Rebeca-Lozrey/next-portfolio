import { ObjectId } from "mongodb";
import z from "zod";

import { createUserSchema } from "./users.schema";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserDocument {
  _id: ObjectId;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export type CreateUserInput = z.infer<typeof createUserSchema>;

export interface LoginInput {
  email: string;
  password: string;
}
