import Image from "next/image";

import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import type { Article } from "@/lib/modules/articles/articles.types";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
}

export default function ArticleBlock({ article, priority }: ArticleBlockProps) {
  const { content, imageUrl, createdAt, likedByUser, likeCount, id } = article;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <span className={styles.date}>
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </header>
      <div className={styles.divider}>
        {imageUrl && (
          <div className={styles.imageWrapper}>
            <Image
              priority={priority}
              src={imageUrl}
              alt="Article Image"
              fill
              sizes="(max-width: 768px) 100vw, 140px"
              style={{ objectFit: "cover" }}
              unoptimized={true}
            />
          </div>
        )}
        <p className={styles.content}>{content}</p>
      </div>

      <footer className={styles.actions}>
        <span className={styles.likesCount}>{likeCount} likes</span>
        <div className={styles.rightActions}>
          <DeleteButton articleId={id} />
          <LikeButton articleId={id} likedByUser={likedByUser} />
        </div>
      </footer>
    </article>
  );
}
