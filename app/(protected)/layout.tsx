import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/modules/auth/auth.service";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  return <>{children}</>;
}
