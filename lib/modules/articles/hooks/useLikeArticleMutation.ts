import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";

import { createLike } from "../../likes/likes.api";

const optimisticUpdate =
  (articleId: string) => (old: InfiniteData<ArticlesPage> | undefined) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        articles: page.articles.map((article) => {
          if (article.id === articleId) {
            return {
              ...article,
              likedByUser: !article.likedByUser,
              likeCount: article.likedByUser
                ? article.likeCount - 1
                : article.likeCount + 1,
            };
          }
          return article;
        }),
      })),
    };
  };

export default function useLikeArticleMutation(term: string | null) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: createLike,

    onMutate: async ({ articleId }) => {
      await queryClient.cancelQueries({ queryKey: articlesKeys.all });

      const snapshot = {
        all: queryClient.getQueryData(articlesKeys.all),
        myArticles: queryClient.getQueryData(articlesKeys.myArticles(term)),
      };

      queryClient.setQueryData(articlesKeys.all, optimisticUpdate(articleId));

      queryClient.setQueryData(
        articlesKeys.myArticles(term),
        optimisticUpdate(articleId),
      );

      return snapshot;
    },

    onError: (_err, _vars, context) => {
      if (context?.all) {
        queryClient.setQueryData(articlesKeys.all, context.all);
      }
      if (context?.myArticles) {
        queryClient.setQueryData(
          articlesKeys.myArticles(term),
          context.myArticles,
        );
      }
      console.error("Failed to publish article");
    },

    onSettled: (_) => {
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
  });

  return likeMutation;
}
