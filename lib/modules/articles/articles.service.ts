import { getCurrentUser } from "../auth/auth.service";
import type { ArticlesRepository } from "./articles.repository";
import type { Article, CreateArticleRequest } from "./articles.types";

export async function createArticleService(
  repo: ArticlesRepository,
  input: CreateArticleRequest,
): Promise<Article> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const article: Omit<Article, "id"> = {
    authorId: user.id,
    authorUsername: user.username,
    content: input.content,
    imageUrl: input.imageUrl ?? null,
    likeCount: 0,
    createdAt: new Date(),
  };

  const id = await repo.insert(article);

  return { ...article, id };
}
