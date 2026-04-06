import { ArticlesPage } from "@/lib/modules/articles/articles.types";

import ArticleForm from "./ArticleForm";
import ArticlesList from "./ArticlesList";

export default function MainThread({
  initialPage,
}: {
  initialPage: ArticlesPage;
}) {
  return (
    <>
      <ArticleForm />
      <ArticlesList initialPage={initialPage} />
    </>
  );
}
