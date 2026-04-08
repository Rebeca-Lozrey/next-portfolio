"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { z } from "zod";

import { SESSION_COOKIE_NAME } from "@/lib/modules/auth/auth.constants";
import { loginSchema } from "@/lib/modules/auth/auth.schema";
import { verifyPassword } from "@/lib/modules/auth/password";
import { mongoSessionsRepository } from "@/lib/modules/sessions/sessions.repository";
import { createSession } from "@/lib/modules/sessions/sessions.service";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { getUserByEmail } from "@/lib/modules/users/users.service";

export async function loginAction(
  _: {
    message: string | null;
    error: string | null;
  },
  formData: FormData,
) {
  try {
    const raw = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsed = loginSchema.parse(raw);

    const user = await getUserByEmail(mongoUsersRepository, parsed.email);

    if (!user) {
      return {
        message: null,
        error: "Invalid email or password",
      };
    }

    const isValid = await verifyPassword(parsed.password, user.passwordHash);

    if (!isValid) {
      return {
        message: null,
        error: "Invalid email or password",
      };
    }

    const sessionId = await createSession(mongoSessionsRepository, user.id);

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
