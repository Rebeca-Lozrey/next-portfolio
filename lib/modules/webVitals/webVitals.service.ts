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
