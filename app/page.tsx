import HomePage from "@/components/page/home";
import { getArticles, sortByPublishedAtDesc } from "@/lib/api";

export default async function Page() {
  let latestArticles: any[] = [];
  let articlesError = "";

  try {
    const articles = await getArticles();
    latestArticles = sortByPublishedAtDesc(articles as any).slice(0, 5);
  } catch (e) {
    articlesError = "Could not load articles.";
  }

  return <HomePage latestArticles={latestArticles} articlesError={articlesError} />;
}
