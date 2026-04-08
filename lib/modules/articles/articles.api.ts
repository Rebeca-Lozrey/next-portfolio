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

export async function getArticles(
  cursor: string | null,
): Promise<ArticlesPage> {
  const res = await fetch(`/api/articles?cursor=${cursor ?? ""}`);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}

export async function getMyArticles(
  cursor: string | null,
): Promise<ArticlesPage> {
  const url = cursor ? `/api/articles/me?cursor=${cursor}` : `/api/articles/me`;
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my articles");
  }

  return res.json();
}

export async function deleteArticle(articleId: string) {
  const res = await fetch(`/api/articles/${articleId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete article");
  }

  return res.json();
}
