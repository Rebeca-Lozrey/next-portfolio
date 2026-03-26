import Image from "next/image";

import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { Avatar, IconButton } from "@radix-ui/themes";

import type { Article } from "@/lib/modules/articles/articles.types";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
}

export default function ArticleBlock({ article, priority }: ArticleBlockProps) {
  const { authorUsername, content, imageUrl, createdAt } = article;

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
        <span className={styles.likesCount}>12 likes</span>

        <div className={styles.rightActions}>
          <button className={styles.actionButton} aria-label="Like">
            <IconButton size="1" variant="outline">
              <CheckIcon />
            </IconButton>
            <span>LIKE</span>
          </button>
        </div>
      </footer>
    </article>
  );
}
