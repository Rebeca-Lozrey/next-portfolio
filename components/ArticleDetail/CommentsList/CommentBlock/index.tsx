"use client";

import Image from "next/image";

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
    </article>
  );
}
