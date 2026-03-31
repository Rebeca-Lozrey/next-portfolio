import { ObjectId } from "mongodb";
import z from "zod";

import { createArticleSchema } from "./articles.schema";

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
  likedByUser: boolean;
  createdAt: Date;
}

export interface ArticlesDocumentPage {
  articles: ArticleDocument[];
  nextCursor: string | null;
}

export interface ArticlesPage {
  articles: Article[];
  nextCursor: string | null;
}

export type CreateArticleRequest = z.infer<typeof createArticleSchema>;
