import { apiFetch } from "@/lib/api/apiFetch";

import { AudienceOption } from "./audiences.types";

export async function getAudienceOptionsRequest(): Promise<AudienceOption[]> {
  return (await apiFetch<AudienceOption[]>("/api/audiences/option")).data;
}
