import { registerAction } from "@/actions/registerAction";
import SignupForm from "@/components/SignupForm";

import styles from "./page.module.css";

export default function SignupPage() {
  return (
    <section className={styles.page}>
      <SignupForm action={registerAction} />
    </section>
  );
}
