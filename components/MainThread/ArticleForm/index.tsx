"use client";
import { useEffect, useState } from "react";

import * as Form from "@radix-ui/react-form";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { Avatar, Button, Callout, TextArea } from "@radix-ui/themes";

import ImageUploadButton from "@/components/ImageUploadButton";
import { useCreateArticleMutation } from "@/lib/modules/articles/hooks/useCreateArticleMutation";
import { useUser } from "@/providers/UserProvider";

import styles from "./ArticleForm.module.css";

export default function ArticleForm() {
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
          <Avatar
            fallback={user?.username[0] || "U"}
            radius="full"
            size="3"
            alt="My profile photo"
          />
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
            <div className={styles.rightActions}>
              <div style={{ color: value.length > 260 ? "red" : "inherit" }}>
                {value.length}/280
              </div>
              <Form.Submit asChild>
                <Button
                  disabled={createArticleMutation.isPending || !user}
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
