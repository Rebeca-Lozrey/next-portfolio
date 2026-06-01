import { redirect } from "next/navigation";

import { Box, Card, Heading } from "@radix-ui/themes";

import LoginFromToken from "@/components/LoginFromToken";

import styles from "./page.module.css";

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function EmailVerificationPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/signup");
  }

  return (
    <section className={styles.container}>
      <Card size="3" className={styles.card}>
        <Box>
          <Heading size="4" className={styles.title}>
            Email Verification
          </Heading>
        </Box>
        <LoginFromToken token={token} />
      </Card>
    </section>
  );
}
