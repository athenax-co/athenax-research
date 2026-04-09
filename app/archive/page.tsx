"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentListState, ContentRow } from "@/components/Content";
import { ContentIcon } from "@/components/Icons";
import { getArticles, sortByPublishedAtDesc } from "@/lib/api";
import { useCategories } from "@/hooks/queries/useReference";
import { usePapers } from "@/hooks/queries/usePaper";
import { PaperVerificationStatus } from "@/enums";

const ArchivePage = () => {
  const [tab, setTab] = useState("articles");
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paperFilter, setPaperFilter] = useState("All");
  const [paperSort, setPaperSort] = useState<"votes" | "new">("votes");
  const { data: categories = [] } = useCategories();
  const { data: papers = [], isLoading: papersLoading } = usePapers(50, 0, PaperVerificationStatus.APPROVED);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setLoading(true);
      setError("");

      try {
        const articleItems = await getArticles();
        if (!isMounted) return;
        setArticles(sortByPublishedAtDesc(articleItems as any));
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

  const filteredPapers = papers
    .filter((p) => paperFilter === "All" || p.categories.some((c) => c.name === paperFilter))
    .sort((a, b) => (paperSort === "votes" ? b.voteCount - a.voteCount : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

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
              <ContentListState loading={loading} error={error} emptyText="No published articles available yet." />
            )}
          </div>
        )}

        {tab === "research" && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="flex gap-2">
                {[{ id: 0, name: "All" }, ...categories].map((c) => (
                  <button
                    key={c.id}
                    className={`shrink-0 ${paperFilter === c.name ? "btn btn-ghost btn-sm bg-yellow" : "btn btn-outline btn-sm"}`}
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
                    className={paperSort === s ? "btn btn-ghost btn-sm bg-yellow" : "btn btn-outline btn-sm"}
                    onClick={() => setPaperSort(s)}
                  >
                    {s === "votes" ? "Most Voted" : "Newest"}
                  </button>
                ))}
              </div>
            </div>
            {papersLoading ? (
              <div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="archive-row animate-pulse">
                    <div className="archive-icon" />
                    <div className="flex-1">
                      <div className="mb-2 h-4 w-3/4 rounded bg-[#E8E4DC]" />
                      <div className="h-3 w-1/3 rounded bg-[#E8E4DC]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPapers.length === 0 ? (
              <p className="text-[13px] text-muted">No papers found.</p>
            ) : (
              <div>
                {filteredPapers.map((paper) => (
                  <Link key={paper.id} href={`/paper/${paper.slug}`} className="no-underline">
                    <div className="archive-row">
                      <ContentIcon kind="paper" />
                      <div className="min-w-0 flex-1">
                        <div className="archive-title">{paper.title}</div>
                        <div className="archive-meta">
                          {paper.createdAt
                            ? new Date(paper.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : ""}
                          {paper.categories.length > 0 && `  //  ${paper.categories.map((c) => c.name).join(", ")}`}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-['Space_Mono',monospace] text-[12px] font-bold text-danger">▲ {paper.voteCount.toLocaleString()}</div>
                        <div className="text-[10px] text-muted">votes</div>
                      </div>
                      <span className="text-[18px] text-muted">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link href="/paper/submit" className="btn btn-primary">
                + Submit Paper
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivePage;
