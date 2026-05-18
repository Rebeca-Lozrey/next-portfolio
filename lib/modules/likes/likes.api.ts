import { apiFetch } from "@/lib/api/apiFetch";
import type {
  CreateLikeRequest,
  LikeStatus,
} from "@/lib/modules/likes/likes.types";

export async function createLike({ articleId }: CreateLikeRequest) {
  const result = await apiFetch<LikeStatus>("/api/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ articleId }),
  });

  return result.data;
}
