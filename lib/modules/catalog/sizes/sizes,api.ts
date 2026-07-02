import { apiFetch } from "@/lib/api/apiFetch";

import { SizeOption } from "./sizes.types";

export async function getSizeOptionsRequest(): Promise<SizeOption[]> {
  return (await apiFetch<SizeOption[]>("/api/sizes/option")).data;
}
