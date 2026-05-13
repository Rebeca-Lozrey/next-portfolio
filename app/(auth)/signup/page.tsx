import { redirect } from "next/navigation";

import SignupForm from "@/components/SignupForm";
import { getCurrentUser } from "@/lib/modules/auth/auth.service";

import styles from "./page.module.css";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/my-articles");
  }
  return (
    <section className={styles.page}>
      <SignupForm />
    </section>
  );
}
