import { NextRequest, NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getMyArticlesByTermPage } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export async function GET(req: NextRequest) {
  const termRaw = req.nextUrl.searchParams.get("term");
  const term = termRaw?.trim();

  if (!term) {
    return NextResponse.json(
      { error: "Search term is required" },
      { status: 400 },
    );
  }

  if (term.length > 15) {
    return NextResponse.json({ error: "Term too long" }, { status: 400 });
  }

  const cursor = req.nextUrl.searchParams.get("cursor");

  try {
    const page = await getMyArticlesByTermPage(
      mongoArticlesRepository,
      mongoLikesRepository,
      term,
      cursor,
    );

    return NextResponse.json(page);
  } catch (error) {
    console.error((error as Error).message);
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to search user articles" },
      { status: 500 },
    );
  }
}
