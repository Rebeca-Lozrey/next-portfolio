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
import { useUser } from "@/providers/UserProvider";

import styles from "./ArticleForm.module.css";

export default function ArticleForm() {
  const [uploaded, setUploaded] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const user = useUser();

  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: createArticle,

    onMutate: async (newArticleInput) => {
      await queryClient.cancelQueries({ queryKey: articlesKeys.all });

      const prevData = queryClient.getQueryData(articlesKeys.all);

      const optimisticArticle = {
        ...newArticleInput,
        authorUsername: user?.username || "",
        authorId: user?.id || "",
        id: "temp-id",
        imageUrl: preview,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(
        articlesKeys.all,
        (old: InfiniteData<ArticlesPage> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                articles: [optimisticArticle, ...old.pages[0].articles],
              },
              ...old.pages.slice(1),
            ],
          };
        },
      );

      return { prevData };
    },

    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(articlesKeys.all, context.prevData);
      }
      console.error("Failed to publish article");
    },

    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: articlesKeys.all });
    },
  });

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsDirty(false);

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
          setUploaded(undefined);
          setPreview(null);
        },
      },
    );
  };

  const { root, form, avatar, fields, inline, textarea } = styles;
  return (
    <section className={root}>
      <Form.Root className={form} onSubmit={handleSubmit}>
        <div className={avatar}>
          <Avatar
            fallback={user?.username[0] || "U"}
            radius="full"
            size="3"
            alt="My profile photo"
          />
          {/* <Avatar fallback={authorUsername[0]} radius="full" size="2" /> */}
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
                onFocus={() => setIsDirty(true)}
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
                disabled={createArticleMutation.isPending || !user}
                color={createArticleMutation.isError ? "red" : "blue"}
              >
                {createArticleMutation.isPending ? "Posting..." : "Post"}
              </Button>
            </Form.Submit>
          </div>
          <div>
            {createArticleMutation.isError && createArticleMutation.error && (
              <Callout.Root size="1" color="red" role="alert">
                <Callout.Icon>
                  <CrossCircledIcon />
                </Callout.Icon>
                <Callout.Text>{"Failed to publish article"}</Callout.Text>
              </Callout.Root>
            )}
            {!user && isDirty && (
              <Callout.Root size="1" color="red" role="alert">
                <Callout.Icon>
                  <CrossCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  {"Please log in to publish an article."}
                </Callout.Text>
              </Callout.Root>
            )}
          </div>
        </div>
      </Form.Root>
    </section>
  );
}
