"use client";
import Link from "next/link";

import { PersonIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";

export default function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton color="gray" variant="outline" highContrast>
          <PersonIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end">
        <DropdownMenu.Item asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Item asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Separator />

        <DropdownMenu.Item asChild>
          <Link href="/login">Login</Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
