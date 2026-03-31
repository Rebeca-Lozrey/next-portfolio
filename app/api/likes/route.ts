import { NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";
import { createLikeSchema } from "@/lib/modules/likes/likes.schema";
import { toggleLike } from "@/lib/modules/likes/likes.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createLikeSchema.safeParse(body);

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

    const like = await toggleLike(
      mongoLikesRepository,
      mongoArticlesRepository,
      parsed.data,
    );

    return NextResponse.json(like);
  } catch (error) {
    console.error("Create like error:", error);

    return NextResponse.json(
      { error: "Failed to like article" },
      { status: 500 },
    );
  }
}
