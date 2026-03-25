"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

import { SESSION_COOKIE_NAME } from "@/lib/modules/auth/auth.constants";
import { mongoSessionsRepository } from "@/lib/modules/sessions/sessions.repository";
import { createSession } from "@/lib/modules/sessions/sessions.service";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { createUserSchema } from "@/lib/modules/users/users.schema";
import { createUser } from "@/lib/modules/users/users.service";

export async function registerAction(
  _: {
    message: string | null;
    error: string | null;
  },
  formData: FormData,
) {
  try {
    const raw = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const parsed = createUserSchema.parse(raw);

    const userId = await createUser(mongoUsersRepository, parsed);

    const sessionId = await createSession(mongoSessionsRepository, userId);

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => issue.message).join(", ");
      console.error(issues);
      return {
        message: null,
        error: issues,
      };
    } else if (error instanceof Error) {
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
  redirect("/profile");
}
