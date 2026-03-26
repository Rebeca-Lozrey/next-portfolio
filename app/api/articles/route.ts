import { NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { createArticleSchema } from "@/lib/modules/articles/articles.schema";
import { createArticleService } from "@/lib/modules/articles/articles.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;

    const page = await mongoArticlesRepository.infiniteByCursor(cursor);
    return NextResponse.json(page);
  } catch (error) {
    console.error("Fetch articles error:", error);

    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
