import Image from "next/image";

import { Avatar, IconButton } from "@radix-ui/themes";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import type {
  Article,
  ArticlesPage,
} from "@/lib/modules/articles/articles.types";
import { createLike } from "@/lib/modules/likes/likes.api";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
}

export default function ArticleBlock({ article, priority }: ArticleBlockProps) {
  const queryClient = useQueryClient();
  const {
    authorUsername,
    content,
    imageUrl,
    createdAt,
    likedByUser,
    likeCount,
  } = article;

  const createArticleMutation = useMutation({
    mutationFn: createLike,

    onMutate: async ({ articleId }) => {
      await queryClient.cancelQueries({ queryKey: articlesKeys.all });

      const prevData = queryClient.getQueryData(articlesKeys.all);

      queryClient.setQueryData(
        articlesKeys.all,
        (old: InfiniteData<ArticlesPage> | undefined) => {
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
        },
      );

      return { prevData };
    },

    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(articlesKeys.all, context.prevData);
      }
      console.error("Failed to publish article");
    },

    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
  });

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.author}>
          <Avatar fallback={authorUsername[0]} radius="full" size="2" />
          <span className={styles.username}>{authorUsername}</span>
        </div>

        <span className={styles.date}>
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </header>

      <p className={styles.content}>{content}</p>

      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            priority={priority}
            src={imageUrl}
            alt="Article Image"
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        </div>
      )}
      <footer className={styles.actions}>
        <span className={styles.likesCount}>{likeCount} likes</span>

        <div className={styles.rightActions}>
          <IconButton
            size="3"
            variant="outline"
            className="likeButton"
            onClick={() =>
              createArticleMutation.mutate({ articleId: article.id })
            }
          >
            {likedByUser ? (
              <span className={styles.likedButtonLabel}>LIKED</span>
            ) : (
              <span className={styles.likeButtonLabel}>LIKE</span>
            )}
          </IconButton>
        </div>
      </footer>
    </article>
  );
}
