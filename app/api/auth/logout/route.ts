import { NextResponse } from "next/server";

import { clearCurrentUser } from "@/lib/modules/auth/auth.service";

export async function POST(_: Request) {
  try {
    await clearCurrentUser();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      );
    } else {
      console.error("Unknown error: ", error);
      return NextResponse.json(
        {
          success: false,
          error: "Something went wrong",
        },
        { status: 500 },
      );
    }
  }
}
