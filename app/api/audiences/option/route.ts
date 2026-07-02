import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoAudiencesRepository } from "@/lib/modules/catalog/audiences/audiences.repository";
import { getAudienceOptions } from "@/lib/modules/catalog/audiences/audiences.services";
import { AudienceOption } from "@/lib/modules/catalog/audiences/audiences.types";

export async function GET(_req: Request) {
  try {
    const array = await getAudienceOptions(mongoAudiencesRepository);
    return NextResponse.json(
      {
        success: true,
        data: array,
      } satisfies SuccessResponse<AudienceOption[]>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch audience options error: ",
      "Failed to fetch audience options",
    );
  }
}
