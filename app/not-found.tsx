"use client";

import Link from "next/link";

import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.container}>
      <Card size="3" className={styles.card}>
        <Flex align="center" gap="4" className={styles.header}>
          <Avatar
            fallback="?"
            size="4"
            radius="full"
            className={styles.avatar}
          />

          <Box>
            <Heading size="4" className={styles.title}>
              Page not found
            </Heading>
            <Text size="2" className={styles.subtitle}>
              The page you’re looking for doesn’t exist
            </Text>
          </Box>
        </Flex>

        <Box className={styles.content}>
          <Text size="3" className={styles.message}>
            It may have been removed, renamed, or the URL might be incorrect.
          </Text>

          <Button
            asChild
            variant="outline"
            highContrast
            className={styles.button}
          >
            <Link href="/">Go back home</Link>
          </Button>
        </Box>
      </Card>
    </section>
  );
}
