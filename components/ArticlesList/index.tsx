"use client";

import { useEffect, useRef } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { getArticles } from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage, Cursor } from "@/lib/modules/articles/articles.types";

import EmptyListMessage from "../EmptyListMessage";
import Fallback from "../Fallback";
import ArticleBlock from "./ArticleBlock";
import styles from "./ArticlesList.module.css";

function ArticlesListRaw({ initialPage }: { initialPage: ArticlesPage }) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: articlesKeys.all,
    queryFn: ({ pageParam }: { pageParam: Cursor }) => getArticles(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialPage],
      pageParams: [null],
    },
  });

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const isInitialLoading = isFetching && !data?.pages?.[0]?.articles.length;
  const hasNoArticles = !isInitialLoading && !data?.pages?.[0]?.articles.length;

  const results = data?.pages.map((page) =>
    page.articles.map((article, index) => {
      return (
        <ArticleBlock
          key={article.id}
          article={article}
          priority={index === 0}
        />
      );
    }),
  );

  return (
    <section className={styles.feed}>
      {isInitialLoading ? (
        <p>Loading articles...</p>
      ) : hasNoArticles ? (
        <EmptyListMessage message="There's no published articles yet." />
      ) : (
        results
      )}

      <div ref={loadMoreRef} />

      {isFetchingNextPage && <p>Loading more...</p>}
      {isError && !isFetchingNextPage && (
        <div>
          Failed to load more articles.
          <button onClick={() => fetchNextPage()}>Retry</button>
        </div>
      )}
    </section>
  );
}

export default function ArticlesList({
  initialPage,
}: {
  initialPage: ArticlesPage;
}) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ArticlesListRaw initialPage={initialPage} />
    </ErrorBoundary>
  );
}
