"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentListState, ContentRow } from "@/components/Content";
import { useArticles, useBroadcasts } from "@/hooks/queries/useContent";

const ArchivePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "articles";

  const { data: articles = [], isLoading: articlesLoading, isError: articlesError } = useArticles();
  const { data: broadcasts = [], isLoading: broadcastsLoading, isError: broadcastsError } = useBroadcasts();

  const setTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/archive</div>
        <h1 className="mb-2 text-[48px]">The Archive</h1>
        <p className="text-[17px] text-muted">Artifacts, learnings, and broadcasts.</p>
        <hr className="divider" />

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            ["articles", "Articles"],
            ["broadcast", "Broadcast"],
          ].map(([id, label]) => (
            <button key={id} className={tab === id ? "btn btn-ghost btn-sm bg-yellow" : "btn btn-outline btn-sm"} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </div>

        {tab === "articles" && (
          <div>
            {articles.length > 0 ? (
              articles.map((item) => (
                <Link key={item.slug} href={`/archive/${item.slug}`}>
                  <ContentRow item={item} kind="article" onClick={() => {}} />
                </Link>
              ))
            ) : (
              <ContentListState loading={articlesLoading} error={articlesError ? "Could not load archive content right now." : ""} emptyText="No published articles available yet." />
            )}
          </div>
        )}

        {tab === "broadcast" && (
          <div>
            {broadcasts.length === 0 ? (
              <ContentListState loading={broadcastsLoading} error={broadcastsError ? "Could not load broadcasts right now." : ""} emptyText="No broadcast videos available yet." />
            ) : (
              <div>
                {broadcasts.map((item) => (
                  <Link key={item.id || item.slug} href={item.id ? `/media/${item.id}` : `/archive/${item.slug}`} className="no-underline">
                    <ContentRow item={item} kind="broadcast" onClick={() => {}} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
