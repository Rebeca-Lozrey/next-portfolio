import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteArticle } from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";

const optimisticUpdate =
  (articleId: string) => (old: InfiniteData<ArticlesPage> | undefined) => {
    if (!old) return old;
    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        total: page.total ? page.total - 1 : null,
        articles: page.articles.filter((article) => article.id !== articleId),
      })),
    };
  };

export default function useDeleteArticleMutation(term: string | null) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,

    onMutate: async (articleId) => {
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
      console.error("Failed to delete article");
    },

    onSettled: (_) => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: articlesKeys.all });
        queryClient.invalidateQueries({
          queryKey: articlesKeys.myArticles(term),
        });
      }, 10000);
    },
  });

  return deleteMutation;
}
