"use client";

import { useState } from "react";
import Link from "next/link";
import { SEED_PAPERS, SEED_RESEARCHERS } from "@/data/seed";
import { calcARS } from "@/lib/db-helper";
import WindowCard from "../ui/WindowCard";

type SortKey = "ars" | "citations" | "reviews";

type ResearchersPageUser = {
  id: number | string;
  name?: string;
} | null;

const ResearchersPage = ({ user, showToast }: { user: ResearchersPageUser; showToast: (text: string, type: string) => void }) => {
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
        topicFilter === "All" ||
        SEED_PAPERS.some((paper) => (paper.authorIds || []).includes(researcher.userId) && paper.topic === topicFilter);
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
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Researchers</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A" }}>
          Browse ARS-scored researchers across AI, robotics, biotech, and developer tools. Every profile is verified through indexed publications,
          peer reviews, and bounty completions.
        </p>
        <hr className="divider" />

        <div className="grid-4" style={{ gap: 14, marginBottom: 32 }}>
          {[
            { label: "Indexed Researchers", value: SEED_RESEARCHERS.length },
            { label: "Avg. ARS Score", value: avgArs },
            { label: "Open to Hire", value: Math.ceil(SEED_RESEARCHERS.length * 0.6) },
            { label: "Cohort Eligible", value: SEED_RESEARCHERS.filter((researcher) => calcARS(researcher) >= 6.5).length },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ fontSize: 20 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            className="inp"
            style={{ flex: 1, minWidth: 200, padding: "9px 14px", fontSize: 14 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, lab, or university…"
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              ["ars", "ARS Score"],
              ["citations", "Citations"],
              ["reviews", "Peer Reviews"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={sortBy === key ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
                style={sortBy === key ? { background: "#F5D94E" } : {}}
                onClick={() => setSortBy(key as SortKey)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {allTopics.map((topic) => (
            <button
              key={topic}
              className={topicFilter === topic ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={topicFilter === topic ? { background: "#F5D94E" } : {}}
              onClick={() => setTopicFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>

        <WindowCard label="RESEARCHER_DIRECTORY.SYS">
          {filtered.length === 0 && <p style={{ color: "#6B6B7A", fontSize: 14 }}>No researchers matched your filters.</p>}
          {filtered.map((researcher, index) => {
            const ars = calcARS(researcher);
            const papers = SEED_PAPERS.filter((paper) => (paper.authorIds || []).includes(researcher.userId));
            const openToHire = ars >= 5.0;
            const cohortEligible = ars >= 6.5;

            return (
              <Link
                key={researcher.id}
                href="/profile"
                className="lb-row"
                style={{ padding: "16px 18px", cursor: "pointer", textDecoration: "none", color: "inherit" }}
              >
                <div className="lb-rank" style={{ color: index === 0 ? "#E8323C" : "#6B6B7A" }}>
                  #{index + 1}
                </div>
                <div className="lb-avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
                  {researcher.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <div className="lb-name" style={{ fontSize: 15 }}>
                      {researcher.name}
                    </div>
                    {openToHire && (
                      <span className="ftag" style={{ background: "#D4EDDA", fontSize: 10 }}>
                        Open to Hire
                      </span>
                    )}
                    {cohortEligible && (
                      <span className="ftag" style={{ background: "#F5D94E", fontSize: 10 }}>
                        Cohort Eligible
                      </span>
                    )}
                  </div>
                  <div className="lb-meta">
                    {researcher.university} · {researcher.lab}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B6B7A", marginTop: 3 }}>{researcher.bio}</div>
                  {papers.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                      {papers.slice(0, 2).map((paper) => (
                        <span key={paper.id} className="topic-pill" style={{ fontSize: 10, padding: "2px 8px" }}>
                          {paper.topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="lb-ars" style={{ fontSize: 20 }}>
                    {ars.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "'Space Mono',monospace", color: "#6B6B7A", marginTop: 2 }}>ARS</div>
                  <div style={{ fontSize: 11, color: "#6B6B7A", marginTop: 4 }}>{(researcher.citations || 0).toLocaleString()} cites</div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ marginTop: 8 }}
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

        <div className="grid-2" style={{ gap: 22, marginTop: 22 }}>
          <WindowCard label="HIRE_RESEARCHERS.SYS" bodyClass="window-body window-body-yellow">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Hiring Researchers?</h3>
            <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
              Post a role and reach ARS-verified researchers across frontier technology sectors. Free for active sponsors. External companies pay a
              15% placement fee on hire.
            </p>
            <Link href="/talent" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
              Browse Startup Marketplace →
            </Link>
          </WindowCard>
          <WindowCard label="ARE_YOU_A_RESEARCHER.SYS" bodyClass="window-body window-body-blue">
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Are You a Researcher?</h3>
            <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
              Build your ARS score. Get discovered by AI companies. Apply to Builder Cohorts. Launch your startup on AthenaX.
            </p>
            <Link href="/apply-cohort" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>
              Claim Your Profile →
            </Link>
          </WindowCard>
        </div>
      </div>
    </div>
  );
};

export default ResearchersPage;
