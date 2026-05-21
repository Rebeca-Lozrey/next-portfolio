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
  return <MyArticlesList initialPage={initialPage} />;
}
