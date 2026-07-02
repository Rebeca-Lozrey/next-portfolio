import { ObjectId } from "mongodb";
import z from "zod";

import { categorySchema } from "./categories.schema";

export interface CategoryDocument {
  _id: ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
}

export type CategoryInput = z.infer<typeof categorySchema>;

export interface CategoryOption {
  name: string;
  slug: string;
}

type Domain<T> = Omit<T, "_id"> & {
  id: string;
};

export type Category = Domain<CategoryDocument>;
