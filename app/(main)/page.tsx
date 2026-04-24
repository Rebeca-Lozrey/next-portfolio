import ArticleForm from "@/components/ArticleForm";
import ArticlesListInitialPage from "@/components/ArticlesList/ArticlesListInitialPage";

export default async function Home() {
  return (
    <div className="thread">
      <ArticleForm />
      <ArticlesListInitialPage />
    </div>
  );
}
