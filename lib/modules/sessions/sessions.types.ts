import { ObjectId } from "mongodb";

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionDocument {
  _id: ObjectId;
  userId: string;
  expiresAt: Date;
}
