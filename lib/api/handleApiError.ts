import { NextResponse } from "next/server";

import { ConflictError, NotFoundError, UnauthorizedError } from "./api.errors";
import { ErrorResponse } from "./api.types";

export function handleApiError(
  error: unknown,
  serverMessage: string,
  clientMessage: string,
) {
  console.error(serverMessage, error);

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      } satisfies ErrorResponse,
      { status: 401 },
    );
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      } satisfies ErrorResponse,
      { status: 404 },
    );
  }

  if (error instanceof ConflictError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      } satisfies ErrorResponse,
      { status: 409 },
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      } satisfies ErrorResponse,
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: clientMessage,
    } satisfies ErrorResponse,
    { status: 500 },
  );
}
