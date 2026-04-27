"use client";
import { useEffect, useState } from "react";

import NextImage from "next/image";

import * as Form from "@radix-ui/react-form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Button, Callout, TextArea } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import ImageUploadButton from "@/components/ArticleForm/ImageUploadButton";
import { uploadImage } from "@/lib/cloudinary/uploadImage";
import { useCreateArticleMutation } from "@/lib/modules/articles/hooks/useCreateArticleMutation";
import { useUser } from "@/providers/UserProvider";

import Fallback from "../Fallback";
import styles from "./ArticleForm.module.css";

function ArticleFormRaw() {
  const [uploaded, setUploaded] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [value, setValue] = useState("");
  const user = useUser();

  useEffect(() => {
    if (!uploaded) return;

    const img = new Image();
    img.src = uploaded;
  }, [uploaded]);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (url) => {
      setUploaded(url);
    },
  });

  const createArticleMutation = useCreateArticleMutation(user, uploaded);

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
          setValue("");
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
          <div className={styles.avatarImage}>
            <NextImage
              src="https://res.cloudinary.com/dmpiaetro/image/upload/v1776984223/7b66703c-c159-4bb5-b3cb-bef5bc445668.png"
              alt="Profile Image"
              fill
              sizes="38px"
            />
          </div>
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
            <ImageUploadButton
              uploadMutation={uploadMutation}
              setPreview={setPreview}
              preview={preview}
            />
            <div className={styles.rightActions}>
              <div style={{ color: value.length > 260 ? "red" : "inherit" }}>
                {value.length}/280
              </div>
              <Form.Submit asChild>
                <Button
                  disabled={
                    createArticleMutation.isPending ||
                    !user ||
                    uploadMutation.isPending
                  }
                  color={createArticleMutation.isError ? "red" : "blue"}
                >
                  {createArticleMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </Form.Submit>
            </div>
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

export default function ArticleForm() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <ArticleFormRaw />
    </ErrorBoundary>
  );
}
