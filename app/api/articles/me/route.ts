import { NextRequest, NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getMyArticlesPage } from "@/lib/modules/articles/articles.service";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor");

    const page = await getMyArticlesPage(
      mongoArticlesRepository,
      mongoLikesRepository,
      cursor,
    );

    return NextResponse.json(
      { success: true, data: page } satisfies SuccessResponse<ArticlesPage>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch user articles error: ",
      "Failed to fetch user articles",
    );
  }
}
