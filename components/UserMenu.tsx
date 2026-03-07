import { DropdownMenu, Button, Avatar } from "@radix-ui/themes";
import Link from "next/link";

export default function UserMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost">
          <Avatar fallback="U" radius="full" size="2" />
        </Button>
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
