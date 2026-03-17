import { ObjectId } from "mongodb";

import { getCollection } from "@/lib/mongodb";

import type { Article, ArticleDocument, ArticlesPage } from "./articles.types";

const COLLECTION_NAME = "articles";

export interface ArticlesRepository {
  insert(article: Omit<Article, "id">): Promise<string>;
  findById(id: string): Promise<ArticleDocument | null>;
  infiniteByCursor(cursor?: string): Promise<ArticlesPage>;
}

export const mongoArticlesRepository: ArticlesRepository = {
  async insert(article) {
    const collection =
      await getCollection<Omit<Article, "id">>(COLLECTION_NAME);
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
      articles: docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
      })),
      nextCursor: docs.length ? docs[docs.length - 1]._id.toString() : null,
    };
  },
};
