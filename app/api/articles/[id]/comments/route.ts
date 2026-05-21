import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";
import z from "zod";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { mongoCommentsRepository } from "@/lib/modules/comments/comments.repository";
import { createCommentSchema } from "@/lib/modules/comments/comments.schema";
import {
  createComment,
  getComments,
} from "@/lib/modules/comments/comments.service";
import { Comment, CommentsPage } from "@/lib/modules/comments/comments.types";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: articleId } = await context.params;
    const body = await req.json();

    if (!ObjectId.isValid(articleId)) {
      return NextResponse.json(
        { success: false, error: "Invalid article id" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const parsed = createCommentSchema.safeParse(body);

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

    const comment = await createComment(
      mongoCommentsRepository,
      mongoArticlesRepository,
      articleId,
      parsed.data,
    );

    return NextResponse.json(
      {
        success: true,
        data: comment,
      } satisfies SuccessResponse<Comment>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Create comment error",
      "Failed to create comment",
    );
  }
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: articleId } = await context.params;
    const { searchParams } = new URL(req.url);

    if (!ObjectId.isValid(articleId)) {
      return NextResponse.json(
        { success: false, error: "Invalid article id" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const cursor = searchParams.get("cursor");

    if (cursor && !ObjectId.isValid(cursor)) {
      return NextResponse.json(
        { success: false, error: "Invalid comment id" } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const page = await getComments(mongoCommentsRepository, articleId, cursor);

    return NextResponse.json(
      {
        success: true,
        data: page,
      } satisfies SuccessResponse<CommentsPage>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch comment error",
      "Failed to comment article",
    );
  }
}
