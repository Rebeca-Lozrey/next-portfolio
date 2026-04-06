import { RefObject, useEffect } from "react";

type UseInfiniteScrollParams = {
  ref: RefObject<HTMLElement | null>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function useInfiniteScroll({
  ref,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollParams) {
  useEffect(() => {
    const el = ref.current;
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
  }, [ref, hasNextPage, isFetchingNextPage, fetchNextPage]);
}
