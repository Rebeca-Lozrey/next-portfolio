import { use } from "react";

import UserThread from "@/components/UserThread";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getMyArticlesPage } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export default function UserThreadInitialPage() {
  const initialPage = use(
    getMyArticlesPage(mongoArticlesRepository, mongoLikesRepository, null),
  );

  return <UserThread initialPage={initialPage} />;
}
