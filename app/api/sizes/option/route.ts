import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoSizesRepository } from "@/lib/modules/catalog/sizes/sizes.repository";
import { getSizeOptions } from "@/lib/modules/catalog/sizes/sizes.services";
import { SizeOption } from "@/lib/modules/catalog/sizes/sizes.types";

export async function GET(_req: Request) {
  try {
    const array = await getSizeOptions(mongoSizesRepository);
    return NextResponse.json(
      {
        success: true,
        data: array,
      } satisfies SuccessResponse<SizeOption[]>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch size options error: ",
      "Failed to fetch size options",
    );
  }
}
