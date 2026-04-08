import { NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { createArticleSchema } from "@/lib/modules/articles/articles.schema";
import {
  createArticleService,
  getArticlesPage,
} from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function POST(_req: Request) {
  try {
    const body = await _req.json();

    const parsed = createArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const article = await createArticleService(
      mongoArticlesRepository,
      parsed.data,
    );

    return NextResponse.json(article);
  } catch (error) {
    console.error("Create article error:", error);

    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}

export async function GET(_req: Request) {
  try {
    const { searchParams } = new URL(_req.url);
    const cursor = searchParams.get("cursor") ?? null;

    const page = await getArticlesPage(
      mongoArticlesRepository,
      mongoLikesRepository,
      cursor,
    );
    return NextResponse.json(page);
  } catch (error) {
    console.error("Fetch articles error:", error);

    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
