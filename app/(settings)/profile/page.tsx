import { redirect } from "next/navigation";

import { Avatar, Box, Card, Flex, Heading, Text } from "@radix-ui/themes";

import { getCurrentUser } from "@/lib/modules/auth/auth.service";

import styles from "./page.module.css";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className={styles.container}>
      <Card size="3" className={styles.card}>
        <Flex align="center" gap="4" className={styles.header}>
          <Avatar
            fallback={user.username?.[0]?.toUpperCase() || "U"}
            size="4"
            radius="full"
            className={styles.avatar}
          />

          <Box>
            <Heading size="4" className={styles.username}>
              {user.username}
            </Heading>
            <Text size="2" color="gray" className={styles.email}>
              {user.email}
            </Text>
          </Box>
        </Flex>

        <Box className={styles.content}>
          <Text size="3" className={styles.bio}>
            Welcome to your profile. This is your personal space.
          </Text>
        </Box>
      </Card>
    </section>
  );
}
