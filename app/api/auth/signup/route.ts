import { NextResponse } from "next/server";

import { z } from "zod";

import { setCurrentUser } from "@/lib/modules/auth/auth.service";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { createUserSchema } from "@/lib/modules/users/users.schema";
import { createUser } from "@/lib/modules/users/users.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createUserSchema.safeParse(body);

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

    const userId = await createUser(mongoUsersRepository, parsed.data);

    await setCurrentUser(userId);

    return NextResponse.json({
      message: "Signed up",
      error: null,
      user: { ...parsed.data, id: userId },
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
