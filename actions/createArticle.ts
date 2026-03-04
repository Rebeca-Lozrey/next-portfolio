"use server";

import { createArticle } from "@/lib/modules/articles/createArticle.service";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";

export async function createArticleAction(formData: FormData) {
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!content) {
    throw new Error("Content is required");
  }

  // Hardcoded user for now (no auth yet)
  const authorId = "123";
  const authorUsername = "rebeca";

  const insertedId = await createArticle(mongoArticlesRepository, {
    authorId,
    authorUsername,
    content,
    imageUrl,
  });

  console.log("Article created", insertedId.toString());
}
