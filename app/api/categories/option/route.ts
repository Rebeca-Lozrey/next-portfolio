import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoCategoriesRepository } from "@/lib/modules/catalog/categories/categories.repository";
import { getCategoryOptions } from "@/lib/modules/catalog/categories/categories.services";
import { CategoryOption } from "@/lib/modules/catalog/categories/categories.types";

export async function GET(_req: Request) {
  try {
    const array = await getCategoryOptions(mongoCategoriesRepository);
    return NextResponse.json(
      {
        success: true,
        data: array,
      } satisfies SuccessResponse<CategoryOption[]>,
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
