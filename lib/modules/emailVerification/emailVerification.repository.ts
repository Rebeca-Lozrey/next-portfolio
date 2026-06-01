import { DeleteResult, ObjectId, OptionalId } from "mongodb";
import { id } from "zod/locales";

import { getCollection } from "@/lib/mongodb/mongodb";

import { EmailVerificationDocument } from "./emailVerification.types";

export interface EmailVerificationsRepository {
  insert(document: Omit<EmailVerificationDocument, "_id">): Promise<string>;
  findByToken(token: string): Promise<EmailVerificationDocument | null>;
  deleteById(id: string): Promise<boolean>;
}

const COLLECTION_NAME = "email-verifications";

export const mongoEmailVerificationsRepository: EmailVerificationsRepository = {
  async insert(document) {
    const collection =
      await getCollection<OptionalId<EmailVerificationDocument>>(
        COLLECTION_NAME,
      );
    const result = await collection.insertOne(document);
    return result.insertedId.toString();
  },
  async findByToken(token) {
    const collection =
      await getCollection<OptionalId<EmailVerificationDocument>>(
        COLLECTION_NAME,
      );
    return collection.findOne({ token });
  },
  async deleteById(id) {
    const collection =
      await getCollection<OptionalId<EmailVerificationDocument>>(
        COLLECTION_NAME,
      );
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });
    return result.deletedCount === 1;
  },
};
