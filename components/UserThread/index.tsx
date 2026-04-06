"use client";

import { useRef } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { getMyArticles } from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";

import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import EmptyListMessage from "../EmptyListMessage";
import ArticleBlock from "./ArticleBlock";
import styles from "./UserThread.module.css";

export default function UserThread({
  initialPage,
}: {
  initialPage: ArticlesPage;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: articlesKeys.myArticles,
      queryFn: ({ pageParam }: { pageParam: string | null }) =>
        getMyArticles(pageParam),
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [initialPage],
        pageParams: [null],
      },
    });

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useInfiniteScroll({
    ref: loadMoreRef,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  const isEmpty = !data?.pages?.[0]?.articles.length;

  return (
    <section className={styles.feed}>
      {!isEmpty ? (
        data?.pages.map((page) =>
          page.articles.map((article, index) => {
            return (
              <ArticleBlock
                key={article.id}
                article={article}
                priority={index === 0}
              />
            );
          }),
        )
      ) : (
        <EmptyListMessage message="When you publish something, it will appear here." />
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
