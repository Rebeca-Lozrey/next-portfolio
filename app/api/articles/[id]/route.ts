import { NextResponse } from "next/server";

import { ObjectId } from "mongodb";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { deleteArticleService } from "@/lib/modules/articles/articles.service";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid article id" }, { status: 400 });
  }
  try {
    await deleteArticleService(mongoArticlesRepository, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    const err = error as Error;
    if (err.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (err.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    console.error("Delete article error", error);

    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}
