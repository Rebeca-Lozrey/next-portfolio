import { ObjectId } from "mongodb";

import { NotFoundError } from "@/lib/api/api.errors";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { extractPublicId } from "@/lib/cloudinary/cloudinary.utils";

import { authenticateUser, getCurrentUser } from "../auth/auth.service";
import { LikesRepository } from "../likes/likes.repository";
import { type ArticlesRepository } from "./articles.repository";
import type {
  Article,
  ArticleDocument,
  ArticlesPage,
  CreateArticleRequest,
  Cursor,
} from "./articles.types";

export async function createArticleService(
  repo: ArticlesRepository,
  input: CreateArticleRequest,
): Promise<Article> {
  const user = await authenticateUser();

  const article: Omit<ArticleDocument, "_id"> = {
    authorId: new ObjectId(user.id),
    author: { username: user.username, avatar: user.avatar },
    content: input.content,
    imageUrl: input.imageUrl ?? null,
    likeCount: 0,
    createdAt: new Date(),
  };

  const id = await repo.insert(article);

  return { ...article, id, likedByUser: false };
}

export async function getArticlesPage(
  articlesRepo: ArticlesRepository,
  likesRepo: LikesRepository,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const user = await getCurrentUser();
  const rawPage = await articlesRepo.infiniteByCursor(cursor);

  let likedSet = new Set<string>();
  if (user) {
    const likes = await likesRepo.findByUser(user.id);
    likedSet = new Set(likes.map((l) => l.articleId));
  }

  const page: ArticlesPage = {
    articles: rawPage.articles.map((ArticleDocument) => ({
      id: ArticleDocument._id.toString(),
      authorId: ArticleDocument.authorId.toString(),
      author: {
        username: ArticleDocument.author.username,
        avatar: ArticleDocument.author.avatar,
      },
      content: ArticleDocument.content,
      imageUrl: ArticleDocument.imageUrl,
      likeCount: ArticleDocument.likeCount,
      likedByUser: user ? likedSet.has(ArticleDocument._id.toString()) : false,
      createdAt: ArticleDocument.createdAt,
    })),
    total: null,
    nextCursor: rawPage.nextCursor,
  };
  return page;
}

export async function getMyArticlesPage(
  articlesRepo: ArticlesRepository,
  likesRepo: LikesRepository,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const user = await authenticateUser();
  const rawPage = await articlesRepo.infiniteByUserCursor(user.id, cursor);

  const likes = await likesRepo.findByUser(user.id);
  const likedSet = new Set(likes.map((l) => l.articleId));

  const page: ArticlesPage = {
    articles: rawPage.articles.map((doc) => ({
      id: doc._id.toString(),
      authorId: doc.authorId.toString(),
      author: { username: doc.author.username, avatar: doc.author.avatar },
      content: doc.content,
      imageUrl: doc.imageUrl,
      likeCount: doc.likeCount,
      likedByUser: likedSet.has(doc._id.toString()),
      createdAt: doc.createdAt,
    })),
    total: rawPage.total,
    nextCursor: rawPage.nextCursor,
  };

  return page;
}

export async function deleteArticleService(
  repo: ArticlesRepository,
  articleId: string,
): Promise<void> {
  const user = await authenticateUser();
  const deletedArticle = await repo.deleteByIdAndAuthor(articleId, user.id);

  if (!deletedArticle) {
    throw new NotFoundError("Article not found");
  }

  if (deletedArticle.imageUrl) {
    const publicId = extractPublicId(deletedArticle.imageUrl);

    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          invalidate: true,
        });
      } catch (error) {
        console.warn("Failed to delete Cloudinary image:", error);
      }
    }
  }
}

export async function getMyArticlesByTermPage(
  articlesRepo: ArticlesRepository,
  likesRepo: LikesRepository,
  term: string,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const user = await authenticateUser();
  const rawPage = await articlesRepo.infiniteByUserByTermCursor(
    user.id,
    term,
    cursor,
  );

  const likes = await likesRepo.findByUser(user.id);
  const likedSet = new Set(likes.map((l) => l.articleId));

  const page: ArticlesPage = {
    articles: rawPage.articles.map((doc) => ({
      id: doc._id.toString(),
      authorId: doc.authorId.toString(),
      author: { username: doc.author.username, avatar: doc.author.avatar },
      content: doc.content,
      imageUrl: doc.imageUrl,
      likeCount: doc.likeCount,
      likedByUser: likedSet.has(doc._id.toString()),
      createdAt: doc.createdAt,
    })),
    total: rawPage.total,
    nextCursor: rawPage.nextCursor,
  };

  return page;
}
