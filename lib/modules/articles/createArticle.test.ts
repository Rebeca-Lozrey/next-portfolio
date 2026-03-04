import { describe, it, expect, vi } from "vitest";
import { createArticle } from "./createArticle.service";
import type { ArticlesRepository } from "./articles.repository";

describe("createArticle", () => {
  it("creates article with defaults", async () => {
    const mockRepo: ArticlesRepository = {
      insert: vi.fn().mockResolvedValue("abc123"),
      findById: vi.fn(),
    };

    const result = await createArticle(mockRepo, {
      authorId: "1",
      authorUsername: "rebeca",
      content: "Hello world",
    });

    expect(mockRepo.insert).toHaveBeenCalledTimes(1);

    const insertedArticle = (mockRepo.insert as any).mock.calls[0][0];

    expect(insertedArticle.likeCount).toBe(0);
    expect(insertedArticle.imageUrl).toBeNull();
    expect(insertedArticle.createdAt).toBeInstanceOf(Date);

    expect(result).toBe("abc123");
  });
});
