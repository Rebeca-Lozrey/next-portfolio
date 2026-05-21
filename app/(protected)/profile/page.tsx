import Profile from "@/components/Profile";

import styles from "./page.module.css";

export default async function ProfilePage() {
  return (
    <section className={styles.container}>
      <Profile />
    </section>
  );
}
