import cloudinary from "@/lib/cloudinary/cloudinary";
import { extractPublicId } from "@/lib/cloudinary/cloudinary.utils";

import { inngest } from "../client";

export const articleDeleted = inngest.createFunction(
  {
    id: "article-deleted",
    triggers: [{ event: "article.deleted" }],
  },
  async ({ event, step }) => {
    console.warn("Ingest Event: article-deleted, Data:  ", event.data);

    const publicId = await step.run("extract-public-id", async () => {
      if (!event.data.imageUrl) {
        return null;
      }

      return extractPublicId(event.data.imageUrl);
    });

    if (!publicId) {
      return {
        success: false,
        reason: "No public ID",
      };
    }

    const result = await step.run("delete-cloudinary-image", async () => {
      return await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      });
    });

    return {
      success: true,
      result,
    };
  },
);
