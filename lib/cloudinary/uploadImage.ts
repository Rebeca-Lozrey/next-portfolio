export async function uploadImage(file: File) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "social_cloudinary");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dmpiaetro/image/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();

  return data.secure_url as string;
}
