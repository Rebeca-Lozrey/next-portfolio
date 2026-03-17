"use client";
import { useState } from "react";

import * as Form from "@radix-ui/react-form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Callout, TextArea } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";

import ImageUploadButton from "@/components/ImageUploadButton";
import { createArticle } from "@/lib/modules/articles/articles.api";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { ArticlesPage } from "@/lib/modules/articles/articles.types";

import styles from "./ArticleForm.module.css";

export default function ArticleForm() {
  const [uploaded, setUploaded] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: (newArticle) => {
      queryClient.setQueryData(
        articlesKeys.all,
        (prevData: InfiniteData<ArticlesPage> | undefined) => {
          if (!prevData) return;

          return {
            ...prevData,
            pages: [
              {
                ...prevData.pages[0],
                articles: [newArticle, ...prevData.pages[0].articles],
              },
              ...prevData.pages.slice(1),
            ],
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
    onError: () => {
      console.error("Failed to publish article");
    },
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

  const { root, form, avatar, fields, inline, textarea } = styles;
  return (
    <div className={root}>
      <Form.Root className={form} onSubmit={handleSubmit}>
        <div className={avatar}>
          <Avatar fallback="U" radius="full" size="3" alt="My profile photo" />
        </div>

        <div className={fields}>
          <Form.Field name="content">
            <Form.Control asChild>
              <TextArea
                className={textarea}
                name="content"
                placeholder="Write something..."
                rows={4}
                required
                color="gray"
                aria-label="Post content"
              />
            </Form.Control>

            <Form.Message match="valueMissing">
              Content is required
            </Form.Message>
          </Form.Field>

          <div className={inline}>
            <ImageUploadButton
              setUploaded={setUploaded}
              setPreview={setPreview}
              preview={preview}
            />
            <Form.Submit asChild>
              <Button
                disabled={createArticleMutation.isPending}
                color={createArticleMutation.isError ? "red" : "blue"}
              >
                {createArticleMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </Form.Submit>
          </div>
          <div>
            {createArticleMutation.isError && (
              <Callout.Root size="1" color="red" role="alert">
                <Callout.Icon>
                  <CrossCircledIcon />
                </Callout.Icon>
                <Callout.Text>Failed to publish article</Callout.Text>
              </Callout.Root>
            )}
          </div>
        </div>
      </Form.Root>
    </div>
  );
}
