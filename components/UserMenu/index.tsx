"use client";
import Link from "next/link";

import { PersonIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton, Text } from "@radix-ui/themes";

import { useUser } from "@/providers/UserProvider";

import LogoutButton from "./LogoutButton";

export default function UserMenu() {
  const user = useUser();
  const isAuthenticated = !!user;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton color="gray" variant="outline" highContrast>
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
