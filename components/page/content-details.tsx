import { extractContentText, formatContentDate, getArticleBySlug, getResearchBySlug, isLexicalContent } from "@/lib/api";
import { ContentListState } from "../Content";
import LexicalRenderer from "../LexicalRenderer";
import Footer from "../Footer";
import { useEffect, useState } from "react";

const useContentItem = (kind: "article" | "research", slug: string, initialItem = null) => {
  const [item, setItem] = useState<any>(initialItem);
  const [loading, setLoading] = useState(!initialItem);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      const nextItem = kind === "research" ? await getResearchBySlug(slug) : await getArticleBySlug(slug);
      if (!mounted) return;
      setItem(nextItem);
      setLoading(false);
      if (!nextItem) setError("Not found.");
    };

    load();
    return () => {
      mounted = false;
    };
  }, [kind, slug]);

  return { item, loading, error };
};

const ContentDetailPage = ({
  kind,
  slug,
  setPage,
  initialItem,
}: {
  kind: "article" | "research";
  slug: string;
  setPage: (page: string) => void;
  initialItem?: any;
}) => {
  const { item, loading, error } = useContentItem(kind, slug, initialItem);
  const contentBlocks = extractContentText(item?.content);

  return (
    <div>
      <div className="page-wrap section section-stack-md">
        <button className="link-arrow" onClick={() => setPage("archive")} style={{ marginBottom: 0 }}>
          ← Back to Research
        </button>
        {loading && !item ? (
          <ContentListState loading={true} error="" emptyText="" />
        ) : error || !item ? (
          <ContentListState loading={false} error={error || "Not found."} emptyText="Not found." />
        ) : (
          <>
            <div className="section-heading-tight">
              <div className="path-badge">
                /root/{kind}/{item.slug}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span className="topic-pill" style={kind === "research" ? { background: "#EAF0F6" } : {}}>
                  {kind === "research" ? "Research" : "Article"}
                </span>
                {kind === "research" && item.tag && <span className="ftag">{item.tag}</span>}
                <span style={{ fontSize: 13, color: "#6B6B7A", fontFamily: "'Space Mono',monospace" }}>
                  {formatContentDate(item.publishedAt)?.toString()}
                </span>
              </div>
            </div>
            <div>
              {isLexicalContent(item?.content) ? (
                <LexicalRenderer content={item.content} />
              ) : contentBlocks.length > 0 ? (
                contentBlocks.map((block, index) => (
                  <p
                    key={index}
                    style={{ fontSize: 16, lineHeight: 1.8, color: "#1C1C27", marginBottom: index === contentBlocks.length - 1 ? 0 : 18 }}
                  >
                    {block}
                  </p>
                ))
              ) : (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 12,
                    color: "#6B6B7A",
                    margin: 0,
                  }}
                >
                  {JSON.stringify(item.content, null, 2)}
                </pre>
              )}
            </div>
          </>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

export default ContentDetailPage;
