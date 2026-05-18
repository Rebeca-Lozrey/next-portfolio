import Image from "next/image";

import LikeButton from "@/components/LikeButton";
import type { Article } from "@/lib/modules/articles/articles.types";
import { useUser } from "@/providers/UserProvider";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
}

export default function ArticleBlock({ article, priority }: ArticleBlockProps) {
  const { author, content, imageUrl, createdAt, likedByUser, likeCount, id } =
    article;
  const user = useUser();

  const date = new Date(createdAt);
  const formatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <div className={styles.author}>
          <div className={styles.avatarImage}>
            <Image
              src={
                author?.avatar
                  ? author.avatar
                  : "https://res.cloudinary.com/dmpiaetro/image/upload/v1776984223/7b66703c-c159-4bb5-b3cb-bef5bc445668.png"
              }
              alt="Profile Image"
              fill
              sizes="32px"
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
        <span className={styles.likesCount}>{likeCount} likes</span>

        <div className={styles.rightActions}>
          {user && (
            <LikeButton articleId={id} likedByUser={likedByUser} term={null} />
          )}
        </div>
      </footer>
    </article>
  );
}
