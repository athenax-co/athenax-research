import Link from "next/link";
import { SEED_MEDIA } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";
import { MediaIcon } from "@/components/Icons";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = SEED_MEDIA.find((m) => m.id === id);

  if (!item) {
    return (
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <p className="text-base text-muted">Not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <Link href="/archive" className="link-arrow mb-5 mr-3 inline-flex">
          &lt;- Back to Archive
        </Link>

        <div className="path-badge">/root/archive/{item.slug}</div>

        <div className="mb-3 flex items-center gap-3">
          <MediaIcon type={item.type} />
          <span className="topic-pill">{item.type}</span>
          <span className="font-['Space_Mono',monospace] text-[13px] text-muted">{item.date}</span>
        </div>

        <h1 className="mb-7 text-[42px] font-bold tracking-[-0.02em] text-ink">{item.title}</h1>

        {item.type === "Video" && (
          <div className="mb-7 flex aspect-video cursor-pointer items-center justify-center rounded-[14px] border-2 border-ink bg-ink shadow-[5px_5px_0_#1C1C27]">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/15">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 20,12 8,19" fill="white" />
                </svg>
              </div>
              <div className="font-['Space_Mono',monospace] text-[11px] tracking-[0.06em] text-white/50">CLICK TO PLAY (DEMO)</div>
            </div>
          </div>
        )}

        <WindowCard label={`${item.type.toUpperCase()}_CONTENT.TXT`}>
          <p className="text-base leading-[1.8] text-ink">{item.body}</p>
        </WindowCard>
      </div>
    </div>
  );
}
