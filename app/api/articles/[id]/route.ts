import { NextResponse } from "next/server";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { deleteArticleService } from "@/lib/modules/articles/articles.service";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await deleteArticleService(mongoArticlesRepository, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as Error).message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((error as Error).message === "INVALID_ID") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    if ((error as Error).message === "NOT_FOUND") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    console.error("Delete article error", error);

    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
