import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoWebVitalsRepository } from "@/lib/modules/webVitals/webVital.repository";
import { getWebVitalsSummary } from "@/lib/modules/webVitals/webVitals.service";
import { WebVitalsSummary } from "@/lib/modules/webVitals/webVitals.types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const url = searchParams.get("url");

    const fromDate = new Date(from!);
    const ToDate = new Date(to!);

    const summary = await getWebVitalsSummary(
      mongoWebVitalsRepository,
      fromDate,
      ToDate,
      url || undefined,
    );

    return NextResponse.json(
      {
        success: true,
        data: summary,
      } satisfies SuccessResponse<WebVitalsSummary[]>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch webvital metrics summary error: ",
      "Failed to fetch webvital metrics summary",
    );
  }
}
