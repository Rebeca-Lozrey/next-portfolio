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

export type ArticleDocumentWithSort = ArticleDocument & {
  score: number;
  searchAfter: string;
  meta: { count: { total: number } };
};

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

export type Cursor = string | null;

export interface ArticlesDocumentPage {
  articles: ArticleDocument[];
  total: number | null;
  nextCursor: Cursor;
}

export interface ArticlesPage {
  articles: Article[];
  total: number | null;
  nextCursor: Cursor;
}

export type CreateArticleRequest = z.infer<typeof createArticleSchema>;
