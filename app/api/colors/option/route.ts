import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoColorsRepository } from "@/lib/modules/catalog/colors/colors.repository";
import { getColorOptions } from "@/lib/modules/catalog/colors/colors.services";
import { ColorOption } from "@/lib/modules/catalog/colors/colors.types";

export async function GET(_req: Request) {
  try {
    const array = await getColorOptions(mongoColorsRepository);
    return NextResponse.json(
      {
        success: true,
        data: array,
      } satisfies SuccessResponse<ColorOption[]>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch category options error: ",
      "Failed to fetch category options",
    );
  }
}
