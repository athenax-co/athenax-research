import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import { MediaIcon } from "@/components/Icons";
import { extractContentText, formatContentDate, getBroadcastById } from "@/lib/api";

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

const formatVideoType = (value?: string) =>
  value
    ? value
        .split("_")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : "Broadcast";

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

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <Link href="/archive?tab=broadcast" className="link-arrow mb-5 mr-3 inline-flex">
          ← Back to Broadcast
        </Link>

        <div className="path-badge">/root/archive/{slug || id}</div>

        <div className="mb-3 flex items-center gap-3">
          <MediaIcon type={type} />
          <span className="topic-pill">{formatVideoType(videoType)}</span>
          <span className="font-['Space_Mono',monospace] text-[13px] text-muted">{String(formatContentDate(itemDate))}</span>
        </div>

        <h1 className="mb-7 text-[42px] font-bold tracking-[-0.02em] text-ink">{title}</h1>

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
  );
}
