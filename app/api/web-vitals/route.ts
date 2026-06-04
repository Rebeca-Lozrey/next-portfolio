import { NextResponse } from "next/server";

import { ErrorResponse, SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoWebVitalsRepository } from "@/lib/modules/webVitals/webVital.repository";
import { createWebVitalsSchema } from "@/lib/modules/webVitals/webVitals.schema";
import { createWebVital } from "@/lib/modules/webVitals/webVitals.service";
import { WebVital } from "@/lib/modules/webVitals/webVitals.types";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createWebVitalsSchema.safeParse(body);

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

    const webVital = await createWebVital(
      mongoWebVitalsRepository,
      parsed.data,
    );

    return NextResponse.json(
      { success: true, data: webVital } satisfies SuccessResponse<WebVital>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Toggle like error: ",
      "Failed to toggle like",
    );
  }
}
