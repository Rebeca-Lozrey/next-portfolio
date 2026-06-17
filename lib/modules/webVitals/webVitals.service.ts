import { WebVitalsRepository } from "./webVital.repository";
import { CreateWebVitalsInput, WebVital } from "./webVitals.types";

export async function createWebVital(
  webVitalRepo: WebVitalsRepository,
  input: CreateWebVitalsInput,
) {
  const webVitalInput: Omit<WebVital, "id"> = {
    ...input,
    createdAt: new Date(),
  };
  const id = await webVitalRepo.insert(webVitalInput);
  return { ...webVitalInput, id };
}

export async function getWebVitalsSummary(
  webVitalRepo: WebVitalsRepository,
  from: Date,
  to: Date,
  url?: string,
) {
  return webVitalRepo.getWebVitalsSummary(from, to, url || undefined);
}
