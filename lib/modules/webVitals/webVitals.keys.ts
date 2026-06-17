export const webVitalsKeys = {
  summary: (from: number, to: number, url: string | undefined) =>
    ["webVitals", "summary", from, to, url] as const,
};
