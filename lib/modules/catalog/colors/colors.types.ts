import { ObjectId } from "mongodb";
import z from "zod";

import { ColorSchema } from "./colors.schema";

export interface ColorDocument {
  _id: ObjectId;
  name: string;
  slug: string;
  hex: string;
  group: string;
  createdAt: Date;
}

export type ColorInput = z.infer<typeof ColorSchema>;

export interface ColorOption {
  name: string;
  slug: string;
  hex: string;
  group: string;
}

type Domain<T> = Omit<T, "_id"> & {
  id: string;
};

export type Color = Domain<ColorDocument>;
