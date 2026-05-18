import { cookies } from "next/headers";

import { UnauthorizedError } from "@/lib/api/api.errors";
import { mongoSessionsRepository } from "@/lib/modules/sessions/sessions.repository";
import {
  createSession,
  deleteSession,
  getUserIdFromSession,
} from "@/lib/modules/sessions/sessions.service";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { getUserById } from "@/lib/modules/users/users.service";

import { User } from "../users/users.types";
import { SESSION_COOKIE_NAME } from "./auth.constants";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const userId = await getUserIdFromSession(mongoSessionsRepository, sessionId);

  if (!userId) {
    return null;
  }

  return getUserById(mongoUsersRepository, userId);
}

export async function authenticateUser(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError("Unauthorized");
  }

  return user;
}

export async function setCurrentUser(userId: string): Promise<string> {
  const sessionId = await createSession(mongoSessionsRepository, userId);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return sessionId;
}

export async function clearCurrentUser(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await deleteSession(mongoSessionsRepository, sessionId);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
