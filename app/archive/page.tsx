"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ContentListState, ContentRow } from "@/components/Content";
import { getArticles, getResearch, normalizeTag, sortByPublishedAtDesc } from "@/lib/api";

const ArchivePage = () => {
  const [tab, setTab] = useState("articles");
  const [researchFilter, setResearchFilter] = useState("all");
  const [articles, setArticles] = useState<any[]>([]);
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
