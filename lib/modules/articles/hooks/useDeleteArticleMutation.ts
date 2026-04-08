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
        articles: page.articles.filter((article) => article.id !== articleId),
      })),
    };
  };

export default function useDeleteArticleMutation() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,

    onMutate: async (articleId) => {
      await queryClient.cancelQueries({ queryKey: articlesKeys.all });

      const snapshot = {
        all: queryClient.getQueryData(articlesKeys.all),
        myArticles: queryClient.getQueryData(articlesKeys.myArticles),
      };

      queryClient.setQueryData(articlesKeys.all, optimisticUpdate(articleId));

      queryClient.setQueryData(
        articlesKeys.myArticles,
        optimisticUpdate(articleId),
      );

      return snapshot;
    },

    onError: (_err, _vars, context) => {
      if (context?.all) {
        queryClient.setQueryData(articlesKeys.all, context.all);
      }
      if (context?.myArticles) {
        queryClient.setQueryData(articlesKeys.myArticles, context.myArticles);
      }
      console.error("Failed to delete article");
    },

    onSettled: (_) => {
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
  });

  return deleteMutation;
}
