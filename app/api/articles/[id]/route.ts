import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { deleteArticleService } from "@/lib/modules/articles/articles.service";
import { ErrorResponse, SuccessResponse } from "@/lib/types/api.types";

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

    await deleteArticleService(mongoArticlesRepository, id);

    return NextResponse.json(
      {
        success: true,
        message: "Article deleted",
      } satisfies SuccessResponse,
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete article error", error);
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          { success: false, error: "Unauthorized" } satisfies ErrorResponse,
          { status: 401 },
        );
      }

      if (error.message === "NOT_FOUND") {
        return NextResponse.json(
          {
            success: false,
            error: "Article not found",
          } satisfies ErrorResponse,
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete article",
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }
}
