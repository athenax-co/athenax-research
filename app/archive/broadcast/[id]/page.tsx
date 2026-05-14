import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import { extractContentText, formatContentDate, getBroadcastById } from "@/lib/api";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { VIDEO_TYPE_ARTICLE_TYPE, ARTICLE_TYPE_LABEL } from "@/components/ui/ArticleMeta";
import { ShareButton } from "@/components/ui/ShareButton";

const toEmbedUrl = (value?: string) => {
  if (!value) return "";

  try {
    const url = new URL(value);

    const build = (id: string) => {
      const embed = new URL(`https://www.youtube.com/embed/${id}`);
      embed.searchParams.set("vq", "hd1080");
      embed.searchParams.set("rel", "0");
      embed.searchParams.set("modestbranding", "1");
      return embed.toString();
    };

    if (url.hostname.includes("youtu.be")) {
      return build(url.pathname.slice(1));
    }

    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.includes("/embed/")) return value;
      const id = url.searchParams.get("v");
      return id ? build(id) : value;
    }

    return value;
  } catch {
    return value;
  }
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getBroadcastById(id);

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <p className="text-base text-muted">Not found.</p>
      </div>
    );
  }

  const { type = "Video", videoType, originDate, publishedAt, date, content, description, body, embedUrl: rawEmbedUrl, title, slug } = item;

  const itemDate = originDate || publishedAt || date;
  const contentBlocks = extractContentText(content || description || body);
  const embedUrl = toEmbedUrl(rawEmbedUrl);

  const articleTypeKey = videoType ? (VIDEO_TYPE_ARTICLE_TYPE[videoType] ?? null) : null;
  const badgeLabel = articleTypeKey ? (ARTICLE_TYPE_LABEL[articleTypeKey] ?? videoType) : videoType;
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/archive/broadcast/${id}`;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <div className="mt-8 max-w-300">
          <div className="section-heading-tight mb-6">
            <div className="flex items-center gap-3 mb-5 w-fit">
              <Link href="/archive?tab=broadcast" className="link-arrow inline-flex">
                ← Back to Broadcast
              </Link>
              <div className="path-badge mb-0">/root/archive/broadcast/{slug || id}</div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {badgeLabel && <ProductBadge label={badgeLabel} type="kind" />}
              {badgeLabel && <span className="text-sm text-muted">·</span>}
              <span className="text-sm text-muted">{String(formatContentDate(itemDate))}</span>
            </div>

            <div className="flex items-start justify-between gap-4 mt-4">
              <div className="flex items-start gap-4">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
                  <img src="/Broadcast.svg" alt="Broadcast" className="size-full object-cover" />
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink">{title}</h1>
              </div>
              <ShareButton url={shareUrl} />
            </div>

            <hr className="border-0 border-t border-[#D8D4CC] mt-5" />
          </div>

          {type === "Video" && (
            <div className="mb-7 overflow-hidden rounded-[14px] border-2 border-ink bg-ink shadow-[5px_5px_0_#1C1C27]">
              {embedUrl ? (
                <iframe
                  className="aspect-video w-full"
                  src={embedUrl}
                  title={title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex aspect-video items-center justify-center text-white/50">VIDEO PREVIEW UNAVAILABLE</div>
              )}
            </div>
          )}

          <WindowCard label={`${type.toUpperCase()}_CONTENT.TXT`}>
            {contentBlocks.length ? (
              contentBlocks.map((block, i) => (
                <p key={i} className={`text-base leading-[1.8] text-ink ${i === contentBlocks.length - 1 ? "mb-0" : "mb-4.5"}`}>
                  {block}
                </p>
              ))
            ) : (
              <p className="text-base leading-[1.8] text-ink">No content available.</p>
            )}
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
