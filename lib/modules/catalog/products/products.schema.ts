import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(3, "Name must be at least 3 characters"),

  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug may only contain lowercase letters, numbers, and hyphens",
    ),

  itemTypeSlug: z.string().min(1, "Item type is required"),

  brandSlug: z.string().min(1, "Brand is required"),

  categorySlug: z.string().min(1, "Category is required"),

  audienceSlug: z.string().min(1, "Audience is required"),

  tags: z
    .array(
      z.object({
        value: z.string().min(1, "Value is required"),
      }),
    )
    .min(1, "At least one tag is required"),

  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .min(1, "At least one specification is required"),

  variants: z
    .array(
      z.object({
        sku: z.string().min(1, "Sku is required"),
        price: z.number().min(0, "Price is required. Expected positive number"),
        stock: z.number().min(0, "Stock is required. Expected positive number"),
        attributes: z.object({
          sizeSlug: z.string().min(1, "Size is required"),
          colorSlug: z.string().min(1, "Color is required"),
        }),
      }),
    )
    .min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
