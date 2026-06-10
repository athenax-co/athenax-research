import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import WindowCard from "@/components/ui/WindowCard";
import { formatContentDate } from "@/lib/api";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { ShareButton } from "@/components/ui/ShareButton";
import { BASE_URL } from "@/api/client";
import type { BroadcastOut } from "@/features/broadcasts";

export const revalidate = 300;

async function getBroadcast(slug: string): Promise<BroadcastOut | null> {
  const cache: RequestInit = { next: { revalidate: 300, tags: ["archive", `broadcast:${slug}`] } };
  const res = await fetch(`${BASE_URL}/broadcast/slug/${slug}`, cache);
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getBroadcast(id);
  if (!item) return { title: "Not found" };
  return {
    title: item.title,
    description: item.description ?? undefined,
    openGraph: { title: item.title, description: item.description ?? undefined, type: "video.other" },
    twitter: { card: "summary_large_image", title: item.title, description: item.description ?? undefined },
  };
}

const toEmbedUrl = (value?: string | null) => {
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
  const item = await getBroadcast(id);
  if (!item) notFound();

  const { title, slug, broadcastType, originDate, publishedAt, description, embedUrl: rawEmbedUrl, tags } = item;

  const itemDate = originDate || publishedAt;
  const embedUrl = toEmbedUrl(rawEmbedUrl);
  const descParagraphs = description ? description.split(/\n\n+/).filter(Boolean) : [];
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/archive/broadcast/${slug}`;

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <div className="mt-8 max-w-300">
          <div className="section-heading-tight mb-6">
            <div className="flex items-center gap-3 mb-5 w-fit">
              <Link href="/archive?tab=broadcast" className="link-arrow inline-flex">
                ← Back to Broadcast
              </Link>
              <div className="path-badge mb-0">/root/archive/broadcast/{slug}</div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {broadcastType && <ProductBadge label={broadcastType} type="kind" />}
              {tags.map((tag) => <ProductBadge key={tag} label={tag} type="tag" />)}
              {(broadcastType || tags.length > 0) && <span className="text-sm text-muted">·</span>}
              <span className="text-sm text-muted">{String(formatContentDate(itemDate ?? ""))}</span>
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

          {embedUrl && (
            <div className="mb-7 overflow-hidden rounded-[14px] border-2 border-ink bg-ink shadow-[5px_5px_0_#1C1C27]">
              <iframe
                className="aspect-video w-full"
                src={embedUrl}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <WindowCard label="BROADCAST_CONTENT.TXT">
            {descParagraphs.length > 0 ? (
              descParagraphs.map((block, i) => (
                <p key={i} className={`text-base leading-[1.8] text-ink ${i === descParagraphs.length - 1 ? "mb-0" : "mb-4.5"}`}>
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
