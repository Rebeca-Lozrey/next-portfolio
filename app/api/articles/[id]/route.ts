import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { deleteArticleService } from "@/lib/modules/articles/articles.service";

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
