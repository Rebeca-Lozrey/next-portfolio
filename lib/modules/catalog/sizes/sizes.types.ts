import { ObjectId } from "mongodb";
import z from "zod";

import { createSizeSchema, sizeGroupSchema } from "./sizes.schema";

export const sizeGroupsArray = [
  "clothing",
  "waist",
  "shoe",
  "belt",
  "hat",
  "bra",
  "underwear",
] as const;

type SizeGroups = (typeof sizeGroupsArray)[number];

export interface SizeDocument {
  _id: ObjectId;
  name: string;
  slug: string;
  sizeGroup: SizeGroups;
  order: number;
  createdAt: Date;
}

export interface SizeOption {
  name: string;
  slug: string;
}

type Domain<T> = Omit<T, "_id"> & {
  id: string;
};

export type Size = Domain<SizeDocument>;

export type SizeGroup = z.infer<typeof sizeGroupSchema>;
export type CreateSizeRequest = z.infer<typeof createSizeSchema>;
