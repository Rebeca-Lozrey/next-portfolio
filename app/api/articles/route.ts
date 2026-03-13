import { NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import type { Article } from "@/lib/modules/articles/articles.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, imageUrl } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    const article: Article = {
      authorId: "user.id",
      authorUsername: "user.username",
      content,
      imageUrl: imageUrl ?? null,
      likeCount: 0,
      createdAt: new Date(),
    };

    const insertedId = await mongoArticlesRepository.insert(article);

    return NextResponse.json({
      success: true,
      id: insertedId,
    });
  } catch (error) {
    console.error("Create article error:", error);

    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}
