import Image from "next/image";

import DeleteButton from "@/components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import type { Article } from "@/lib/modules/articles/articles.types";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
  term: string | null;
}

export default function ArticleBlock({
  article,
  priority,
  term,
}: ArticleBlockProps) {
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
              sizes="256px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
        <p className={styles.content}>{content}</p>
      </div>

      <footer className={styles.actions}>
        <span className={styles.likesCount}>{likeCount} likes</span>
        <div className={styles.rightActions}>
          <DeleteButton articleId={id} term={term} />
          <LikeButton articleId={id} likedByUser={likedByUser} term={term} />
        </div>
      </footer>
    </article>
  );
}
