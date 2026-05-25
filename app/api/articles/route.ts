import { NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { createArticleSchema } from "@/lib/modules/articles/articles.schema";
import {
  createArticle,
  getArticles,
} from "@/lib/modules/articles/articles.service";
import { Article, ArticlesPage } from "@/lib/modules/articles/articles.types";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const article = await createArticle(mongoArticlesRepository, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: article,
      } satisfies SuccessResponse<Article>,
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Create article error:",
      "Failed to create article",
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    const page = await getArticles(
      mongoArticlesRepository,
      mongoLikesRepository,
      cursor,
    );
    return NextResponse.json(
      {
        success: true,
        data: page,
      } satisfies SuccessResponse<ArticlesPage>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch articles error: ",
      "Failed to fetch articles",
    );
  }
}
