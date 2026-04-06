import UserThread from "@/components/UserThread";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getMyArticlesPage } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export default async function MyArticles() {
  const initialPage = await getMyArticlesPage(
    mongoArticlesRepository,
    mongoLikesRepository,
    null,
  );

  return (
    <>
      <UserThread initialPage={initialPage} />
    </>
  );
}
