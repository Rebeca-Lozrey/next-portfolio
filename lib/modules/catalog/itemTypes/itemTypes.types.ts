import { ObjectId } from "mongodb";
import z from "zod";

import { itemTypeSchema } from "./itemTypes.schema";

export interface ItemTypeDocument {
  _id: ObjectId;
  name: string;
  slug: string;
  sizeGroup: string;
  createdAt: Date;
}

export type ItemTypeInput = z.infer<typeof itemTypeSchema>;

export interface ItemTypeOption {
  name: string;
  slug: string;
}

type Domain<T> = Omit<T, "_id"> & {
  id: string;
};

export type ItemType = Domain<ItemTypeDocument>;
