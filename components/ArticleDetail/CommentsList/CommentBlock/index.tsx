"use client";

import Image from "next/image";

import { Avatar } from "@radix-ui/themes";

import { Comment } from "@/lib/modules/comments/comments.types";

import styles from "./CommentBlock.module.css";

export default function CommentBlock({ comment }: { comment: Comment }) {
  const { author, content, createdAt } = comment;

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
              id="author-avatar-icon-for-comment"
            />
          </div>
          <span className={styles.username}>{author?.username}</span>
        </div>

        <span className={styles.date}>{formatted}</span>
      </header>

      <p className={styles.content}>{content}</p>
    </article>
  );
}
