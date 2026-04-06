import MainThread from "@/components/MainThread";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getArticlesPage } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export default async function Home() {
  const initialPage = await getArticlesPage(
    mongoArticlesRepository,
    mongoLikesRepository,
    null,
  );

  return (
    <>
      <div className="thread">
        <MainThread initialPage={initialPage} />
      </div>
    </>
  );
}
