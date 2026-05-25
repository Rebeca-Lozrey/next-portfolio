import { ObjectId } from "mongodb";

import { NotFoundError } from "@/lib/api/api.errors";
import { inngest } from "@/lib/inngest/client";

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

export async function createArticle(
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
    commentCount: 0,
    createdAt: new Date(),
  };

  const id = await repo.insert(article);

  return { ...article, id, likedByUser: false };
}

export async function getArticles(
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
    articles: rawPage.articleDocuments.map((doc) => ({
      id: doc._id.toString(),
      authorId: doc.authorId.toString(),
      author: {
        username: doc.author.username,
        avatar: doc.author.avatar,
      },
      content: doc.content,
      imageUrl: doc.imageUrl,
      likeCount: doc.likeCount,
      commentCount: doc.commentCount,
      likedByUser: likedSet.has(doc._id.toString()),
      createdAt: doc.createdAt,
    })),
    total: null,
    nextCursor: rawPage.nextCursor,
  };
  return page;
}

export async function getMyArticles(
  articlesRepo: ArticlesRepository,
  likesRepo: LikesRepository,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const user = await authenticateUser();
  const rawPage = await articlesRepo.infiniteByUserCursor(user.id, cursor);

  const likes = await likesRepo.findByUser(user.id);
  const likedSet = new Set(likes.map((l) => l.articleId));

  const page: ArticlesPage = {
    articles: rawPage.articleDocuments.map((doc) => ({
      id: doc._id.toString(),
      authorId: doc.authorId.toString(),
      author: { username: doc.author.username, avatar: doc.author.avatar },
      content: doc.content,
      imageUrl: doc.imageUrl,
      likeCount: doc.likeCount,
      commentCount: doc.commentCount,
      likedByUser: likedSet.has(doc._id.toString()),
      createdAt: doc.createdAt,
    })),
    total: rawPage.total,
    nextCursor: rawPage.nextCursor,
  };

  return page;
}

export async function deleteArticle(
  repo: ArticlesRepository,
  articleId: string,
): Promise<void> {
  const user = await authenticateUser();
  const deletedArticle = await repo.deleteByIdAndAuthor(articleId, user.id);

  if (!deletedArticle) {
    throw new NotFoundError("Article not found");
  }

  if (deletedArticle.imageUrl) {
    await inngest.send({
      name: "article.deleted",
      data: {
        imageUrl: deletedArticle.imageUrl,
        articleId,
      },
    });
  }
}

export async function searchMyArticlesByTerm(
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
    articles: rawPage.articleDocuments.map((doc) => ({
      id: doc._id.toString(),
      authorId: doc.authorId.toString(),
      author: { username: doc.author.username, avatar: doc.author.avatar },
      content: doc.content,
      imageUrl: doc.imageUrl,
      likeCount: doc.likeCount,
      commentCount: doc.commentCount,
      likedByUser: likedSet.has(doc._id.toString()),
      createdAt: doc.createdAt,
    })),
    total: rawPage.total,
    nextCursor: rawPage.nextCursor,
  };

  return page;
}

export async function getArticle(
  articlesRepo: ArticlesRepository,
  likesRepo: LikesRepository,
  articleId: string,
): Promise<Article | null> {
  const doc = await articlesRepo.findById(articleId);
  if (doc === null) {
    return null;
  }

  const user = await getCurrentUser();

  let likedSet = new Set<string>();
  if (user) {
    const likes = await likesRepo.findByUser(user.id);
    likedSet = new Set(likes.map((l) => l.articleId));
  }
  const article: Article = {
    id: doc._id.toString(),
    author: { username: doc.author.username, avatar: doc.author.avatar },
    content: doc.content,
    imageUrl: doc.imageUrl,
    likeCount: doc.likeCount,
    commentCount: doc.commentCount,
    likedByUser: likedSet.has(doc._id.toString()),
    createdAt: doc.createdAt,
  };

  return article;
}
