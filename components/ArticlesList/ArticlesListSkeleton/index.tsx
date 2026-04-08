import { Box, Card, Flex, Skeleton } from "@radix-ui/themes";

import styles from "./ArticlesListSkeleton.module.css";

function ArticleCardSkeleton() {
  return (
    <Card className={styles.articleCard} size="1">
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Flex align="center" gap="2">
            <Skeleton width="28px" height="28px" className={styles.avatar} />
            <Skeleton width="90px" height="12px" />
          </Flex>
          <Skeleton width="70px" height="12px" />
        </Flex>

        <Flex direction="column" gap="2">
          <Skeleton width="100%" height="14px" />
          <Skeleton width="94%" height="14px" />
          <Skeleton width="82%" height="14px" />
        </Flex>

        <Box className={styles.imageSkeleton}>
          <Skeleton width="100%" height="100%" />
        </Box>

        <Flex justify="between" align="center">
          <Skeleton width="64px" height="12px" />
          <Flex gap="4">
            <Skeleton width="48px" height="12px" />
            <Skeleton width="48px" height="12px" />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default function MainThreadSkeleton() {
  return (
    <section className={styles.thread} aria-busy="true" aria-live="polite">
      <ArticleCardSkeleton />
      <ArticleCardSkeleton />
    </section>
  );
}
