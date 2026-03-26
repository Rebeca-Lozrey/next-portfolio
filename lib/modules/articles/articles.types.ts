import { ObjectId } from "mongodb";
import z from "zod";

import { articleModel, createArticleSchema } from "./articles.schema";

export interface ArticleDocument {
  _id: ObjectId;
  authorId: string;
  authorUsername: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  createdAt: Date;
}

export interface Article {
  id: string;
  authorId: string;
  authorUsername: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  createdAt: Date;
}

export interface ArticlesPage {
  articles: Article[];
  nextCursor: string | null;
}

export type CreateArticleRequest = z.infer<typeof createArticleSchema>;
export type ArticleModel = z.infer<typeof articleModel>;
