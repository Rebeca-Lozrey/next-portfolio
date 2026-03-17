import type { ArticlesRepository } from "./articles.repository";
import type { Article } from "./articles.types";

interface CreateArticleInput {
  authorId: string;
  authorUsername: string;
  content: string;
  imageUrl?: string | null;
}

export async function createArticle(
  repo: ArticlesRepository,
  input: CreateArticleInput,
): Promise<string> {
  const article: Omit<Article, "id"> = {
    authorId: input.authorId,
    authorUsername: input.authorUsername,
    content: input.content,
    imageUrl: input.imageUrl ?? null,
    likeCount: 0,
    createdAt: new Date(),
  };

  return repo.insert(article);
}
