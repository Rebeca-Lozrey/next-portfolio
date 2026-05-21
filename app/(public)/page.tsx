import ArticleForm from "@/components/ArticleForm";
import ArticlesList from "@/components/ArticlesList";
import { mongoArticlesRepository } from "@/lib/modules/articles/articles.repository";
import { getArticles } from "@/lib/modules/articles/articles.service";
import { mongoLikesRepository } from "@/lib/modules/likes/likes.repository";

export default async function Home() {
  const initialPage = await getArticles(
    mongoArticlesRepository,
    mongoLikesRepository,
    null,
  );
  return (
    <div className="thread">
      <ArticleForm />
      <ArticlesList initialPage={initialPage} />
    </div>
  );
}
