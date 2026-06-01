import { ObjectId } from "mongodb";

export type EmailVerificationDocument = {
  _id: ObjectId;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
};

export type EmailVerification = Omit<EmailVerificationDocument, "_id"> & {
  id: string;
};
