import { ObjectId, OptionalId } from "mongodb";

import { getCollection } from "@/lib/mongodb";

import { Session, SessionDocument } from "./sessions.types";

const COLLECTION_NAME = "sessions";

export interface SessionsRepository {
  insert(session: Omit<Session, "id">): Promise<string>;
  findById(id: string): Promise<Session | null>;
  deleteById(id: string): Promise<void>;
}

export const mongoSessionsRepository: SessionsRepository = {
  async insert(session) {
    const collection =
      await getCollection<OptionalId<SessionDocument>>(COLLECTION_NAME);
    const result = await collection.insertOne(session);
    return result.insertedId.toString();
  },
  async findById(id) {
    const collection = await getCollection<SessionDocument>(COLLECTION_NAME);
    const doc = await collection.findOne({ _id: new ObjectId(id) });

    if (!doc) return null;

    return mapToSession(doc);
  },
  async deleteById(id) {
    const collection = await getCollection<SessionDocument>(COLLECTION_NAME);
    await collection.deleteOne({
      _id: new ObjectId(id),
    });
  },
};

function mapToSession(doc: SessionDocument): Session {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    expiresAt: doc.expiresAt,
  };
}
