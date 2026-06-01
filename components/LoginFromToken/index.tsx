"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Box } from "@radix-ui/themes";
import { Text } from "@radix-ui/themes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { emailVerification } from "@/lib/modules/auth/auth.api";
import { usersKeys } from "@/lib/modules/users/users.keys";

import styles from "./LoginFromToken.module.css";

export default function LoginFromToken({ token }: { token: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const loginMutation = useMutation({
    mutationFn: emailVerification,
    onError: (err, _vars) => {
      console.error("Failed to login: ", err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.current,
      });
      router.push("/email-verified");
    },
  });

  const { data, isPending, isError } = loginMutation;

  useEffect(() => {
    loginMutation.mutate(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isPending) {
    return (
      <Box className={styles.content}>
        <Text size="3" className={styles.bio}>
          Verifying your email...
        </Text>{" "}
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box className={styles.content}>
        <Text size="3" className={styles.bio}>
          Invalid or expired token.{" "}
        </Text>{" "}
      </Box>
    );
  }

  return (
    <Box className={styles.content}>
      <Text size="3" className={styles.bio}>
        Verification successful.{" "}
      </Text>{" "}
    </Box>
  );
}
