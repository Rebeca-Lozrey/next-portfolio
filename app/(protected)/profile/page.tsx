import Profile from "@/components/Profile";

import styles from "./page.module.css";

export default async function ProfilePage() {
  return (
    <div className="layout">
      <aside className="sidebar-left"></aside>
      <main className="site-content">
        <section className={styles.container}>
          <Profile />
        </section>
      </main>
      <aside className="sidebar-right"></aside>
    </div>
  );
}
