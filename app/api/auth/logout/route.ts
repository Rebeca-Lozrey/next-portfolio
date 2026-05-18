import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { clearCurrentUser } from "@/lib/modules/auth/auth.service";

export async function POST(_: Request) {
  try {
    await clearCurrentUser();

    return NextResponse.json(
      {
        success: true,
        data: null,
      } satisfies SuccessResponse<null>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error, "Logout error: ", "Failed to log out");
  }
}
