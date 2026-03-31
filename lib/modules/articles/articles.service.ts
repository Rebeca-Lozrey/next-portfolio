import { getCurrentUser } from "../auth/auth.service";
import { LikesRepository } from "../likes/likes.repository";
import { type ArticlesRepository } from "./articles.repository";
import type {
  Article,
  ArticleDocument,
  ArticlesPage,
  CreateArticleRequest,
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
  cursor: string | undefined,
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
    nextCursor: rawPage.nextCursor,
  };
  return page;
}
