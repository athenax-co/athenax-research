import Link from "next/link";
import { extractContentText, formatContentDate, isLexicalContent } from "@/lib/api";
import { ContentListState } from "../Content";
import LexicalRenderer from "../LexicalRenderer";

const ContentDetailPage = ({ kind, item, slug }: { kind: "article" | "research"; item: any | null; slug: string }) => {
  const contentBlocks = extractContentText(item?.content);

  return (
    <div>
      <div className="page-wrap section section-stack-md">
        <Link href="/archive" className="link-arrow" style={{ marginBottom: 0 }}>
          ← Back to Research
        </Link>
        {!item ? (
          <ContentListState loading={false} error="Not found." emptyText="Not found." />
        ) : (
          <>
            <div className="section-heading-tight">
              <div className="path-badge">
                /root/{kind}/{item.slug || slug}
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
    </div>
  );
};

export default ContentDetailPage;
