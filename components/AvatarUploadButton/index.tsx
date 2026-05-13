"use client";

import { useRef, useState } from "react";

import { CrossCircledIcon, ImageIcon } from "@radix-ui/react-icons";
import { Avatar, Spinner } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { uploadAvatar } from "@/lib/cloudinary/uploadImage";
import { articlesKeys } from "@/lib/modules/articles/articles.keys";
import { updateUser } from "@/lib/modules/users/users.api";
import { usersKeys } from "@/lib/modules/users/users.keys";
import { UpdateUserInput, User } from "@/lib/modules/users/users.types";

import styles from "./AvatarUploadButton.module.css";

export default function AvatarUploadButton({ user }: { user: User }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [imageStatus, setImageStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");

  const queryClient = useQueryClient();

  const userMutation = useMutation({
    mutationFn: ({ avatar }: UpdateUserInput) => updateUser({ avatar }),

    onError: (_err, _vars) => {
      console.error("Failed update avatar");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.current,
      });
      queryClient.invalidateQueries({
        queryKey: articlesKeys.all,
      });
      setImageStatus("idle");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAvatar,
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    uploadMutation.mutate(file, {
      onSuccess: (url) => {
        setImageStatus("loading");

        const img = new Image();

        img.onload = () => {
          setImageStatus("loaded");

          if (user) {
            userMutation.mutate({
              avatar: url,
            });
          }
        };

        img.onerror = () => {
          setImageStatus("error");
        };

        img.src = url;
      },
    });
  };

  const { avatarUploadButton, avatarUploadIcons, imageIcon, spinnerIcon } =
    styles;
  return (
    <>
      <input
        name="image"
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <div className={avatarUploadButton}>
        <button
          type="button"
          onClick={uploadMutation.isPending ? undefined : handleClick}
          className={styles.avatarButton}
        >
          <Avatar
            src={user?.avatar || undefined}
            fallback={" "}
            size="4"
            radius="full"
            className={styles.avatar}
          />
        </button>
        <div className={avatarUploadIcons}>
          {uploadMutation.isPending ||
          userMutation.isPending ||
          imageStatus === "loading" ? (
            <Spinner className={spinnerIcon} />
          ) : !!uploadMutation.error || userMutation.error ? (
            <CrossCircledIcon className={imageIcon} />
          ) : (
            <ImageIcon className={imageIcon} />
          )}
        </div>
      </div>
    </>
  );
}
