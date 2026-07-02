import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoBrandsRepository } from "@/lib/modules/catalog/brands/brands.repository";
import { getBrandOptions } from "@/lib/modules/catalog/brands/brands.services";
import { BrandOption } from "@/lib/modules/catalog/brands/brands.types";

export async function GET(_req: Request) {
  try {
    const array = await getBrandOptions(mongoBrandsRepository);
    return NextResponse.json(
      {
        success: true,
        data: array,
      } satisfies SuccessResponse<BrandOption[]>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch brand options error: ",
      "Failed to fetch brand options",
    );
  }
}
