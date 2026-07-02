import ProductForm from "@/components/ProductForm";

import styles from "./page.module.css";

export default async function StorePage() {
  return (
    <main className={styles.layout}>
      <section>
        <ProductForm />
      </section>
    </main>
  );
}
