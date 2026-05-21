"use client";

import { useEffect, useRef } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { getCommentsRequest } from "@/lib/modules/comments/comments.api";
import { commentKeys } from "@/lib/modules/comments/comments.keys";
import { CommentsPage, Cursor } from "@/lib/modules/comments/comments.types";

import EmptyListMessage from "../../EmptyListMessage";
import Fallback from "../../Fallback";
import CommentBlock from "./CommentBlock";
import styles from "./CommentsList.module.css";

export default function CommentsList({
  articleId,
  initialCommentsPage,
}: {
  articleId: string;
  initialCommentsPage: CommentsPage;
}) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: commentKeys.forArticle(articleId),
    queryFn: ({ pageParam }: { pageParam: Cursor }): Promise<CommentsPage> =>
      getCommentsRequest(articleId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialCommentsPage],
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

  const isInitialLoading = isFetching && !data?.pages?.[0]?.comments.length;
  const hasNoComments = !isInitialLoading && !data?.pages?.[0]?.comments.length;

  const results = data?.pages.map((page) =>
    page.comments.map((comment) => {
      return <CommentBlock key={comment.id} comment={comment} />;
    }),
  );

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <section className={styles.feed}>
        {isInitialLoading ? (
          <p>Loading comments...</p>
        ) : hasNoComments ? (
          <EmptyListMessage message="There's no comments yet." />
        ) : (
          results
        )}

        <div ref={loadMoreRef} />

        {isFetchingNextPage && <p>Loading more...</p>}
        {isError && !isFetchingNextPage && (
          <div>
            Failed to load more comments.
            <button onClick={() => fetchNextPage()}>Retry</button>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}
