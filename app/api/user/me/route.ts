import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/modules/auth/auth.service";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { updateUserSchema } from "@/lib/modules/users/users.schema";
import { updateUser } from "@/lib/modules/users/users.service";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
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

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: null,
          error: "Unauthorized",
          user: null,
        },
        {
          status: 401,
        },
      );
    }

    const updatedUser = await updateUser(
      mongoUsersRepository,
      user.id,
      parsed.data,
    );

    return NextResponse.json(
      { message: "User updated", error: null, user: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update user error", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: null,
          error: error.message,
          user: null,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          message: null,
          error: "Unexpected Error",
          user: null,
        },
        { status: 500 },
      );
    }
  }
}

export async function GET(_: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: null,
          error: "Unauthorized",
          user: null,
        },
        {
          status: 401,
        },
      );
    }

    return NextResponse.json(
      { message: "User retrieved", error: null, user },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update user error", error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: null,
          error: error.message,
          user: null,
        },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        {
          message: null,
          error: "Unexpected Error",
          user: null,
        },
        { status: 500 },
      );
    }
  }
}
