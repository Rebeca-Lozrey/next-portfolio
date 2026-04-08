import { Suspense } from "react";

import UserThreadInitialPage from "@/components/UserThread/UserThreadInitialPage";
import UserThreadSkeleton from "@/components/UserThread/UserThreadSkeleton";

export default async function MyArticles() {
  return (
    <Suspense fallback={<UserThreadSkeleton />}>
      <UserThreadInitialPage />
    </Suspense>
  );
}
