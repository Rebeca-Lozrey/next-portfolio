import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";

import { User } from "../../users/users.types";
import { createArticle } from "../articles.api";

export const useCreateArticleMutation = (
  user: User | null,
  uploaded: string | undefined,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,

    onMutate: async (newArticleInput) => {
      await queryClient.cancelQueries({ queryKey: articlesKeys.all });

      const prevData = queryClient.getQueryData(articlesKeys.all);

      const optimisticArticle = {
        ...newArticleInput,
        authorUsername: user?.username || "",
        authorId: user?.id || "",
        id: "temp-id",
        imageUrl: uploaded,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        articlesKeys.all,
        (old: InfiniteData<ArticlesPage> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                articles: [optimisticArticle, ...old.pages[0].articles],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      return { prevData };
    },

    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(articlesKeys.all, context.prevData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
  });
};
