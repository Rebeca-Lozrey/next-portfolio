import { ObjectId, OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb";

import type {
  ArticleDocument,
  ArticleDocumentWithSort,
  ArticlesDocumentPage,
  Cursor,
} from "./articles.types";

const COLLECTION_NAME = "articles";

export interface ArticlesRepository {
  insert(article: Omit<ArticleDocument, "_id">): Promise<string>;
  findById(id: string): Promise<ArticleDocument | null>;
  infiniteByCursor(cursor: Cursor): Promise<ArticlesDocumentPage>;
  decrementLikes(articleId: string): Promise<void>;
  incrementLikes(articleId: string): Promise<void>;
  infiniteByUserCursor(
    userId: string,
    cursor: Cursor,
  ): Promise<ArticlesDocumentPage>;
  deleteByIdAndAuthor(id: string, authorId: string): Promise<boolean>;
  infiniteByUserByTermCursor(
    userId: string,
    term: string,
    cursor: Cursor,
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

  async infiniteByCursor(cursor) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);

    const LIMIT = 10;

    const query = cursor ? { _id: { $lt: new ObjectId(cursor) } } : {};

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(LIMIT + 1)
      .toArray();

    const hasNextPage = docs.length > LIMIT;

    const articles = hasNextPage ? docs.slice(0, LIMIT) : docs;

    const nextCursor = hasNextPage
      ? articles[articles.length - 1]._id.toString()
      : null;

    return {
      articles,
      total: null,
      nextCursor,
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

  async infiniteByUserCursor(userId, cursor) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    const LIMIT = 10;

    const query = {
      authorId: userId,
      ...(cursor && { _id: { $lt: new ObjectId(cursor) } }),
    };

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(LIMIT + 1)
      .toArray();

    const hasNextPage = docs.length > LIMIT;
    const articles = hasNextPage ? docs.slice(0, LIMIT) : docs;

    const total = cursor
      ? null
      : await collection.countDocuments({ authorId: userId });

    return {
      articles,
      total,
      nextCursor: hasNextPage
        ? articles[articles.length - 1]._id.toString()
        : null,
    };
  },

  async deleteByIdAndAuthor(id, authorId) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
      authorId,
    });
    return result.deletedCount === 1;
  },

  async infiniteByUserByTermCursor(userId, term, cursor) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    // ======================
    // SEARCH MODE (Atlas)
    // ======================
    const contentFilter = {
      text: {
        query: term,
        path: "content",
        fuzzy: {
          maxEdits: 2,
        },
      },
    };

    const authorIdFilter = {
      term: {
        query: userId,
        path: "authorId",
      },
    };

    const scoreAndIdSort = {
      score: { $meta: "searchScore" },
      _id: 1,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchStage: Record<string, any> = {
      index: "default",
      compound: {
        must: [contentFilter],
        filter: [authorIdFilter],
      },
      sort: scoreAndIdSort,
      count: {
        type: "total",
      },
    };

    if (cursor) {
      searchStage.searchAfter = cursor;
    }

    const LIMIT = 10;
    const pipeline = [
      { $search: searchStage },
      {
        $project: {
          _id: 1,
          authorId: 1,
          authorUsername: 1,
          content: 1,
          imageUrl: 1,
          likeCount: 1,
          createdAt: 1,
          score: { $meta: "searchScore" },
          searchAfter: { $meta: "searchSequenceToken" },
          meta: "$$SEARCH_META",
        },
      },
      { $limit: LIMIT + 1 },
    ];

    const docs = await collection
      .aggregate<ArticleDocumentWithSort>(pipeline)
      .toArray();

    const hasNextPage = docs.length > LIMIT;

    const articles = hasNextPage ? docs.slice(0, LIMIT) : docs;

    return {
      articles,
      total: articles.length
        ? articles[articles.length - 1].meta.count.total
        : 0,
      nextCursor: hasNextPage
        ? articles[articles.length - 1].searchAfter
        : null,
    };
  },
};
