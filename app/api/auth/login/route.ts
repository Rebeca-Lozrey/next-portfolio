import { NextResponse } from "next/server";

import { z } from "zod";

import { loginSchema } from "@/lib/modules/auth/auth.schema";
import { setCurrentUser } from "@/lib/modules/auth/auth.service";
import { verifyPassword } from "@/lib/modules/auth/password";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { getUserByEmail } from "@/lib/modules/users/users.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const user = await getUserByEmail(mongoUsersRepository, parsed.data.email);

    if (!user) {
      return NextResponse.json(
        {
          message: null,
          error: "Invalid email or password",
          user: null,
        },
        { status: 401 },
      );
    }

    const isValid = await verifyPassword(
      parsed.data.password,
      user.passwordHash,
    );

    if (!isValid) {
      return NextResponse.json(
        {
          message: null,
          error: "Invalid email or password",
          user: null,
        },
        { status: 401 },
      );
    }

    await setCurrentUser(user.id);

    return NextResponse.json({
      message: "Logged in",
      error: null,
      user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: null,
          error: error.issues.map((i) => i.message).join(", "),
          user: null,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: null,
        error: "Something went wrong",
        user: null,
      },
      { status: 500 },
    );
  }
}
