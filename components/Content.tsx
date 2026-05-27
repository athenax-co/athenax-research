import { formatContentDate } from "@/lib/api";
import { ArticleTypeIcon, VIDEO_TYPE_ARTICLE_TYPE, ARTICLE_TYPE_LABEL } from "@/components/ui/ArticleMeta";
import { ProductBadge } from "@/components/ui/ProductBadge";

const formatVideoType = (value?: string) => {
  if (!value) return "";
  const key = VIDEO_TYPE_ARTICLE_TYPE[value];
  return key ? (ARTICLE_TYPE_LABEL[key] ?? value) : value;
};

const RowIcon = ({ kind, articleType }: { kind: string; articleType?: string }) => {
  if (kind === "article" && articleType) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border-[1.5px] border-ink bg-[#FDFCF9]">
        <ArticleTypeIcon type={articleType} size={52} />
      </div>
    );
  }

  if (kind === "broadcast") {
    return (
      <div className="size-12 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
        <img src="/Broadcast.svg" alt="Broadcast" className="size-full object-cover" />
      </div>
    );
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-[#FDFCF9] object-cover">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="1" width="10" height="14" rx="1" stroke="#1C1C27" strokeWidth="1.5" />
        <line x1="5" y1="5" x2="11" y2="5" stroke="#1C1C27" strokeWidth="1.2" />
        <line x1="5" y1="8" x2="11" y2="8" stroke="#1C1C27" strokeWidth="1.2" />
        <line x1="5" y1="11" x2="9" y2="11" stroke="#1C1C27" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

export const ContentRow = ({
  item,
  kind,
  onClick,
  statusBadge,
  actions,
}: {
  item: any;
  kind: string;
  onClick?: () => void;
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  const tags: string[] = item.tags ?? [];
  const hasBadges =
    (kind === "article" && (item.articleType || tags.length > 0)) ||
    (kind === "broadcast" && !!(item.broadcastType ?? item.videoType));

  return (
    <div className="archive-row" onClick={onClick}>
      <RowIcon kind={kind} articleType={item.articleType} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="archive-title">{item.title}</span>
          {statusBadge}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {kind === "article" && item.articleType && <ProductBadge label={item.articleType} type="kind" />}
          {kind === "broadcast" && (item.broadcastType ?? item.videoType) && (
            <ProductBadge
              label={item.broadcastType ?? formatVideoType(item.videoType)}
              type="kind"
            />
          )}
          {tags.map((tag) => (
            <ProductBadge key={tag} label={tag} type="tag" />
          ))}
          {hasBadges && <span className="text-muted">·</span>}
          <span className="font-['Space_Mono',monospace] text-[12px] text-muted">
            {item.publishedAt
              ? String(formatContentDate(item.publishedAt))
              : item.status === "draft"
                ? "Not published"
                : item.status === "archived"
                  ? "Archived"
                  : "—"}
            {kind === "research" && item.tag ? ` // ${item.tag}` : ""}
          </span>
        </div>
      </div>
      {actions ?? <span className="text-[18px] text-muted">→</span>}
    </div>
  );
};

export const ContentRowSkeleton = () => (
  <div className="archive-row animate-pulse">
    <div className="size-13 shrink-0 rounded-xl bg-[#E8E4DC]" />
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
