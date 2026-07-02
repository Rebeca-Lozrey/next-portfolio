import { apiFetch } from "@/lib/api/apiFetch";

import { ItemTypeOption } from "./itemTypes.types";

export async function getItemTypeOptionsRequest(): Promise<ItemTypeOption[]> {
  return (await apiFetch<ItemTypeOption[]>("/api/item-types/option")).data;
}
