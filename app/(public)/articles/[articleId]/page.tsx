import { notFound } from "next/navigation";

import ArticleDetail from "@/components/ArticleDetail";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getArticle } from "@/lib/modules/articles/articles.service";
import { mongoCommentsRepository } from "@/lib/modules/comments/comments.repository";
import { getComments } from "@/lib/modules/comments/comments.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

type Props = {
  params: Promise<{ articleId: string }>;
};

export default async function Detail({ params }: Props) {
  const { articleId } = await params;

  const article = await getArticle(
    mongoArticlesRepository,
    mongoLikesRepository,
    articleId,
  );

  const comments = await getComments(mongoCommentsRepository, articleId, null);

  if (!article) {
    notFound();
  }

  return (
    <ArticleDetail
      articleId={articleId}
      initialArticle={article}
      initialCommentsPage={comments}
    />
  );
}
