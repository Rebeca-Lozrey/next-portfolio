import { ObjectId } from "mongodb";
import z from "zod";

import { createUserSchema, updateUserSchema } from "./users.schema";

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  avatar: string | null;
}

export interface UserDocument {
  _id: ObjectId;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
  avatar: string | null;
}

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
