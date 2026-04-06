import styles from "./EmptyListMessage.module.css";

export default function EmptyListMessage({ message }: { message: string }) {
  return (
    <div className={styles.emptyWrapper}>
      <div className={styles.emptyCard}>
        <h3 className={styles.emptyTitle}>No articles yet</h3>
        <p className={styles.emptyText}>{message}</p>
      </div>
    </div>
  );
}
