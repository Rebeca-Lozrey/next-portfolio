import { apiFetch } from "@/lib/api/apiFetch";
import type {
  Article,
  ArticlesPage,
  CreateArticleRequest,
  Cursor,
} from "@/lib/modules/articles/articles.types";

export async function createArticleRequest(
  payload: CreateArticleRequest,
): Promise<Article> {
  const result = await apiFetch<Article>("/api/articles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return result.data;
}

export async function getArticlesRequest(
  cursor: Cursor,
): Promise<ArticlesPage> {
  let url;
  if (cursor) {
    const params = new URLSearchParams({ cursor });
    url = `/api/articles?${params.toString()}`;
  } else {
    url = "/api/articles";
  }

  const result = await apiFetch<ArticlesPage>(url);

  return result.data;
}

export async function getMyArticlesRequest(
  cursor: Cursor,
): Promise<ArticlesPage> {
  let url;
  if (cursor) {
    const params = new URLSearchParams({ cursor });
    url = `/api/articles/me?${params.toString()}`;
  } else {
    url = "/api/articles/me";
  }
  const result = await apiFetch<ArticlesPage>(url, {
    method: "GET",
    credentials: "include",
  });

  return result.data;
}

export async function getMyArticlesByTermRequest(
  term: string,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const params = new URLSearchParams({ term });

  if (cursor) {
    params.set("cursor", cursor);
  }

  const url = `/api/articles/me/search?${params.toString()}`;

  const result = await apiFetch<ArticlesPage>(url, {
    method: "GET",
    credentials: "include",
  });

  return result.data;
}

export async function deleteArticleRequest(articleId: string) {
  const result = await apiFetch<null>(`/api/articles/${articleId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return result.data;
}

export async function getArticleDetailRequest(articleId: string) {
  const result = await apiFetch<Article>(`/api/articles/${articleId}`, {
    method: "GET",
  });

  return result.data;
}
