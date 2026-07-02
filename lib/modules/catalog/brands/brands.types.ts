import { ObjectId } from "mongodb";
import z from "zod";

import { brandSchema } from "./brands.schema";

export interface BrandDocument {
  _id: ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
}

export type BrandInput = z.infer<typeof brandSchema>;

export interface BrandOption {
  name: string;
  slug: string;
}

type Domain<T> = Omit<T, "_id"> & {
  id: string;
};

export type Brand = Domain<BrandDocument>;
