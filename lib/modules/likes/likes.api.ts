import type { CreateLikeRequest } from "@/lib/modules/likes/likes.types";

export async function createLike({ articleId }: CreateLikeRequest) {
  const res = await fetch("/api/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articleId }),
  });

  if (!res.ok) {
    throw new Error("Failed to like article");
  }

  return res.json();
}
