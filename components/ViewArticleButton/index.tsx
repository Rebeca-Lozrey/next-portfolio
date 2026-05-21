import Link from "next/link";

import styles from "./ViewArticleButton.module.css";

export default function ViewArticleButton({
  articleId,
}: {
  articleId: string;
}) {
  return (
    <Link className={styles.viewArticle} href={`/articles/${articleId}`}>
      View article
    </Link>
  );
}
