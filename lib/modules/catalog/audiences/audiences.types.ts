import { ObjectId } from "mongodb";
import z from "zod";

import { audienceSchema } from "./audiences.schema";

export interface AudienceDocument {
  _id: ObjectId;
  name: string;
  slug: string;
  createdAt: Date;
}

export type AudienceInput = z.infer<typeof audienceSchema>;

export interface AudienceOption {
  name: string;
  slug: string;
}

type Domain<T> = Omit<T, "_id"> & {
  id: string;
};

export type Audience = Domain<AudienceDocument>;
