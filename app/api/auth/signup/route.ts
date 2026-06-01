import { NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { toPublicUser } from "@/lib/modules/users/users.mapper";
import { mongoUsersRepository } from "@/lib/modules/users/users.repository";
import { createUserSchema } from "@/lib/modules/users/users.schema";
import { createUser } from "@/lib/modules/users/users.service";
import { PublicUser } from "@/lib/modules/users/users.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createUserSchema.safeParse(body);

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

    const user = await createUser(mongoUsersRepository, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: toPublicUser(user),
      } satisfies SuccessResponse<PublicUser>,
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error, "Signup error: ", "Failed to sign up");
  }
}
