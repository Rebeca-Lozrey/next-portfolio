import { ObjectId } from "mongodb";
import z from "zod";

import { createArticleSchema } from "./articles.schema";

export interface ArticleDocument {
  _id: ObjectId;
  authorId: ObjectId;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  author: {
    username: string;
    avatar: string | null;
  };
}

export type ArticleDocumentWithSort = ArticleDocument & {
  score: number;
  searchAfter: string;
  meta: { count: { total: number } };
};

type Domain<T> = Omit<T, "_id" | "authorId"> & {
  id: string;
  likedByUser: boolean;
};

export type Article = Domain<ArticleDocument>;

export type Cursor = string | null;

export interface ArticleDocumentsPage {
  articleDocuments: ArticleDocument[];
  total: number | null;
  nextCursor: Cursor;
}

export interface ArticlesPage {
  articles: Article[];
  total: number | null;
  nextCursor: Cursor;
}

export type CreateArticleRequest = z.infer<typeof createArticleSchema>;
