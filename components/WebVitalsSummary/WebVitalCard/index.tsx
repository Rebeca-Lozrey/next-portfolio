import { WebVitalsSummary } from "@/lib/modules/webVitals/webVitals.types";

import styles from "./WebVitalCard.module.css";

export default function WebVitalCard({
  title,
  isPending,
  isError,
  summary,
}: {
  title: string;
  isPending: boolean;
  isError: boolean;
  summary?: WebVitalsSummary;
}) {
  const showValue = (property: Exclude<keyof WebVitalsSummary, "_id">) => {
    if (isError) {
      return " Error ";
    }
    if (isPending) {
      return "...";
    }
    if (!summary) {
      return "-";
    }
    if (
      property === "good" ||
      property === "needsImprovement" ||
      property === "poor"
    ) {
      return (summary[property] * 100).toFixed(1) + "%";
    }
    if (
      !(summary._id === "CLS") &&
      (property === "avgValue" ||
        property === "p75Value" ||
        property === "maxValue")
    ) {
      return summary[property] + " ms";
    }
    return summary[property];
  };

  return (
    <article className={styles.card}>
      <h3 className={styles.title}>{title}</h3>

      <dl className={styles.stats}>
        <dt>Avg</dt>
        <dd>{showValue("avgValue")}</dd>
        <dt>P75</dt>
        <dd>{showValue("p75Value")}</dd>
        <dt>Max</dt>
        <dd>{showValue("maxValue")}</dd>
        <dt>Count</dt>
        <dd>{showValue("count")}</dd>
        <dt>Good</dt>
        <dd>{showValue("good")}</dd>
        <dt>Needs Improvement</dt>
        <dd>{showValue("needsImprovement")}</dd>
        <dt>Poor</dt>
        <dd>{showValue("poor")}</dd>
      </dl>
    </article>
  );
}
