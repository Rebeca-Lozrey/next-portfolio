import { ObjectId, OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb/mongodb";

import { UpdateUserInput } from "../users/users.types";
import type {
  ArticleDocument,
  ArticleDocumentWithSort,
  ArticleDocumentsPage,
  Cursor,
} from "./articles.types";

const COLLECTION_NAME = "articles";

export interface ArticlesRepository {
  insert(article: Omit<ArticleDocument, "_id">): Promise<string>;
  infiniteByCursor(cursor: Cursor): Promise<ArticleDocumentsPage>;
  decrementLikes(articleId: string): Promise<void>;
  incrementLikes(articleId: string): Promise<void>;
  infiniteByUserCursor(
    authorId: string,
    cursor: Cursor,
  ): Promise<ArticleDocumentsPage>;
  deleteByIdAndAuthor(
    id: string,
    authorId: string,
  ): Promise<ArticleDocument | null>;
  infiniteByUserByTermCursor(
    authorId: string,
    term: string,
    cursor: Cursor,
  ): Promise<ArticleDocumentsPage>;
  updateByAuthorId(authorId: string, updates: UpdateUserInput): Promise<number>;
  findById(articleId: string): Promise<ArticleDocument | null>;
  decrementComments(articleId: string): Promise<void>;
  incrementComments(articleId: string): Promise<void>;
}

export const mongoArticlesRepository: ArticlesRepository = {
  async insert(article) {
    const collection =
      await getCollection<OptionalId<ArticleDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(article);
    return result.insertedId.toString();
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

    const articleDocuments = hasNextPage ? docs.slice(0, LIMIT) : docs;

    const nextCursor = hasNextPage
      ? articleDocuments[articleDocuments.length - 1]._id.toString()
      : null;

    return {
      articleDocuments,
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

  async infiniteByUserCursor(authorId, cursor) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    const LIMIT = 10;

    const query = {
      authorId: new ObjectId(authorId),
      ...(cursor && { _id: { $lt: new ObjectId(cursor) } }),
    };

    const docs = await collection
      .find(query)
      .sort({ _id: -1 })
      .limit(LIMIT + 1)
      .toArray();

    const hasNextPage = docs.length > LIMIT;
    const articleDocuments = hasNextPage ? docs.slice(0, LIMIT) : docs;

    const total = cursor
      ? null
      : await collection.countDocuments({ authorId: new ObjectId(authorId) });

    return {
      articleDocuments,
      total,
      nextCursor: hasNextPage
        ? articleDocuments[articleDocuments.length - 1]._id.toString()
        : null,
    };
  },

  async deleteByIdAndAuthor(id, authorId) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    const result = await collection.findOneAndDelete({
      _id: new ObjectId(id),
      authorId: new ObjectId(authorId),
    });
    return result;
  },

  async infiniteByUserByTermCursor(authorId, term, cursor) {
    const collection = await getCollection<ArticleDocument>(COLLECTION_NAME);
    // ======================
    // SEARCH MODE (Atlas)
    // ======================
    const contentFilter = {
      text: {
        query: term,
        path: "content",
        matchCriteria: "all",
      },
    };

    const authorIdFilter = {
      equals: {
        value: new ObjectId(authorId),
        path: "authorId",
      },
    };

    const scoreAndIdSort = {
      score: { $meta: "searchScore" },
      _id: -1,
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
          author: 1,
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

    const articleDocuments = hasNextPage ? docs.slice(0, LIMIT) : docs;

    return {
      articleDocuments,
      total: articleDocuments.length
        ? articleDocuments[articleDocuments.length - 1].meta.count.total
        : 0,
      nextCursor: hasNextPage
        ? articleDocuments[articleDocuments.length - 1].searchAfter
        : null,
    };
  },

  async updateByAuthorId(authorId, updates) {
    const collection =
      await getCollection<OptionalId<ArticleDocument>>(COLLECTION_NAME);

    const setFields: Record<string, unknown> = {};

    if (updates.username !== undefined) {
      setFields["author.username"] = updates.username;
    }

    if (updates.avatar !== undefined) {
      setFields["author.avatar"] = updates.avatar;
    }

    const result = await collection.updateMany(
      { authorId: new ObjectId(authorId) },
      {
        $set: setFields,
      },
    );
    return result.modifiedCount;
  },

  async findById(articleId: string) {
    const collection =
      await getCollection<OptionalId<ArticleDocument>>(COLLECTION_NAME);

    const result = await collection.findOne({ _id: new ObjectId(articleId) });

    return result;
  },

  async decrementComments(articleId) {
    const collection = await getCollection(COLLECTION_NAME);

    await collection.updateOne(
      { _id: new ObjectId(articleId), commentCount: { $gt: 0 } },
      { $inc: { commentCount: -1 } },
    );
  },

  async incrementComments(articleId) {
    const collection = await getCollection(COLLECTION_NAME);

    await collection.updateOne(
      { _id: new ObjectId(articleId) },
      { $inc: { commentCount: 1 } },
    );
  },
};
