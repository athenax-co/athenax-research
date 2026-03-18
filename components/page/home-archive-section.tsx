import Link from "next/link";
import { getArticles, sortByPublishedAtDesc } from "@/lib/api";
import { ContentListState, ContentRow } from "../Content";

type Article = {
  slug: string;
  [key: string]: unknown;
};

export async function HomeArchiveSection() {
  let latestArticles: Article[] = [];
  let articlesError = "";

  try {
    const articles = await getArticles();
    latestArticles = sortByPublishedAtDesc(articles as any).slice(0, 5) as Article[];
  } catch {
    articlesError = "Could not load articles.";
  }

  return (
    <div style={{ marginTop: 72 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div className="path-badge">/root/archive</div>
          <h2 style={{ fontSize: 32 }}>The Archive</h2>
        </div>
        <Link href="/archive" className="link-arrow" style={{ display: "inline-block" }}>
          View Full Archive →
        </Link>
      </div>
      <hr className="divider" />
      {latestArticles.length > 0 ? (
        latestArticles.map((item) => (
          <div key={item.slug} style={{ cursor: "pointer", display: "block" }}>
            <Link href={`/archive/${item.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <ContentRow item={item} kind="article" />
            </Link>
          </div>
        ))
      ) : (
        <ContentListState loading={false} error={articlesError} emptyText="No published articles available yet." />
      )}
    </div>
  );
}

export function HomeArchiveSectionLoading() {
  return (
    <div style={{ marginTop: 72 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div className="path-badge">/root/archive</div>
          <h2 style={{ fontSize: 32 }}>The Archive</h2>
        </div>
        <div className="link-arrow" style={{ display: "inline-block", pointerEvents: "none" }}>
          View Full Archive →
        </div>
      </div>
      <hr className="divider" />
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#6B6B7A", marginBottom: 18 }}>
        <span className="spinner" />
        Loading latest archive...
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          style={{
            border: "2px solid #1C1C27",
            borderRadius: 12,
            background: "#fff",
            padding: "16px 18px",
            marginBottom: 12,
          }}
        >
          <div style={{ height: 16, width: `${74 - index * 8}%`, background: "#D8D4CC", borderRadius: 4, marginBottom: 10 }} />
          <div style={{ height: 12, width: `${40 + index * 8}%`, background: "#ECE9E1", borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}
