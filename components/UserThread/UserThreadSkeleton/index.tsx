import { Box, Card, Flex, Skeleton } from "@radix-ui/themes";

import styles from "./UserThreadSkeleton.module.css";

function MyArticleCardSkeleton() {
  return (
    <Card className={styles.articleCard} size="1">
      <Flex direction="column" gap="3">
        <Flex justify="end">
          <Skeleton width="70px" height="12px" />
        </Flex>

        <Flex className={styles.divider}>
          <Box className={styles.imageSkeleton}>
            <Skeleton width="100%" height="100%" />
          </Box>

          <Flex direction="column" gap="1" className={styles.content}>
            <Skeleton width="100%" height="12px" />
            <Skeleton width="95%" height="12px" />
            <Skeleton width="85%" height="12px" />
          </Flex>
        </Flex>

        <Flex justify="between" align="center">
          <Skeleton width="60px" height="12px" />
          <Flex gap="3">
            <Skeleton width="45px" height="12px" />
            <Skeleton width="45px" height="12px" />
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default function UserThreadSkeleton() {
  return (
    <section className={styles.thread} aria-busy="true" aria-live="polite">
      <MyArticleCardSkeleton />
      <MyArticleCardSkeleton />
    </section>
  );
}
