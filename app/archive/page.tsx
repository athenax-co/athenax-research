"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentListState, ContentRow } from "@/components/Content";
import { getArticles, getResearch, normalizeTag, sortByPublishedAtDesc } from "@/lib/api";
import WindowCard from "@/components/ui/WindowCard";
import { useCategories } from "@/hooks/queries/useReference";
import { usePapers } from "@/hooks/queries/usePaper";

const ArchivePage = () => {
  const [tab, setTab] = useState("articles");
  const [researchFilter, setResearchFilter] = useState("all");
  const [articles, setArticles] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paperFilter, setPaperFilter] = useState("All");
  const [paperSort, setPaperSort] = useState<"votes" | "new">("votes");
  const { data: categories = [] } = useCategories();
  const { data: papers = [], isLoading: papersLoading } = usePapers();

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setLoading(true);
      setError("");

      try {
        const [articleItems, researchItems] = await Promise.all([getArticles(), getResearch()]);

        if (!isMounted) return;

        setArticles(sortByPublishedAtDesc(articleItems as any));
        setResearch(sortByPublishedAtDesc(researchItems as any));
      } catch {
        if (!isMounted) return;
        setError("Could not load archive content right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setTab("articles");
  }, []);

  const filteredResearch = researchFilter === "all" ? research : research.filter((item) => normalizeTag(item.tag) === researchFilter);

  const filteredPapers = papers
    .filter((p) => paperFilter === "All" || p.categories.some((c) => c.name === paperFilter))
    .sort((a, b) => paperSort === "votes" ? b.voteCount - a.voteCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
            ["research", "Research"],
            ["papers", "Papers"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={tab === id ? { background: "#F5D94E" } : {}}
              onClick={() => setTab(id)}
            >
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
              <ContentListState loading={loading} error={error} emptyText="No published articles available yet." />
            )}
          </div>
        )}

        {tab === "papers" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="flex gap-2">
                {[{ id: 0, name: "All" }, ...categories].map((c) => (
                  <button
                    key={c.id}
                    className={`shrink-0 ${paperFilter === c.name ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}`}
                    style={paperFilter === c.name ? { background: "#F5D94E" } : {}}
                    onClick={() => setPaperFilter(c.name)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                {(["votes", "new"] as const).map((s) => (
                  <button
                    key={s}
                    className={paperSort === s ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
                    style={paperSort === s ? { background: "#F5D94E" } : {}}
                    onClick={() => setPaperSort(s)}
                  >
                    {s === "votes" ? "Most Voted" : "Newest"}
                  </button>
                ))}
              </div>
            </div>
            {papersLoading ? (
              <WindowCard label="PAPERS.SYS">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse border-b border-[#D8D4CC] py-4 last:border-b-0">
                    <div className="mb-2 h-5 w-3/4 rounded bg-[#E8E4DC]" />
                    <div className="h-3 w-1/2 rounded bg-[#E8E4DC]" />
                  </div>
                ))}
              </WindowCard>
            ) : filteredPapers.length === 0 ? (
              <WindowCard label="PAPERS.SYS">
                <p className="text-[13px] text-muted">No papers found.</p>
              </WindowCard>
            ) : (
              <WindowCard label="PAPERS.SYS">
                {filteredPapers.map((paper) => (
                  <div key={paper.id} className="flex flex-wrap items-start gap-3 border-b border-[#D8D4CC] py-4 last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/paper/${paper.slug}`}
                        className="mb-1 block text-[15px] font-semibold text-ink no-underline hover:underline"
                      >
                        {paper.title}
                      </Link>
                      {paper.categories.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1.5">
                          {paper.categories.map((c) => (
                            <span key={c.id} className="topic-pill text-[10px]">{c.name}</span>
                          ))}
                          <span className="ftag text-[10px]">{paper.sourceType === "link" ? "External" : "Hosted"}</span>
                        </div>
                      )}
                      {paper.abstract && (
                        <p className="mb-0 text-[13px] leading-relaxed text-muted">
                          {paper.abstract.length > 140 ? paper.abstract.slice(0, 140) + "…" : paper.abstract}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-['Space_Mono',monospace] text-xs font-bold text-[#E8323C]">
                        ▲ {paper.voteCount.toLocaleString()}
                      </span>
                      <Link href={`/paper/${paper.slug}`} className="btn btn-outline btn-sm">Read →</Link>
                    </div>
                  </div>
                ))}
              </WindowCard>
            )}
            <div className="mt-4">
              <Link href="/paper/submit" className="btn btn-primary">+ Submit Paper</Link>
            </div>
          </div>
        )}

        {tab === "research" && (
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              {[
                ["all", "All"],
                ["governance", "Governance"],
                ["treasury", "Treasury"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={researchFilter === id ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
                  style={researchFilter === id ? { background: "#F5D94E" } : {}}
                  onClick={() => setResearchFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            {filteredResearch.length > 0 ? (
              filteredResearch.map((item) => (
                <Link key={item.slug} href={`/archive/${item.slug}`}>
                  <ContentRow item={item} kind="research" onClick={() => {}} />
                </Link>
              ))
            ) : (
              <ContentListState
                loading={loading}
                error={error}
                emptyText={researchFilter === "all" ? "No published research available yet." : `No ${researchFilter} research available right now.`}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
