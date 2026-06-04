import {
  CLSMetric,
  FCPMetric,
  INPMetric,
  LCPMetric,
  TTFBMetric,
  onCLS,
  onFCP,
  onINP,
  onLCP,
  onTTFB,
} from "web-vitals";

import { sendWebVital } from "../modules/webVitals/webVitals.api";

function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  const ua = userAgent.toLowerCase();

  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);

  const isTablet =
    /ipad|tablet/.test(ua) || (/android/.test(ua) && !/mobile/.test(ua));

  let deviceType: "desktop" | "mobile" | "tablet";

  if (isTablet) {
    deviceType = "tablet";
  } else if (/mobile|iphone|android/.test(ua)) {
    deviceType = "mobile";
  } else {
    deviceType = "desktop";
  }

  return {
    browser: chromeMatch ? "Chrome" : "Unknown",
    browserVersion: chromeMatch?.[1] ?? "Unknown",

    userAgent,

    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,

    deviceType,
  };
}

export function registerWebVitals() {
  const commonFields = () => ({
    url: window.location.pathname,
    ...getBrowserInfo(),
    createdAt: new Date().toISOString(),
  });

  const CLSResult = (metric: CLSMetric) => {
    void sendWebVital({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,

      ...commonFields(),

      data: {
        shifts: metric.entries.length,
        entries: metric.entries.map((entry) => ({
          value: entry.value,
          startTime: entry.startTime,
          hadRecentInput: entry.hadRecentInput,
        })),
      },
    });
  };

  onCLS(CLSResult);

  const FCPResult = (metric: FCPMetric) => {
    const paint = metric.entries[0] as PerformancePaintTiming | undefined;

    void sendWebVital({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,

      ...commonFields(),

      data: {
        paintTime: paint?.startTime,
      },
    });
  };

  onFCP(FCPResult);

  const INPResult = (metric: INPMetric) => {
    const interaction = metric.entries[0] as PerformanceEventTiming | undefined;

    void sendWebVital({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,

      ...commonFields(),

      data: {
        interactionName: interaction?.name,
        duration: interaction?.duration,
        startTime: interaction?.startTime,
        interactionId: interaction?.interactionId,
      },
    });
  };

  onINP(INPResult);

  const LCPResult = (metric: LCPMetric) => {
    const lcp = metric.entries[0] as LargestContentfulPaint | undefined;

    void sendWebVital({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,

      ...commonFields(),

      data: {
        size: lcp?.size,
        url: lcp?.url,
        loadTime: lcp?.loadTime,
        renderTime: lcp?.renderTime,
        startTime: lcp?.startTime,
      },
    });
  };

  onLCP(LCPResult);

  const TTFBResult = (metric: TTFBMetric) => {
    const nav = metric.entries[0] as PerformanceNavigationTiming | undefined;

    void sendWebVital({
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,

      ...commonFields(),

      data: {
        requestStart: nav?.requestStart,
        responseStart: nav?.responseStart,
        responseEnd: nav?.responseEnd,
        domInteractive: nav?.domInteractive,
        domComplete: nav?.domComplete,
        responseStatus: nav?.responseStatus,
        transferSize: nav?.transferSize,
        encodedBodySize: nav?.encodedBodySize,
        decodedBodySize: nav?.decodedBodySize,
        nextHopProtocol: nav?.nextHopProtocol,
      },
    });
  };

  onTTFB(TTFBResult);
}
