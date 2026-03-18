// ═══════════════════════════════════════════════════════════
// COHORTS PAGE

"use client";

import { useState } from "react";
import Link from "next/link";
import WindowCard from "../ui/WindowCard";

// ═══════════════════════════════════════════════════════════
const CohortsPage = () => {
  const topics = ["AI Agents", "DAO Governance", "Protocol Economics", "Tokenomics", "DeFi Systems", "Digital Nations"];
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/funding/cohorts</div>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Builder Cohorts</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A" }}>Research meets product. Ideas become protocols.</p>
        <hr className="divider" />
        <WindowCard label="COHORT_01: CURRENT" bodyClass="window-body window-body-yellow" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 4 }}>
                NOW RUNNING
              </div>
              <h3 style={{ fontSize: 28, marginBottom: 8 }}>Cohort 12 — Crypto Native AI</h3>
              <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, maxWidth: 480 }}>
                Six teams building AI-powered protocol tooling. Funded by Ethereum Foundation, EigenLayer, and Arbitrum. 12-week intensive.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#6B6B7A", marginBottom: 4 }}>PRIZE POOL</div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#E8323C" }}>$240K</div>
            </div>
          </div>
          <hr className="divider-sm" />
          <Link className="btn btn-primary" href="/apply-cohort">
            Apply to Cohort →
          </Link>
        </WindowCard>

        <h2 style={{ fontSize: 28, marginBottom: 18 }}>Research Tracks</h2>
        <div className="grid-3" style={{ gap: 18 }}>
          {topics.map((t) => (
            <div
              key={t}
              className={`archive-row${sel === t ? " active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSel(sel === t ? null : t)}
            >
              <div style={{ flex: 1 }}>
                <div className="archive-title" style={{ fontSize: 15 }}>
                  {t}
                </div>
                {sel === t && <div className="archive-meta">12 weeks · $20K prize · Open applications</div>}
              </div>
              <span>{sel === t ? "▲" : "▼"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CohortsPage;
