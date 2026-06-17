import { apiFetch } from "@/lib/api/apiFetch";

import { CreateWebVitalsInput, WebVitalsSummary } from "./webVitals.types";

export async function sendWebVital(payload: CreateWebVitalsInput) {
  const result = await apiFetch<CreateWebVitalsInput>("/api/web-vitals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return result.data;
}

export async function getWebVitalsSummary(from: Date, to: Date, url?: string) {
  const params = new URLSearchParams({
    from: from.toISOString(),
    to: to.toISOString(),
    ...(url && { url }),
  });

  const result = await apiFetch<WebVitalsSummary[]>(
    `/api/web-vitals/summary?${params}`,
    {
      method: "GET",
    },
  );

  return result.data;
}
