import { Suspense } from "react";

import ArticleForm from "@/components/ArticleForm";
import ArticlesListInitialPage from "@/components/ArticlesList/ArticlesListInitialPage";
import ArticlesListSkeleton from "@/components/ArticlesList/ArticlesListSkeleton";

export default async function Home() {
  return (
    <div className="thread">
      <ArticleForm />
      <Suspense fallback={<ArticlesListSkeleton />}>
        <ArticlesListInitialPage />
      </Suspense>
    </div>
  );
}
