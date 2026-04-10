import { formatContentDate } from "@/lib/api";
import { ContentIcon, MediaIcon } from "./Icons";

const formatVideoType = (value?: string) => {
  if (!value) return "";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const ContentRow = ({ item, kind, onClick }: { item: any; kind: string; onClick?: () => void }) => (
  <div className="archive-row" onClick={onClick}>
    {kind === "broadcast" ? <MediaIcon type="Video" /> : <ContentIcon kind={kind} />}
    <div className="min-w-0 flex-1">
      <div className="archive-title">{item.title}</div>
      <div className="archive-meta">
        {String(formatContentDate(item.publishedAt))}
        {kind === "research" && item.tag ? `  //  ${item.tag}` : ""}
        {kind === "broadcast" && item.videoType ? `  //  ${formatVideoType(item.videoType)}` : ""}
      </div>
    </div>
    <span className="text-[18px] text-muted">→</span>
  </div>
);

export const ContentRowSkeleton = () => (
  <div className="archive-row animate-pulse">
    <div className="size-5 shrink-0 rounded bg-[#E8E4DC]" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="h-4 w-3/5 rounded bg-[#E8E4DC]" />
      <div className="h-3 w-1/4 rounded bg-[#E8E4DC]" />
    </div>
  </div>
);

export const ContentListState = ({ loading, error, emptyText }: { loading: boolean; error: string | null; emptyText: string }) => {
  if (loading) {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <ContentRowSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return <p className="mt-4.5 text-sm text-danger">{error}</p>;
  }
  return <p className="mt-4.5 text-sm text-muted">{emptyText}</p>;
};
