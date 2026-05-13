import { NextResponse } from "next/server";

import { clearCurrentUser } from "@/lib/modules/auth/auth.service";

export async function POST(_: Request) {
  try {
    await clearCurrentUser();

    return NextResponse.json({
      message: "Logged out",
      error: null,
      user: null,
    });
  } catch (error) {
    if (error instanceof Error) {
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
}
