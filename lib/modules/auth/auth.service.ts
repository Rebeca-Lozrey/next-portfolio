import { cookies } from "next/headers";

import { mongoSessionsRepository } from "@/lib/modules/sessions/sessions.repository";
import { getUserIdFromSession } from "@/lib/modules/sessions/sessions.service";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { getUserById } from "@/lib/modules/users/users.service";

import { User } from "../users/users.types";
import { SESSION_COOKIE_NAME } from "./auth.constants";

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) return null;

  const userId = await getUserIdFromSession(mongoSessionsRepository, sessionId);

  if (!userId) return null;

  return getUserById(mongoUsersRepository, userId);
}
