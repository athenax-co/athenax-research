import { ProductBadge } from "./ProductBadge";

export const ARTICLE_TYPE_LABEL: Record<string, string> = {
  whitepaper: "Whitepaper",
  livestream: "Livestream",
  roundtable: "Roundtable",
};

export const ARTICLE_TYPE_ICON: Record<string, string> = {
  whitepaper: "/Whitepaper.svg",
  livestream: "/Livestream.svg",
  roundtable: "/Roundtable.svg",
};

export function ArticleTypeIcon({ type, size = 28 }: { type: string; size?: number }) {
  const src = ARTICLE_TYPE_ICON[type];
  if (!src) return null;
  return <img src={src} alt={type} width={size} height={size} className="shrink-0" />;
}

export function ArticleBadges({ articleType, tags }: { articleType?: string; tags?: string[] }) {
  if (!articleType && !tags?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {articleType && (
        <ProductBadge label={articleType} type="kind" />
      )}
      {tags?.map((tag) => (
        <ProductBadge key={tag} label={tag} type="tag" />
      ))}
    </div>
  );
}
