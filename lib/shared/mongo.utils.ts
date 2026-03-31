import { MongoServerError } from "mongodb";

export function isDuplicateKeyError(error: unknown): error is MongoServerError {
  return error instanceof MongoServerError && error.code === 11000;
}

export function getDuplicateField(error: MongoServerError): string | null {
  if (error.keyPattern) {
    return Object.keys(error.keyPattern)[0];
  }
  return null;
}
