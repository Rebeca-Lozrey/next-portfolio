import { redirect } from "next/navigation";

import { Box, Card, Heading, Text } from "@radix-ui/themes";

import styles from "./page.module.css";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  if (!email) {
    redirect("/signup");
  }

  const [name, domain] = email.split("@");

  const privateEmail = `${name.slice(0, 2)}***@${domain}`;

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
            Check your email. We’ve sent a verification link to:{" "}
            <strong>{privateEmail}</strong> Please click the link to activate
            your account. Resend email.
          </Text>
        </Box>
      </Card>
    </section>
  );
}
