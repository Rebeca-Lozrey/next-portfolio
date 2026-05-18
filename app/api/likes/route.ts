import { NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";
import { createLikeSchema } from "@/lib/modules/likes/likes.schema";
import { toggleLike } from "@/lib/modules/likes/likes.service";
import { LikeStatus } from "@/lib/modules/likes/likes.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createLikeSchema.safeParse(body);

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

    const like = await toggleLike(
      mongoLikesRepository,
      mongoArticlesRepository,
      parsed.data,
    );

    return NextResponse.json(
      { success: true, data: like } satisfies SuccessResponse<LikeStatus>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Toggle like error: ",
      "Failed to toggle like",
    );
  }
}
