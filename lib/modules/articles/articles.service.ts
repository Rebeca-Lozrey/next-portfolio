import { getCurrentUser } from "../auth/auth.service";
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
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const article: Omit<ArticleDocument, "_id"> = {
    authorId: user.id,
    authorUsername: user.username,
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
      authorId: ArticleDocument.authorId,
      authorUsername: ArticleDocument.authorUsername,
      content: ArticleDocument.content,
      imageUrl: ArticleDocument.imageUrl,
      likeCount: ArticleDocument.likeCount,
      likedByUser: likedSet.has(ArticleDocument._id.toString()),
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
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const rawPage = await articlesRepo.infiniteByUserCursor(user.id, cursor);

  const likes = await likesRepo.findByUser(user.id);
  const likedSet = new Set(likes.map((l) => l.articleId));

  const page: ArticlesPage = {
    articles: rawPage.articles.map((doc) => ({
      id: doc._id.toString(),
      authorId: doc.authorId,
      authorUsername: doc.authorUsername,
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
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const deleted = await repo.deleteByIdAndAuthor(articleId, user.id);

  if (!deleted) {
    throw new Error("NOT_FOUND");
  }
}

export async function getMyArticlesByTermPage(
  articlesRepo: ArticlesRepository,
  likesRepo: LikesRepository,
  term: string,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

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
      authorId: doc.authorId,
      authorUsername: doc.authorUsername,
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
