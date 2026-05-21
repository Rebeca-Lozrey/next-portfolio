import { ObjectId, OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import {
  CommentDocument,
  CommentDocumentsPage,
  Cursor,
} from "./comments.types";

const COLLECTION_NAME = "comments";

export interface CommentsRepository {
  insert(comment: Omit<CommentDocument, "_id">): Promise<string>;
  infiniteByCursor(
    articleId: string,
    cursor: Cursor,
  ): Promise<CommentDocumentsPage>;
}

export const mongoCommentsRepository: CommentsRepository = {
  async insert(comment) {
    const collection =
      await getCollection<OptionalId<CommentDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(comment);
    return result.insertedId.toString();
  },

  async infiniteByCursor(articleId, cursor) {
    const collection = await getCollection<CommentDocument>(COLLECTION_NAME);

    const LIMIT = 10;

    const query = cursor
      ? {
          articleId: new ObjectId(articleId),
          _id: { $lt: new ObjectId(cursor) },
        }
      : { articleId: new ObjectId(articleId) };

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(LIMIT + 1)
      .toArray();

    const hasNextPage = docs.length > LIMIT;

    const commentDocuments = hasNextPage ? docs.slice(0, LIMIT) : docs;

    const nextCursor = hasNextPage
      ? commentDocuments[commentDocuments.length - 1]._id.toString()
      : null;

    return {
      commentDocuments,
      total: null,
      nextCursor,
    };
  },
};
