"use client";

import { useState } from "react";
import Link from "next/link";
import { useGlobal } from "@/components/GlobalProvider";
import { SEED_PAPERS, SEED_RESEARCHERS } from "@/data/seed";
import { calcARS } from "@/lib/db-helper";
import WindowCard from "@/components/ui/WindowCard";

type SortKey = "ars" | "citations" | "reviews";

export default function Page() {
  const { user, showToast } = useGlobal();
  const allTopics = ["All", ...Array.from(new Set(SEED_PAPERS.map((paper) => paper.topic)))];
  const [topicFilter, setTopicFilter] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("ars");
  const [search, setSearch] = useState("");

  const filtered = [...SEED_RESEARCHERS]
    .filter((researcher) => {
      const query = search.toLowerCase();
      const matchSearch =
        !search ||
        researcher.name.toLowerCase().includes(query) ||
        researcher.lab.toLowerCase().includes(query) ||
        researcher.university.toLowerCase().includes(query);
      const matchTopic =
        topicFilter === "All" || SEED_PAPERS.some((paper) => (paper.authorIds || []).includes(researcher.userId) && paper.topic === topicFilter);
      return matchSearch && matchTopic;
    })
    .sort((a, b) => {
      if (sortBy === "ars") return calcARS(b) - calcARS(a);
      if (sortBy === "citations") return (b.citations || 0) - (a.citations || 0);
      if (sortBy === "reviews") return (b.peerReviews || 0) - (a.peerReviews || 0);
      return 0;
    });

  const avgArs = (SEED_RESEARCHERS.reduce((sum, researcher) => sum + calcARS(researcher), 0) / SEED_RESEARCHERS.length).toFixed(1);

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/researchers</div>
        <h1 className="mb-2 text-5xl">Researchers</h1>
        <p className="text-[17px] text-muted">
          Browse ARS-scored researchers across AI, robotics, biotech, and developer tools. Every profile is verified through indexed publications,
          peer reviews, and bounty completions.
        </p>
        <hr className="divider" />

        <div className="mb-8 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Indexed Researchers", value: SEED_RESEARCHERS.length },
            { label: "Avg. ARS Score", value: avgArs },
            { label: "Open to Hire", value: Math.ceil(SEED_RESEARCHERS.length * 0.6) },
            { label: "Cohort Eligible", value: SEED_RESEARCHERS.filter((researcher) => calcARS(researcher) >= 6.5).length },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value text-xl">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2.5">
          <input
            className="inp min-w-50 flex-1 px-3.5 py-2.25 text-sm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, lab, or university…"
          />
          <div className="flex flex-wrap gap-2">
            {[
              ["ars", "ARS Score"],
              ["citations", "Citations"],
              ["reviews", "Peer Reviews"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={sortBy === key ? "btn btn-ghost btn-sm bg-yellow" : "btn btn-outline btn-sm"}
                onClick={() => setSortBy(key as SortKey)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-7 flex flex-wrap gap-2">
          {allTopics.map((topic) => (
            <button
              key={topic}
              className={topicFilter === topic ? "btn btn-ghost btn-sm bg-yellow" : "btn btn-outline btn-sm"}
              onClick={() => setTopicFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <WindowCard label="RESEARCHER_DIRECTORY.SYS">
          {filtered.length === 0 && <p className="text-sm text-muted">No researchers matched your filters.</p>}
          {filtered.map((researcher, index) => {
            const ars = calcARS(researcher);
            const papers = SEED_PAPERS.filter((paper) => (paper.authorIds || []).includes(researcher.userId));
            const openToHire = ars >= 5.0;
            const cohortEligible = ars >= 6.5;

            return (
              <Link key={researcher.id} href="/profile" className="lb-row px-4.5 py-4 text-inherit no-underline">
                <div className={`lb-rank ${index === 0 ? "text-danger" : "text-muted"}`}>#{index + 1}</div>
                <div className="lb-avatar h-10 w-10 text-[15px]">{researcher.name.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="lb-name text-[15px]">{researcher.name}</div>
                    {openToHire && <span className="ftag bg-success text-[10px]">Open to Hire</span>}
                    {cohortEligible && <span className="ftag bg-yellow text-[10px]">Cohort Eligible</span>}
                  </div>
                  <div className="lb-meta">
                    {researcher.university} · {researcher.lab}
                  </div>
                  <div className="mt-0.75 text-xs text-muted">{researcher.bio}</div>
                  {papers.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {papers.slice(0, 2).map((paper) => (
                        <span key={paper.id} className="topic-pill px-2 py-0.5 text-[10px]">
                          {paper.topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="lb-ars text-xl">{ars.toFixed(1)}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-muted">ARS</div>
                  <div className="mt-1 text-[11px] text-muted">{(researcher.citations || 0).toLocaleString()} cites</div>
                  <button
                    className="btn btn-outline btn-sm mt-2"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (!user) {
                        showToast("Sign in to save researchers.", "error");
                        return;
                      }
                      showToast(`Saved ${researcher.name} to your shortlist.`, "success");
                    }}
                  >
                    Save
                  </button>
                </div>
              </Link>
            );
          })}
        </WindowCard>

        <div className="mt-5.5 grid grid-cols-1 gap-5.5 lg:grid-cols-2">
          <WindowCard label="HIRE_RESEARCHERS.SYS" bodyClass="window-body window-body-yellow">
            <h3 className="mb-2 text-[20px]">Hiring Researchers?</h3>
            <p className="mb-4 text-sm leading-7 text-muted">
              Post a role and reach ARS-verified researchers across frontier technology sectors. Free for active sponsors. External companies pay a
              15% placement fee on hire.
            </p>
            <Link href="/network/talent" className="btn btn-primary btn-sm no-underline">
              Browse Startup Marketplace →
            </Link>
          </WindowCard>
          <WindowCard label="ARE_YOU_A_RESEARCHER.SYS" bodyClass="window-body window-body-blue">
            <h3 className="mb-2 text-[20px]">Are You a Researcher?</h3>
            <p className="mb-4 text-sm leading-7 text-muted">
              Build your ARS score. Get discovered by AI companies. Apply to Builder Cohorts. Launch your startup on AthenaX.
            </p>
            <Link href="/cohort/apply" className="btn btn-outline btn-sm no-underline">
              Claim Your Profile →
            </Link>
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
