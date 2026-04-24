"use client";

import { useRef, useState } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import useDebounce from "@/hooks/useDebounce";
import {
  getMyArticles,
  getMyArticlesByTerm,
} from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage, Cursor } from "@/lib/modules/articles/articles.types";

import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import EmptyListMessage from "../EmptyListMessage";
import Fallback from "../Fallback";
import ArticleBlock from "./ArticleBlock";
import Search from "./Search";
import styles from "./UserThread.module.css";
import UserThreadSkeleton from "./UserThreadSkeleton";

function UserThreadRaw({ initialPage }: { initialPage: ArticlesPage }) {
  const [searchValue, setSearchValue] = useState("");
  const debouncedTerm = useDebounce(searchValue.trim());
  const term = debouncedTerm || null;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: [...articlesKeys.myArticles(term)],
    queryFn: ({ pageParam }: { pageParam: Cursor }) => {
      if (!term) {
        return getMyArticles(pageParam);
      }
      return getMyArticlesByTerm(term, pageParam);
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: term
      ? undefined
      : {
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

  const isInitialLoading = isFetching && !data?.pages?.[0]?.articles.length;
  const hasNoUserArticles =
    !isInitialLoading && !term && !data?.pages?.[0]?.articles.length;
  const hasNoResultsForTerm =
    !isInitialLoading && term && !data?.pages?.[0]?.articles.length;

  const results = data?.pages.map((page) =>
    page.articles.map((article, index) => {
      return (
        <ArticleBlock
          key={article.id}
          article={article}
          priority={index === 0}
          term={term}
        />
      );
    }),
  );

  const total =
    typeof data?.pages[0]?.total === "number" ? data?.pages[0]?.total : null;

  return (
    <>
      <Search
        value={searchValue}
        handleChange={(event) => setSearchValue(event?.target.value)}
      />

      {!isInitialLoading && typeof total === "number" && (
        <div className={styles.date}>
          {total} article{total === 1 ? "" : "s"}
        </div>
      )}
      <section className={styles.feed}>
        {isInitialLoading ? (
          <UserThreadSkeleton />
        ) : hasNoUserArticles ? (
          <EmptyListMessage message="You haven’t published any articles yet. When you do, they’ll appear here." />
        ) : hasNoResultsForTerm ? (
          <EmptyListMessage message="No articles match your search. Try a different term." />
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
    </>
  );
}

export default function UserThread({
  initialPage,
}: {
  initialPage: ArticlesPage;
}) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <UserThreadRaw initialPage={initialPage} />
    </ErrorBoundary>
  );
}
