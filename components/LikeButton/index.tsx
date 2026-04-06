import { IconButton } from "@radix-ui/themes";

import useLikeArticleMutation from "@/lib/modules/articles/hooks/useLikeArticleMutation";

import styles from "./LikeButton.module.css";

export default function LikeButton({
  articleId,
  likedByUser,
}: {
  articleId: string;
  likedByUser: boolean;
}) {
  const likeMutation = useLikeArticleMutation();
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
