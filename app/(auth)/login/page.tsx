import { redirect } from "next/navigation";

import LoginForm from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/modules/auth/auth.service";

import styles from "./page.module.css";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/my-articles");
  }
  return (
    <section className={styles.page}>
      <LoginForm />
    </section>
  );
}
