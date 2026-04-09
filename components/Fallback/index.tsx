import { Button } from "@radix-ui/themes";
import { FallbackProps } from "react-error-boundary";

import styles from "./Fallback.module.css";

export default function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={styles.container}>
      <div className={styles.message}>Something went wrong.</div>

      <Button
        color="red"
        variant="outline"
        highContrast
        onClick={resetErrorBoundary}
        title="Retry"
      >
        Try again
      </Button>
    </div>
  );
}
