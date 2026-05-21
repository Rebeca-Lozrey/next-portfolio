import { NextRequest, NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { searchMyArticlesByTerm } from "@/lib/modules/articles/articles.service";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function GET(req: NextRequest) {
  try {
    const termRaw = req.nextUrl.searchParams.get("term");
    const term = termRaw?.trim();

    if (!term) {
      return NextResponse.json(
        {
          success: false,
          error: "Search term is required",
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    if (term.length > 40) {
      return NextResponse.json(
        { success: false, error: "Term too long" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const cursor = req.nextUrl.searchParams.get("cursor");

    const page = await searchMyArticlesByTerm(
      mongoArticlesRepository,
      mongoLikesRepository,
      term,
      cursor,
    );

    return NextResponse.json(
      { success: true, data: page } satisfies SuccessResponse<ArticlesPage>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Search user articles error: ",
      "Failed to search user articles",
    );
  }
}
