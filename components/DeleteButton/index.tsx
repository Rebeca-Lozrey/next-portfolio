import { Button } from "@radix-ui/themes";

import useDeleteArticleMutation from "@/lib/modules/articles/hooks/useDeleteArticleMutation";

import styles from "./DeleteButton.module.css";

export default function DeleteButton({
  articleId,
  term,
}: {
  articleId: string;
  term: string | null;
}) {
  const deleteMutation = useDeleteArticleMutation(term);
  return (
    <Button
      size="3"
      variant="outline"
      className="deleteButton"
      onClick={() => {
        deleteMutation.mutate(articleId);
      }}
    >
      <span className={styles.deleteButtonLabel}>DELETE</span>
    </Button>
  );
}
