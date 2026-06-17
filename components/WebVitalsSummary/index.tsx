"use client";
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getWebVitalsSummary } from "@/lib/modules/webVitals/webVitals.api";
import { webVitalsKeys } from "@/lib/modules/webVitals/webVitals.keys";
import { WebVitalsSummary as WebVitalsSummaryType } from "@/lib/modules/webVitals/webVitals.types";

import UrlFilter from "./UrlFilter";
import WebVitalCard from "./WebVitalCard";
import WebVitalsSlider from "./WebVitalsSider";
import styles from "./WebVitalsSummary.module.css";

export default function WebVitalsSummary() {
  const [range] = useState(() => {
    const now = Date.now();

    return {
      min: now - 30 * 24 * 60 * 60 * 1000,
      max: now,
      initial: [now - 7 * 24 * 60 * 60 * 1000, now],
    };
  });

  const [dateRange, setDateRange] = useState<number[]>(range.initial);
  const [url, setUrl] = useState<string | undefined>(undefined);

  const webVitalsSummaryQuery = useQuery({
    queryKey: webVitalsKeys.summary(dateRange[0], dateRange[1], url),
    queryFn: () =>
      getWebVitalsSummary(new Date(dateRange[0]), new Date(dateRange[1]), url),
  });

  type MetricName = WebVitalsSummaryType["_id"];

  const metrics: {
    _id: MetricName;
    title: string;
  }[] = [
    { _id: "CLS", title: "CLS" },
    { _id: "LCP", title: "LCP" },
    { _id: "INP", title: "INP" },
    { _id: "FCP", title: "FCP" },
    { _id: "TTFB", title: "TTFB" },
  ];
  const { data, isPending, isError } = webVitalsSummaryQuery;

  const summaries = data
    ? Object.fromEntries(data.map((summary) => [summary._id, summary]))
    : undefined;

  const handleOnValueChange = (value: string) => {
    const url = value === "select-all" ? undefined : value;
    setUrl(url);
  };

  return (
    <div className={styles.layout}>
      <h2 className={styles.title}>Metric Summary</h2>
      <UrlFilter
        value={url ? url : "select-all"}
        onValueChange={handleOnValueChange}
      />
      <WebVitalsSlider
        value={dateRange}
        setValue={setDateRange}
        min={range.min}
        max={range.max}
      />
      <div className={styles.cards}>
        {metrics.map((metric) => (
          <WebVitalCard
            key={metric._id}
            title={metric._id}
            summary={summaries ? summaries[metric._id] : undefined}
            isPending={isPending}
            isError={isError}
          />
        ))}
      </div>
    </div>
  );
}
