import { SessionsRepository } from "./sessions.repository";

export async function createSession(
  repo: SessionsRepository,
  userId: string,
): Promise<string> {
  const sessionId = await repo.insert({
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
  return sessionId;
}

export async function getUserIdFromSession(
  repo: SessionsRepository,
  sessionId: string,
) {
  const session = await repo.findById(sessionId);

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session.userId;
}

export async function deleteSession(
  repo: SessionsRepository,
  sessionId: string,
): Promise<void> {
  await repo.deleteById(sessionId);
}
