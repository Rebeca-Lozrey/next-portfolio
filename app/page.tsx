import ArticleForm from "@/components/ArticleForm/ArticleForm";

export default function Home() {
  return (
    <>
      <div className="thread">
        <section>
          <ArticleForm />
        </section>
        <section>
          <h1>About this website</h1>

          <p>Discover features with next speed.</p>
        </section>
      </div>
    </>
  );
}
