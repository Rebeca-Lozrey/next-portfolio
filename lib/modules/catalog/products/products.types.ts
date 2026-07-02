import { ObjectId } from "mongodb";
import { FieldErrors } from "react-hook-form";
import z from "zod";

import { productFormSchema } from "./products.schema";

type ProductVariant = {
  sku: string;

  price: number;

  stock: number;

  attributes: {
    sizeSlug?: string;
    colorSlug?: string;
    [key: string]: string | undefined;
  };

  images?: {
    url: string;
    alt: string;
  }[];
};

type ProductDocument = {
  _id: ObjectId;

  slug: string;

  title: string;

  description: string;

  itemTypeSlug: string;

  brandSlug: string;

  categorySlug: string;

  audienceSlug: string;

  tags: string[];

  images: {
    url: string;
    alt: string;
  }[];

  variants: ProductVariant[];

  rating: {
    average: number;
    count: number;
  };

  specifications: Record<string, string>;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
};

export type Product = Omit<ProductDocument, "_id"> & {
  id: string;
};

export type ProductFormValues = z.infer<typeof productFormSchema>;

export type ProductFormErrors = FieldErrors<ProductFormValues>;
