import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import type { Article } from "./articles.types";

const COLLECTION_NAME = "articles";

export interface ArticlesRepository {
  insert(article: Article): Promise<string>;
  findById(id: string): Promise<Article | null>;
}

export const mongoArticlesRepository: ArticlesRepository = {
  async insert(article) {
    const collection = await getCollection<Article>(COLLECTION_NAME);
    const result = await collection.insertOne(article);
    return result.insertedId.toString();
  },

  async findById(id) {
    const collection = await getCollection<Article>(COLLECTION_NAME);
    return collection.findOne({ _id: new ObjectId(id) });
  },
};
