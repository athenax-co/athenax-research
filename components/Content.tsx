import { formatContentDate } from "@/lib/api";
import { ContentIcon } from "./Icons";

export const ContentRow = ({ item, kind, onClick }: { item: any; kind: string; onClick: () => void }) => (
  <div className="archive-row" onClick={onClick}>
    <ContentIcon kind={kind} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="archive-title">{item.title}</div>
      <div className="archive-meta">
        {String(formatContentDate(item.publishedAt))}
        {kind === "research" && item.tag ? `  //  ${item.tag}` : ""}
      </div>
    </div>
    <span style={{ color: "#6B6B7A", fontSize: 18 }}>→</span>
  </div>
);

export const ContentListState = ({ loading, error, emptyText }: { loading: boolean; error: string | null; emptyText: string }) => {
  if (loading) {
    return (
      <div style={{ padding: "18px 0", fontSize: 14, color: "#6B6B7A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#6B6B7A" }}>
          <span className="spinner" />
          Loading latest content...
        </div>
      </div>
    );
  }
  if (error) {
    return <p style={{ fontSize: 14, color: "#E8323C", margin: "18px 0 0" }}>{error}</p>;
  }
  return <p style={{ fontSize: 14, color: "#6B6B7A", margin: "18px 0 0" }}>{emptyText}</p>;
};
