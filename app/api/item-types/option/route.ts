import { NextResponse } from "next/server";

import { SuccessResponse } from "@/lib/api/api.types";
import { handleApiError } from "@/lib/api/handleApiError";
import { mongoItemTypesRepository } from "@/lib/modules/catalog/itemTypes/itemTypes.repository";
import { getItemTypeOptions } from "@/lib/modules/catalog/itemTypes/itemTypes.services";
import { ItemTypeOption } from "@/lib/modules/catalog/itemTypes/itemTypes.types";

export async function GET(_req: Request) {
  try {
    const array = await getItemTypeOptions(mongoItemTypesRepository);
    return NextResponse.json(
      {
        success: true,
        data: array,
      } satisfies SuccessResponse<ItemTypeOption[]>,
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(
      error,
      "Fetch item types options error: ",
      "Failed to fetch item types options",
    );
  }
}
