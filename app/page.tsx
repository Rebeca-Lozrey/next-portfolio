import ArticleForm from "@/components/ArticleForm/ArticleForm";
import ArticlesList from "@/components/ArticlesList/ArticlesList";

export default function Home() {
  return (
    <>
      <div className="thread">
        <section>
          <ArticleForm />
        </section>
        <section>
          <ArticlesList />
        </section>
      </div>
    </>
  );
}
