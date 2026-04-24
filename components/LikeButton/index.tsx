import { IconButton } from "@radix-ui/themes";

import useLikeArticleMutation from "@/lib/modules/articles/hooks/useLikeArticleMutation";

import styles from "./LikeButton.module.css";

export default function LikeButton({
  articleId,
  likedByUser,
  term,
}: {
  articleId: string;
  likedByUser: boolean;
  term: string | null;
}) {
  const likeMutation = useLikeArticleMutation(term);
  return (
    <IconButton
      size="3"
      variant="outline"
      className="likeButton"
      onClick={() => {
        likeMutation.mutate({ articleId });
      }}
    >
      {likedByUser ? (
        <span className={styles.likedButtonLabel}>LIKED</span>
      ) : (
        <span className={styles.likeButtonLabel}>LIKE</span>
      )}
    </IconButton>
  );
}
