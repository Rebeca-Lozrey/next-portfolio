import type {
  ArticlesPage,
  CreateArticleRequest,
  Cursor,
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

export async function getArticles(cursor: Cursor): Promise<ArticlesPage> {
  let url;
  if (cursor) {
    const params = new URLSearchParams({ cursor });
    url = `/api/articles?${params.toString()}`;
  } else {
    url = "/api/articles";
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}

export async function getMyArticles(cursor: Cursor): Promise<ArticlesPage> {
  let url;
  if (cursor) {
    const params = new URLSearchParams({ cursor });
    url = `/api/articles/me?${params.toString()}`;
  } else {
    url = "/api/articles/me";
  }
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch my articles");
  }

  return res.json();
}

export async function getMyArticlesByTerm(
  term: string,
  cursor: Cursor,
): Promise<ArticlesPage> {
  const params = new URLSearchParams({ term });

  if (cursor) {
    params.set("cursor", cursor);
  }

  const url = `/api/articles/me/search?${params.toString()}`;

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
