import { apiFetch } from "@/lib/api/apiFetch";

import { CommentsPage } from "./comments.types";

export async function createCommentRequest(
  articleId: string,
  content: string,
): Promise<Comment> {
  const result = await apiFetch<Comment>(
    `/api/articles/${articleId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    },
  );

  return result.data;
}

export async function getCommentsRequest(
  articleId: string,
  cursor: string | null,
): Promise<CommentsPage> {
  const params = new URLSearchParams();

  let url: string;
  if (cursor) {
    params.set("cursor", cursor);
    url = `/api/articles/${articleId}/comments?${params.toString()}`;
  } else {
    url = `/api/articles/${articleId}/comments`;
  }
  const result = await apiFetch<CommentsPage>(url);
  return result.data;
}
