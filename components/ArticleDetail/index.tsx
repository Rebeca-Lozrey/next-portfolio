"use client";

import { useQuery } from "@tanstack/react-query";

import { getArticleDetailRequest } from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { Article } from "@/lib/modules/articles/articles.types";
import { CommentsPage } from "@/lib/modules/comments/comments.types";

import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

type Props = {
  articleId: string;
  initialArticle: Article;
  initialCommentsPage: CommentsPage;
};

export default function ArticleDetail({
  articleId,
  initialArticle,
  initialCommentsPage,
}: Props) {
  const { data } = useQuery({
    queryKey: articlesKeys.articleDetail(articleId),
    queryFn: () => getArticleDetailRequest(articleId),
    initialData: initialArticle,
  });

  return (
    <>
      <div>{data.content}</div>
      <div>
        <CommentForm articleId={data.id} />
      </div>
      <div>
        <CommentsList
          articleId={data.id}
          initialCommentsPage={initialCommentsPage}
        />
      </div>
    </>
  );
}
