"use client";

import { useState } from "react";

import * as Form from "@radix-ui/react-form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Button, Callout, TextArea } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { createCommentRequest } from "@/lib/modules/comments/comments.api";
import { commentKeys } from "@/lib/modules/comments/comments.keys";
import { useUser } from "@/providers/UserProvider";

import Fallback from "../../Fallback";
import styles from "./CommentForm.module.css";

export default function CommentForm({ articleId }: { articleId: string }) {
  const [isDirty, setIsDirty] = useState(false);
  const [value, setValue] = useState("");
  const user = useUser();

  const queryClient = useQueryClient();
  const createCommentMutation = useMutation({
    mutationFn: ({
      articleId,
      content,
    }: {
      articleId: string;
      content: string;
    }) => createCommentRequest(articleId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.forArticle(articleId),
      });
      queryClient.invalidateQueries({
        queryKey: articlesKeys.all,
      });
    },
  });
  const { isPending, isError, error } = createCommentMutation;
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsDirty(false);

    const formData = new FormData(form);
    const content = formData.get("content") as string;

    createCommentMutation.mutate(
      {
        content,
        articleId,
      },
      {
        onSuccess: () => {
          form.reset();
          setValue("");
        },
      },
    );
  };

  const { root, form, fields, inline, textarea } = styles;
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <section className={root}>
        <Form.Root className={form} onSubmit={handleSubmit}>
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
                  maxLength={280}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  id="article-form-text-area-home-page"
                />
              </Form.Control>

              <Form.Message match="valueMissing">
                Content is required
              </Form.Message>
            </Form.Field>

            <div className={inline}>
              <div className={styles.rightActions}>
                <div style={{ color: value.length > 260 ? "red" : "inherit" }}>
                  {value.length}/280
                </div>
                <Form.Submit asChild>
                  <Button
                    disabled={isPending || !user}
                    color={isError ? "red" : "blue"}
                  >
                    {isPending ? "Posting..." : "Post"}
                  </Button>
                </Form.Submit>
              </div>
            </div>
            <div>
              {isError && error && (
                <Callout.Root size="1" color="red" role="alert">
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>{"Failed to publish comment"}</Callout.Text>
                </Callout.Root>
              )}
              {!user && isDirty && (
                <Callout.Root size="1" color="red" role="alert">
                  <Callout.Icon>
                    <CrossCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    {"Please log in to publish a comment."}
                  </Callout.Text>
                </Callout.Root>
              )}
            </div>
          </div>
        </Form.Root>
      </section>
    </ErrorBoundary>
  );
}
