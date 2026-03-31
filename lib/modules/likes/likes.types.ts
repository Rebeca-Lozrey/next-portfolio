import { ObjectId } from "mongodb";
import z from "zod";

import { createLikeSchema } from "./likes.schema";

export interface LikeDocument {
  _id: ObjectId;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export interface Like {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export type CreateLikeRequest = z.infer<typeof createLikeSchema>;
