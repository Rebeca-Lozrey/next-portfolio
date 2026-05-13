"use client";

import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";

import AvatarUploadButton from "@/components/AvatarUploadButton";
import { fetchCurrentUser } from "@/lib/modules/users/users.api";
import { usersKeys } from "@/lib/modules/users/users.keys";

import styles from "./Profile.module.css";

export default function Profile() {
  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: usersKeys.current,
    queryFn: () => fetchCurrentUser(),
  });

  if (isError || isPending || !user) {
    return null;
  }

  return (
    <>
      <Card size="3" className={styles.card}>
        <Flex align="center" gap="4" className={styles.header}>
          <AvatarUploadButton user={user} />

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
    </>
  );
}
