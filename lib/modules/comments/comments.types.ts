import { ObjectId } from "mongodb";
import z from "zod";

import { createCommentSchema } from "./comments.schema";

export type CommentDocument = {
  _id: ObjectId;
  articleId: ObjectId;
  authorId: ObjectId;
  author: { username: string; avatar: string | null };
  content: string;
  createdAt: Date;
};

type Domain<T> = Omit<T, "_id" | "articleId" | "authorId"> & {
  id: string;
  articleId: string;
  authorId: string;
};

export type Comment = Domain<CommentDocument>;

export type Cursor = string | null;

export type CommentDocumentsPage = {
  commentDocuments: CommentDocument[];
  total: number | null;
  nextCursor: Cursor;
};

export type CommentsPage = {
  comments: Comment[];
  total: number | null;
  nextCursor: Cursor;
};

export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
