"use client";

import Link from "next/link";
import { useGlobal } from "@/components/GlobalProvider";
import { NEWSLETTERS } from "@/data/seed";
import NewsletterCard from "@/components/ui/NewsletterCard";
import { ContentListState, ContentRow } from "@/components/Content";
import { useArticles } from "@/hooks/queries/useContent";

export default function Page() {
  const { user } = useGlobal();
  const { data: articles = [], isLoading: articlesLoading, isError: articlesError } = useArticles();
  const pastIssues = articles.slice(0, 5);

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
          <div className="section-heading-tight mb-5">
            <h2 className="mb-0 text-[28px]">The Archive</h2>
            <p className="mb-0 text-[15px] text-muted">The archive. Everything is CC0.</p>
          </div>

          {pastIssues.length > 0 ? (
            pastIssues.map((item) => (
              <Link key={item.slug} href={`/archive/${item.slug}`} className="text-inherit no-underline">
                <ContentRow item={item} kind="article" onClick={() => {}} />
              </Link>
            ))
          ) : (
            <ContentListState
              loading={articlesLoading}
              error={articlesError ? "Could not load past issues right now." : null}
              emptyText="No published articles available yet."
            />
          )}

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
