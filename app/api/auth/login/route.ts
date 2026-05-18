import { NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { loginSchema } from "@/lib/modules/auth/auth.schema";
import { setCurrentUser } from "@/lib/modules/auth/auth.service";
import { verifyPassword } from "@/lib/modules/auth/password";
import { toPublicUser } from "@/lib/modules/users/users.mapper";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { getUserByEmail } from "@/lib/modules/users/users.service";
import { PublicUser } from "@/lib/modules/users/users.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        } satisfies ErrorResponse,
        { status: 400 },
      );
    }

    const user = await getUserByEmail(mongoUsersRepository, parsed.data.email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        } satisfies ErrorResponse,
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
          success: false,
          error: "Invalid email or password",
        } satisfies ErrorResponse,
        { status: 401 },
      );
    }

    await setCurrentUser(user.id);

    return NextResponse.json(
      {
        success: true,
        data: toPublicUser(user),
      } satisfies SuccessResponse<PublicUser>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "Login error: ", "Failed to log in");
  }
}
