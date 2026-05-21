"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";

import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className={styles.container}>
      <Card size="3" className={styles.card}>
        <Flex align="center" gap="4" className={styles.header}>
          <Avatar
            fallback="!"
            size="4"
            radius="full"
            className={styles.avatar}
          />

          <Box>
            <Heading size="4" className={styles.title}>
              Something went wrong
            </Heading>
            <Text size="2" className={styles.subtitle}>
              We couldn’t load the page
            </Text>
          </Box>
        </Flex>

        <Box className={styles.content}>
          <Text size="3" className={styles.message}>
            Please try again. If the problem persists, you may need to refresh
            the page.
          </Text>

          <Button onClick={() => reset()} className={styles.button}>
            Try again
          </Button>
        </Box>
      </Card>
    </section>
  );
}
