import { NextRequest, NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getMyArticlesPage } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor");

  try {
    const page = await getMyArticlesPage(
      mongoArticlesRepository,
      mongoLikesRepository,
      cursor,
    );

    return NextResponse.json(page);
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch user articles" },
      { status: 500 },
    );
  }
}
