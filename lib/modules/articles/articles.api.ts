import type {
  ArticlesPage,
  CreateArticleRequest,
} from "@/lib/modules/articles/articles.types";

export async function createArticle(payload: CreateArticleRequest) {
  const res = await fetch("/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create article");
  }

  return res.json();
}

export async function getArticles(cursor?: string): Promise<ArticlesPage> {
  const res = await fetch(`/api/articles?cursor=${cursor ?? ""}`);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}
