"use client";

import Image from "next/image";

import { Avatar } from "@radix-ui/themes";

import LikeButton from "@/components/LikeButton";
import ViewArticleButton from "@/components/ViewArticleButton";
import type { Article } from "@/lib/modules/articles/articles.types";
import { useUser } from "@/providers/UserProvider";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
}

export default function ArticleBlock({ article, priority }: ArticleBlockProps) {
  const {
    author,
    content,
    imageUrl,
    createdAt,
    likedByUser,
    likeCount,
    commentCount,
    id,
  } = article;
  const user = useUser();

  const date = new Date(createdAt);
  const formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.author}>
          <div>
            <Avatar
              src={author?.avatar ? author?.avatar : undefined}
              fallback={author?.username?.[0]?.toUpperCase() || "U"}
              size="3"
              radius="full"
              aria-label="Upload avatar image"
              id="author-avatar-icon-for-article"
            />
          </div>
          <span className={styles.username}>{author?.username}</span>
        </div>

        <span className={styles.date}>{formatted}</span>
      </header>

      <p className={styles.content}>{content}</p>

      {imageUrl && (
        <div className={styles.imageWrapper}>
          <Image
            priority={priority}
            src={imageUrl}
            alt="Article Image"
            fill
            sizes="640px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <footer className={styles.actions}>
        <div className={styles.rightActions}>
          <span className={styles.likeCount}>{likeCount} likes</span>
          <span className={styles.commentCount}>{commentCount} comments</span>
        </div>
        <div className={styles.rightActions}>
          <ViewArticleButton articleId={id} />
          {user && (
            <LikeButton articleId={id} likedByUser={likedByUser} term={null} />
          )}
        </div>
      </footer>
    </article>
  );
}
