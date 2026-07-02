import { apiFetch } from "@/lib/api/apiFetch";

import { CategoryOption } from "./categories.types";

export async function getCategoryOptionsRequest(): Promise<CategoryOption[]> {
  return (await apiFetch<CategoryOption[]>("/api/categories/option")).data;
}
