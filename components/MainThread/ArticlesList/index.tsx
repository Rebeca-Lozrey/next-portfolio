"use client";

import { useEffect, useRef } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getArticles } from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";

import ArticleBlock from "./ArticleBlock";
import styles from "./ArticlesList.module.css";

export default function ArticlesList() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: articlesKeys.all,
      queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
        getArticles(pageParam),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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

  return (
    <section className={styles.feed}>
      {data?.pages.map((page) =>
        page.articles.map((article, index) => {
          return (
            <ArticleBlock
              key={article.id}
              article={article}
              priority={index === 0}
            />
          );
        }),
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
