import NextLink from "next/link";

import { Box, Card, Heading, Link, Text } from "@radix-ui/themes";

import { AutoRedirect } from "@/components/AutoRedirect/page";

import styles from "./page.module.css";

export default async function EmailVerifiedPage() {
  return (
    <section className={styles.container}>
      <Card size="3" className={styles.card}>
        <Box>
          <Heading size="4" className={styles.title}>
            Email Verification
          </Heading>
        </Box>
        <Box className={styles.content}>
          <Text size="3" className={styles.bio}>
            Email verified successfully.{" "}
          </Text>
          <Link asChild>
            <NextLink className={styles.link} href="/my-articles">
              Go to My Articles
            </NextLink>
          </Link>
        </Box>
      </Card>
      <AutoRedirect path="/my-articles" />
    </section>
  );
}
