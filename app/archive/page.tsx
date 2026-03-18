import ArchivePage from "@/components/page/archive";
import { getArticles, getResearch, sortByPublishedAtDesc } from "@/lib/api";

export default async function Page() {
  let articles: any[] = [];
  let research: any[] = [];
  let archiveError = "";

  try {
    const [articleItems, researchItems] = await Promise.all([getArticles(), getResearch()]);
    articles = sortByPublishedAtDesc(articleItems as any);
    research = sortByPublishedAtDesc(researchItems as any);
  } catch (error) {
    archiveError = "Could not load archive content right now.";
  }

  return <ArchivePage articles={articles} research={research} loading={false} error={archiveError} />;
}
