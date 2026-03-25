"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAME } from "@/lib/modules/auth/auth.constants";
import { mongoSessionsRepository } from "@/lib/modules/sessions/sessions.repository";
import { deleteSession } from "@/lib/modules/sessions/sessions.service";

export async function logoutAction(
  _: {
    message: string | null;
    error: string | null;
  },
  __: FormData,
) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionId) {
      await deleteSession(mongoSessionsRepository, sessionId);
    }

    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return {
        message: null,
        error: error.message,
      };
    } else {
      console.error("Unknown error:", error);
      return {
        message: null,
        error: "Something went wrong",
      };
    }
  }
  redirect("/login");
}
