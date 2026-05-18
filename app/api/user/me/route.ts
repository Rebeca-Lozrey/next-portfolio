import { NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import {
  authenticateUser,
  getCurrentUser,
} from "@/lib/modules/auth/auth.service";
import { toPublicUser } from "@/lib/modules/users/users.mapper";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { updateUserSchema } from "@/lib/modules/users/users.schema";
import { updateUser } from "@/lib/modules/users/users.service";
import { PublicUser } from "@/lib/modules/users/users.types";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
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

    const user = await authenticateUser();

    const updatedUser = await updateUser(
      mongoUsersRepository,
      user.id,
      parsed.data,
    );

    return NextResponse.json(
      {
        success: true,
        data: toPublicUser(updatedUser),
      } satisfies SuccessResponse<PublicUser>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "Update user error: ", "Failed updating user");
  }
}

export async function GET(_: Request) {
  try {
    const user = await getCurrentUser();
    const publicUser = user ? toPublicUser(user) : null;

    return NextResponse.json(
      {
        success: true,
        data: publicUser,
      } satisfies SuccessResponse<PublicUser | null>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "Fetch user error: ", "Failed to fetch users");
  }
}
