import { apiFetch } from "@/lib/api/apiFetch";

import { BrandOption } from "./brands.types";

export async function getBrandOptionsRequest(): Promise<BrandOption[]> {
  return (await apiFetch<BrandOption[]>("/api/brands/option")).data;
}
