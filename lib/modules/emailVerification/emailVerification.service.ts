import crypto from "node:crypto";

import { setCurrentUser } from "../auth/auth.service";
import { mongoEmailVerificationsRepository } from "./emailVerification.repository";
import {
  EmailVerification,
  EmailVerificationDocument,
} from "./emailVerification.types";

export async function createEmailVerification(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");

  const emailVerificationInput: Omit<EmailVerificationDocument, "_id"> = {
    userId,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    createdAt: new Date(),
  };
  const id = await mongoEmailVerificationsRepository.insert(
    emailVerificationInput,
  );
  return { ...emailVerificationInput, id };
}

export async function verifyEmailToken(
  token: string,
): Promise<EmailVerification | null> {
  const doc = await mongoEmailVerificationsRepository.findByToken(token);
  if (!doc) {
    return null;
  }
  if (doc.expiresAt < new Date()) {
    return null;
  }

  await setCurrentUser(doc.userId);

  await mongoEmailVerificationsRepository.deleteById(doc._id.toString());

  return {
    id: doc._id.toString(),
    userId: doc.userId,
    token: doc.token,
    expiresAt: doc.expiresAt,
    createdAt: doc.createdAt,
  };
}
