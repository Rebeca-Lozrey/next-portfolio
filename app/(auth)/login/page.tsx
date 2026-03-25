import { loginAction } from "@/actions/loginAction";
import LoginForm from "@/components/LoginForm";

import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <section className={styles.page}>
      <LoginForm action={loginAction} />
    </section>
  );
}
