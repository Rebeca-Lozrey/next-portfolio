import Image from "next/image";

import { Avatar } from "@radix-ui/themes";

import type { Article } from "@/lib/modules/articles/articles.types";

import styles from "./ArticleBlock.module.css";

interface ArticleBlockProps {
  article: Article;
  priority: boolean;
}

export default function ArticleBlock({ article, priority }: ArticleBlockProps) {
  const { authorUsername, content, imageUrl } = article;

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <Avatar fallback={authorUsername[0]} radius="full" size="2" />
        <span className={styles.username}>{authorUsername}</span>
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
          />
        </div>
      )}
    </article>
  );
}
