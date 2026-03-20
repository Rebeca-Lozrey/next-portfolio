import type { ArticlesRepository } from "./articles.repository";
import type { Article } from "./articles.types";

interface CreateArticleInput {
  content: string;
  imageUrl?: string | null;
}

export async function createArticleService(
  repo: ArticlesRepository,
  input: CreateArticleInput,
): Promise<Article> {
  const article: Omit<Article, "id"> = {
    authorId: "user.id",
    authorUsername: "user.username",
    content: input.content,
    imageUrl: input.imageUrl ?? null,
    likeCount: 0,
    createdAt: new Date(),
  };

  const id = await repo.insert(article);

  return { ...article, id };
}
