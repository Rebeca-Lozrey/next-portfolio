import { ObjectId } from "mongodb";

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
  createdAt: Date;
}

export interface CreateArticleRequest {
  content: string;
  imageUrl?: string | null;
}

export interface ArticlesPage {
  articles: Article[];
  nextCursor: string | null;
}
