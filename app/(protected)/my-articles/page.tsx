import MyArticlesList from "@/components/MyArticlesList";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getMyArticles } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export default async function MyArticles() {
  const initialPage = await getMyArticles(
    mongoArticlesRepository,
    mongoLikesRepository,
    null,
  );
  return (
    <div className="layout">
      <aside className="sidebar-left"></aside>
      <main className="site-content">
        <MyArticlesList initialPage={initialPage} />
      </main>
      <aside className="sidebar-right"></aside>
    </div>
  );
}
