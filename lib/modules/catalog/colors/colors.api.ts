import { apiFetch } from "@/lib/api/apiFetch";

import { ColorOption } from "./colors.types";

export async function getColorOptionsRequest(): Promise<ColorOption[]> {
  return (await apiFetch<ColorOption[]>("/api/colors/option")).data;
}
