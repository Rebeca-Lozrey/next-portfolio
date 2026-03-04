import { createArticleAction } from "@/actions/createArticle";

export default function CreateArticlePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Create Article</h1>

      <form action={createArticleAction}>
        <div>
          <textarea
            name="content"
            placeholder="Write something..."
            rows={5}
            required
          />
        </div>

        <div>
          <input name="imageUrl" placeholder="Optional image URL" />
        </div>

        <button type="submit">Post</button>
      </form>
    </div>
  );
}
