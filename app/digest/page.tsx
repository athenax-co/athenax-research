"use client";

import Link from "next/link";
import { useGlobal } from "@/components/GlobalProvider";
import { NEWSLETTERS, SEED_MEDIA } from "@/data/seed";
import NewsletterCard from "@/components/ui/NewsletterCard";
import { MediaIcon } from "@/components/Icons";

export default function Page() {
  const { user } = useGlobal();
  const pastIssues = SEED_MEDIA.filter((m) => m.type === "Essay" || m.type === "Log").slice(0, 4);

  return (
    <div>
      <div className="section-stack-lg page-wrap section">
        <div className="section-heading">
          <div className="path-badge">/root/digest</div>
          <h1 className="mb-0 text-5xl">Research Digest</h1>
          <p className="mb-0 text-[17px] text-muted">Weekly dispatches from the AthenaX network. No noise, just signal.</p>
          <hr className="divider" />
        </div>

        <div className="section-stack-md">
          <div className="section-heading-tight">
            <h2 className="mb-0 text-[28px]">Choose Your Lists</h2>
            <p className="mb-0 text-[15px] text-muted">Subscribe to one or all three. Unsubscribe any time.</p>
          </div>

          <div className="flex flex-col gap-4.5">
            {NEWSLETTERS.map((nl) => (
              <NewsletterCard key={nl.id} nl={nl} email={user?.email || ""} />
            ))}
          </div>
        </div>

        <div className="section-stack-md">
          <div className="section-heading-tight">
            <h2 className="mb-0 text-[28px]">Past Issues</h2>
            <p className="mb-0 text-[15px] text-muted">The archive. Everything is CC0.</p>
          </div>

          {pastIssues.map((item) => (
            <Link key={item.id} href={`/media/${item.id}`} className="archive-row text-inherit no-underline">
              <MediaIcon type={item.type} />
              <div className="flex-1">
                <div className="archive-title">{item.title}</div>
                <div className="archive-meta">
                  {item.date} &nbsp;//&nbsp; {item.type}
                </div>
              </div>
              <span className="text-[18px] text-muted">→</span>
            </Link>
          ))}

          <div className="mt-4">
            <Link href="/archive" className="link-arrow inline-block">
              View Full Archive →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
