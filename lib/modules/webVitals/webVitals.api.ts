import { apiFetch } from "@/lib/api/apiFetch";

import { CreateWebVitalsInput } from "./webVitals.types";

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
