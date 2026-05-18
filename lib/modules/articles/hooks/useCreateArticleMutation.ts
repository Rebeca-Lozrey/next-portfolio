import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { Article, ArticlesPage } from "@/lib/modules/articles/articles.types";

import { PublicUser } from "../../users/users.types";
import { createArticle } from "../articles.api";

const optimisticUpdate =
  (optimisticArticle: Article) =>
  (old: InfiniteData<ArticlesPage> | undefined) => {
    if (!old) return old;

    return {
      ...old,
      pages: [
        {
          ...old.pages[0],
          articles: [optimisticArticle, ...old.pages[0].articles],
          total:
            typeof old.pages[0].total === "number"
              ? old.pages[0].total + 1
              : null,
        },
        ...old.pages.slice(1),
      ],
    };
  };

export const useCreateArticleMutation = (
  user: PublicUser | null,
  uploaded: string | undefined,
) => {
  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: createArticle,

    onMutate: async (newArticleInput) => {
      if (!user) {
        throw new Error("User must be defined");
      }
      await queryClient.cancelQueries({ queryKey: articlesKeys.all });

      const snapshot = {
        all: queryClient.getQueryData(articlesKeys.all),
        myArticles: queryClient.getQueryData(articlesKeys.myArticles(null)),
      };

      const tempId = crypto.randomUUID();

      const optimisticArticle = {
        ...newArticleInput,
        author: {
          username: user?.username,
          avatar: user?.avatar || null,
        },
        authorId: user?.id || "",
        id: tempId,
        imageUrl: uploaded ? uploaded : null,
        createdAt: new Date(),
        likeCount: 0,
        likedByUser: false,
      };

      queryClient.setQueryData(
        articlesKeys.all,
        optimisticUpdate(optimisticArticle),
      );

      queryClient.setQueryData(
        articlesKeys.myArticles(null),
        optimisticUpdate(optimisticArticle),
      );
      return snapshot;
    },

    onError: (_err, _vars, context) => {
      if (context?.all) {
        queryClient.setQueryData(articlesKeys.all, context.all);
      }
      if (context?.myArticles) {
        queryClient.setQueryData(
          articlesKeys.myArticles(null),
          context.myArticles,
        );
      }
      console.error("Failed to create article: ", _err);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
  });

  return createArticleMutation;
};
