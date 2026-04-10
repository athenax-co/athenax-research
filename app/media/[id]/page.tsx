import Link from "next/link";
import { SEED_MEDIA } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";
import { MediaIcon } from "@/components/Icons";
import { extractContentText, formatContentDate, getBroadcastById } from "@/lib/api";

const toEmbedUrl = (value?: string) => {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : value;
    }
    if (url.hostname.includes("youtube.com")) {
      if (url.pathname.includes("/embed/")) return value;
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : value;
    }
    return value;
  } catch {
    return value;
  }
};

const formatVideoType = (value?: string) => {
  if (!value) return "Broadcast";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const apiItem = await getBroadcastById(id);
  const seedItem = SEED_MEDIA.find((m) => m.id === id);
  const item = apiItem || seedItem;

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <p className="text-base text-muted">Not found.</p>
      </div>
    );
  }

  const itemType = item.type || "Video";
  const displayVideoType = formatVideoType(item.videoType);
  const itemDate = item.originDate || item.publishedAt || item.date;
  const contentBlocks = extractContentText(item.content || item.description || item.body);
  const embedUrl = toEmbedUrl(item.embedUrl);

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <Link href="/archive?tab=broadcast" className="link-arrow mb-5 mr-3 inline-flex">
          ← Back to Broadcast
        </Link>

        <div className="path-badge">/root/archive/{item.slug || id}</div>

        <div className="mb-3 flex items-center gap-3">
          <MediaIcon type={itemType} />
          <span className="topic-pill">{displayVideoType}</span>
          <span className="font-['Space_Mono',monospace] text-[13px] text-muted">{String(formatContentDate(itemDate))}</span>
        </div>

        <h1 className="mb-7 text-[42px] font-bold tracking-[-0.02em] text-ink">{item.title}</h1>

        {itemType === "Video" && (
          <div className="mb-7 overflow-hidden rounded-[14px] border-2 border-ink bg-ink shadow-[5px_5px_0_#1C1C27]">
            {embedUrl ? (
              <iframe
                className="aspect-video w-full"
                src={embedUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex aspect-video cursor-default items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/15">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polygon points="8,5 20,12 8,19" fill="white" />
                    </svg>
                  </div>
                  <div className="font-['Space_Mono',monospace] text-[11px] tracking-[0.06em] text-white/50">VIDEO PREVIEW UNAVAILABLE</div>
                </div>
              </div>
            )}
          </div>
        )}

        <WindowCard label={`${itemType.toUpperCase()}_CONTENT.TXT`}>
          {contentBlocks.length > 0 ? (
            contentBlocks.map((block, index) => (
              <p key={index} className={`text-base leading-[1.8] text-ink ${index === contentBlocks.length - 1 ? "mb-0" : "mb-4.5"}`}>
                {block}
              </p>
            ))
          ) : (
            <p className="text-base leading-[1.8] text-ink">No content available.</p>
          )}
        </WindowCard>
      </div>
    </div>
  );
}
