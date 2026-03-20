import { createUserAction } from "@/actions/createUserAction";
import SignupForm from "@/components/SignupForm";

import styles from "./signup.module.css";

export default function SignupPage() {
  return (
    <section className={styles.page}>
      <SignupForm action={createUserAction} />
    </section>
  );
}
