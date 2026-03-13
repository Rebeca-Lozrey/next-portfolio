"use client";
import { useState } from "react";

import { Avatar, Button, TextArea } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";

import ImageUploadButton from "@/components/ImageUploadButton";
import { createArticle } from "@/lib/modules/articles/articles.api";

import styles from "./ArticleForm.module.css";

export default function ArticleForm() {
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const createArticleMutation = useMutation({
    mutationFn: createArticle,
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const content = formData.get("content") as string;

    createArticleMutation.mutate(
      {
        content,
        imageUrl: uploaded,
      },
      {
        onSuccess: () => {
          form.reset();
          setUploaded(null);
          setPreview(null);
        },
      },
    );
  };

  const { root, form, avatar, fields, inline } = styles;
  return (
    <div className={root}>
      <form className={form} onSubmit={handleSubmit}>
        <div className={avatar}>
          <Avatar fallback="U" radius="full" size="3" alt="My profile photo" />
        </div>

        <div className={fields}>
          <TextArea
            name="content"
            placeholder="Write something..."
            rows={4}
            required
            color="gray"
            aria-label="Post content"
          />

          <div className={inline}>
            <ImageUploadButton
              setUploaded={setUploaded}
              setPreview={setPreview}
              preview={preview}
            />
            <Button type="submit" disabled={createArticleMutation.isPending}>
              Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
