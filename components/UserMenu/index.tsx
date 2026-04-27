"use client";

import Link from "next/link";

import { PersonIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import { useUser } from "@/providers/UserProvider";

import LogoutButton from "./LogoutButton";
import styles from "./UserMenu.module.css";

function UserMenuRaw() {
  const user = useUser();
  const isAuthenticated = !!user;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton
          id="user-menu-trigger-top-bar"
          aria-label="Toggle user menu open or close"
          color="gray"
          variant="outline"
          highContrast
          size="2"
        >
          <PersonIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end">
        {isAuthenticated ? (
          <>
            <DropdownMenu.Label>
              <Text size="2">{user.username}</Text>
            </DropdownMenu.Label>

            <DropdownMenu.Item asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link href="/my-articles">My Articles</Link>
            </DropdownMenu.Item>

            <DropdownMenu.Separator />

            <DropdownMenu.Item asChild>
              <LogoutButton />
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item asChild>
              <Link href="/login">Login</Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item asChild>
              <Link href="/signup">Sign Up</Link>
            </DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <IconButton
      color="red"
      variant="outline"
      highContrast
      onClick={resetErrorBoundary}
      title="Retry"
    >
      <PersonIcon />
    </IconButton>
  );
}

export default function UserMenu() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <UserMenuRaw />
    </ErrorBoundary>
  );
}
