import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import {
  deleteArticle,
  getArticle,
} from "@/lib/modules/articles/articles.service";
import { Article } from "@/lib/modules/articles/articles.types";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid article id" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    await deleteArticle(mongoArticlesRepository, id);

    return NextResponse.json(
      {
        success: true,
        data: null,
      } satisfies SuccessResponse<null>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Delete article error",
      "Failed to delete article",
    );
  }
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid article id" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const article = await getArticle(
      mongoArticlesRepository,
      mongoLikesRepository,
      id,
    );

    return NextResponse.json(
      {
        success: true,
        data: article,
      } satisfies SuccessResponse<Article | null>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch article error",
      "Failed to fetch article",
    );
  }
}
