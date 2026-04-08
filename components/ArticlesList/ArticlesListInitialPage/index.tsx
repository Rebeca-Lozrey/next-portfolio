import { use } from "react";

import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getArticlesPage } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

import ArticlesList from "..";

export default function ArticlesListInitialPage() {
  const initialPage = use(
    getArticlesPage(mongoArticlesRepository, mongoLikesRepository, null),
  );

  return <ArticlesList initialPage={initialPage} />;
}
