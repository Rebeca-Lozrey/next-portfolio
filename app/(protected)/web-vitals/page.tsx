import WebVitalsSummary from "@/components/WebVitalsSummary";

import styles from "./page.module.css";

export default async function WebVitalsPage() {
  return (
    <main className={styles.layout}>
      <section>
        <WebVitalsSummary />
      </section>
    </main>
  );
}
