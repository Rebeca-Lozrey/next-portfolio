import { ObjectId, OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb";

import type { ArticleDocument, ArticlesDocumentPage } from "./articles.types";

const COLLECTION_NAME = "articles";

export interface ArticlesRepository {
  insert(article: Omit<ArticleDocument, "_id">): Promise<string>;
  findById(id: string): Promise<ArticleDocument | null>;
  infiniteByCursor(cursor: string | null): Promise<ArticlesDocumentPage>;
  decrementLikes(articleId: string): Promise<void>;
  incrementLikes(articleId: string): Promise<void>;
  infiniteByUserCursor(
    userId: string,
    cursor: string | null,
  ): Promise<ArticlesDocumentPage>;
}

export const mongoArticlesRepository: ArticlesRepository = {
  async insert(article) {
    const collection =
      await getCollection<OptionalId<ArticleDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(article);
    return result.insertedId.toString();
  },

  async findById(id) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    return collection.findOne({ _id: new ObjectId(id) });
  },

  async infiniteByCursor(cursor = "") {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);

    const query = cursor ? { _id: { $lt: new ObjectId(cursor) } } : {};

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(10)
      .toArray();

    return {
      articles: docs,
      nextCursor: docs.length ? docs[docs.length - 1]._id.toString() : null,
    };
  },

  async decrementLikes(articleId) {
    const collection = await getCollection(COLLECTION_NAME);

    await collection.updateOne(
      { _id: new ObjectId(articleId), likeCount: { $gt: 0 } },
      { $inc: { likeCount: -1 } },
    );
  },

  async incrementLikes(articleId) {
    const collection = await getCollection(COLLECTION_NAME);

    await collection.updateOne(
      { _id: new ObjectId(articleId) },
      { $inc: { likeCount: 1 } },
    );
  },

  async infiniteByUserCursor(userId, cursor = null) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);

    const query = {
      authorId: userId,
      ...(cursor && { _id: { $lt: new ObjectId(cursor) } }),
    };

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(10)
      .toArray();

    return {
      articles: docs,
      nextCursor: docs.length ? docs[docs.length - 1]._id.toString() : null,
    };
  },
};
