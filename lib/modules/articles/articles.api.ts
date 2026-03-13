import type { CreateArticleRequest } from "@/lib/modules/articles/articles.types";

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
