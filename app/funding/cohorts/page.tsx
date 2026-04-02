"use client";

import { useState } from "react";
import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";

const TOPICS = ["AI Agents", "DAO Governance", "Protocol Economics", "Tokenomics", "DeFi Systems", "Digital Nations"] as const;

export default function Page() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  return (
    <div className="section page-wrap">
      <div className="path-badge">/root/funding/cohorts</div>
      <h1 className="mb-2 text-5xl">Builder Cohorts</h1>
      <p className="text-[17px] text-muted">Research meets product. Ideas become protocols.</p>

      <hr className="divider" />

      <WindowCard label="COHORT_01: CURRENT" bodyClass="window-body window-body-yellow" style={{ marginBottom: 22 }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-[11px] tracking-[0.07em] text-muted">NOW RUNNING</div>
            <h3 className="mb-2 text-[28px]">Cohort 12 — Crypto Native AI</h3>
            <p className="max-w-120 text-[15px] leading-7 text-muted">
              Six teams building AI-powered protocol tooling. Funded by Ethereum Foundation, EigenLayer, and Arbitrum. 12-week intensive.
            </p>
          </div>

          <div className="text-right">
            <div className="mb-1 font-mono text-[11px] text-muted">PRIZE POOL</div>
            <div className="text-4xl font-bold text-danger">$240K</div>
          </div>
        </div>

        <hr className="divider-sm" />
        <Link className="btn btn-primary" href="/cohort/apply">
          Apply to Cohort →
        </Link>
      </WindowCard>

      <h2 className="mb-4.5 text-[28px]">Research Tracks</h2>
      <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2 xl:grid-cols-3">
        {TOPICS.map((topic) => (
          <div
            key={topic}
            className={`archive-row cursor-pointer ${selectedTopic === topic ? "active" : ""}`}
            onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
          >
            <div className="flex-1">
              <div className="archive-title text-[15px]">{topic}</div>
              {selectedTopic === topic && <div className="archive-meta">12 weeks · $20K prize · Open applications</div>}
            </div>
            <span>{selectedTopic === topic ? "▲" : "▼"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
