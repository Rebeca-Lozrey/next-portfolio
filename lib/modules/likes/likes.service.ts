import { isDuplicateKeyError } from "@/lib/shared/mongo.utils";

import { ArticlesRepository } from "../articles/articles.repository";
import { getCurrentUser } from "../auth/auth.service";
import type { LikesRepository } from "./likes.repository";
import { CreateLikeRequest, Like } from "./likes.types";

export async function toggleLike(
  likesRepo: LikesRepository,
  articlesRepo: ArticlesRepository,
  { articleId }: CreateLikeRequest,
): Promise<{ liked: boolean }> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  const deleted = await likesRepo.delete(user.id, articleId);

  if (deleted) {
    await articlesRepo.decrementLikes(articleId);
    return { liked: false };
  }

  try {
    await likesRepo.insert({
      articleId,
      userId: user.id,
      createdAt: new Date(),
    });
    await articlesRepo.incrementLikes(articleId);

    return { liked: true };
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return { liked: true };
    }
    throw err;
  }
}
