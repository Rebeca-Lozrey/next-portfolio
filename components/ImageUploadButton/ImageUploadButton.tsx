"use client";

import { useRef } from "react";

import Image from "next/image";

import { CrossCircledIcon, ImageIcon } from "@radix-ui/react-icons";
import { IconButton, Spinner } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";

import { uploadImage } from "@/lib/cloudinary/uploadImage";

import styles from "./ImageUploadButton.module.css";

interface ImageUploadButton {
  setUploaded: React.Dispatch<React.SetStateAction<string | null>>;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  preview: string | null;
}

export default function ImageUploadButton({
  setUploaded,
  setPreview,
  preview,
}: ImageUploadButton) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (url) => {
      setUploaded(url);
    },
  });

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    uploadMutation.mutate(file, {
      onSuccess: () => {
        input.value = ""; // reset image field
      },
    });
  };

  const { imageUploadButton, previewImage } = styles;
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
      <div className={imageUploadButton}>
        <IconButton
          color="gray"
          variant="outline"
          highContrast
          onClick={handleClick}
          type="button"
          aria-label="Upload image"
        >
          {uploadMutation.isPending ? (
            <Spinner size="2" />
          ) : !!uploadMutation.error ? (
            <CrossCircledIcon />
          ) : (
            <ImageIcon />
          )}
        </IconButton>
        {preview && (
          <Image
            className={previewImage}
            src={preview}
            alt="preview"
            width={30}
            height={30}
          />
        )}
      </div>
    </>
  );
}
