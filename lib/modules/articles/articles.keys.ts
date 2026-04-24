export const articlesKeys = {
  all: ["articles"] as const,
  myArticles: (term: string | null) =>
    ["articles", "myArticles", term] as const,
};
