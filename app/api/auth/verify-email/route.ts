import { NextRequest, NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { verifyEmailToken } from "@/lib/modules/emailVerification/emailVerification.service";
import { EmailVerification } from "@/lib/modules/emailVerification/emailVerification.types";

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" } satisfies ErrorResponse,
      { status: 400 },
    );
  }

  const verification = await verifyEmailToken(token);

  return NextResponse.json({
    success: true,
    data: verification,
  } satisfies SuccessResponse<EmailVerification | null>);
}
