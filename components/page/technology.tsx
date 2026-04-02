"use client";

import { useState } from "react";
import Link from "next/link";
import { SEED_PAPERS, SEED_STARTUPS } from "@/data/seed";
import { IconPaperSmall } from "../Icons";
import WindowCard from "../ui/WindowCard";

type TechMarketplaceUser = {
  id: number | string;
} | null;

type SortKey = "investorInterest" | "votes" | "developerViews" | "githubStars";

const TechMarketplacePage = ({ user, showToast }: { user: TechMarketplaceUser; showToast: (message: string, type: string) => void }) => {
  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("investorInterest");
  const [interestReg, setInterestReg] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

  const sectors = ["All", "AI & Agents", "Robotics", "Biotech", "Crypto & DeFi", "Developer Tools", "Infrastructure", "Climate & Energy"];
  const sorts: [SortKey, string][] = [
    ["investorInterest", "⬡ Investor Interest"],
    ["votes", "▲ Top Voted"],
    ["developerViews", "👁 Developer Interest"],
    ["githubStars", "★ GitHub Stars"],
  ];

  const filtered = (sector === "All" ? SEED_STARTUPS : SEED_STARTUPS.filter((startup) => startup.sector === sector)).sort(
    (a, b) => (b[sortBy] || 0) - (a[sortBy] || 0)
  );

  const registerInterest = (startup: (typeof SEED_STARTUPS)[number]) => {
    if (!user) {
      showToast("Sign in to register investor interest.", "error");
      return;
    }
    if (interestReg[startup.id]) {
      showToast("Interest already registered.", "info");
      return;
    }
    setInterestReg((prev) => ({ ...prev, [startup.id]: true }));
    showToast(`Investor interest registered for ${startup.name}. Founders will be notified.`, "success");
  };

  const toggleBookmark = (id: string) => {
    if (!user) {
      showToast("Sign in to bookmark.", "error");
      return;
    }
    const next = !bookmarked[id];
    setBookmarked((prev) => ({ ...prev, [id]: next }));
    showToast(next ? "Saved to bookmarks." : "Removed from bookmarks.", "success");
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/startups</div>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Startup Marketplace</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A" }}>
          Research-backed startups raising funding across frontier technology. Register investor interest, track research lineage, and discover
          founders before the market does.
        </p>
        <hr className="divider" />

        <div className="grid-4" style={{ gap: 14, marginBottom: 28 }}>
          {[
            { label: "Startups Listed", value: SEED_STARTUPS.length },
            { label: "Total Raising", value: "$1.4B+" },
            { label: "Avg. Founder ARS", value: (SEED_STARTUPS.reduce((sum, startup) => sum + startup.founders[0].ars, 0) / SEED_STARTUPS.length).toFixed(1) },
            { label: "Investor Intros Made", value: "142" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value" style={{ fontSize: 20 }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {sectors.map((entry) => (
            <button
              key={entry}
              className={sector === entry ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={sector === entry ? { background: "#F5D94E" } : {}}
              onClick={() => setSector(entry)}
            >
              {entry}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, justifyContent: "flex-end" }}>
          {sorts.map(([key, label]) => (
            <button
              key={key}
              className={sortBy === key ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={sortBy === key ? { background: "#F5D94E" } : { fontSize: 12 }}
              onClick={() => setSortBy(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.map((startup) => (
          <WindowCard key={startup.id} label={`STARTUP: ${startup.name.toUpperCase().replace(/\s+/g, "-")}`} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 21, marginBottom: 0 }}>{startup.name}</h3>
                  <span className="topic-pill">{startup.sector}</span>
                  <span className="ftag" style={{ background: "#EAF0F6", fontSize: 11 }}>
                    {startup.category}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#1C1C27", lineHeight: 1.7, marginBottom: 12 }}>{startup.desc}</p>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 6 }}>
                    FOUNDERS
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {startup.founders.map((founder) => (
                      <div
                        key={founder.name}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", border: "1.5px solid #1C1C27", borderRadius: 7, background: "#F9F5DC" }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{founder.name.split(" ").slice(-1)[0]}</span>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#E8323C", fontWeight: 700 }}>ARS {founder.ars}</span>
                        <span style={{ fontSize: 10, color: "#6B6B7A" }}>{founder.lab}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 6 }}>
                    RESEARCH LINEAGE
                  </div>
                  {startup.researchLineage.map((title) => {
                    const paper = SEED_PAPERS.find((entry) => entry.title === title);
                    const content = (
                      <>
                        <IconPaperSmall />
                        <span style={{ fontSize: 12, marginLeft: 8 }}>{title.slice(0, 65)}{title.length > 65 ? "…" : ""}</span>
                        {paper && (
                          <span style={{ marginLeft: "auto", fontSize: 11, color: "#6B6B7A", fontFamily: "'Space Mono',monospace", flexShrink: 0 }}>
                            {paper.citations} cites
                          </span>
                        )}
                      </>
                    );

                    return paper ? (
                      <Link
                        key={title}
                        href={`/paper/${paper.id}`}
                        className="archive-row"
                        style={{ padding: "6px 10px", marginBottom: 3, textDecoration: "none", color: "inherit" }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <div key={title} className="archive-row" style={{ padding: "6px 10px", marginBottom: 3, cursor: "default" }}>
                        {content}
                      </div>
                    );
                  })}
                </div>

                <div>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.06em", color: "#6B6B7A", marginBottom: 6 }}>
                    CURRENT INVESTORS
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {startup.investors.map((investor) => (
                      <span key={investor} className="ftag" style={{ fontSize: 11 }}>
                        {investor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ flexShrink: 0, minWidth: 200, display: "flex", flexDirection: "column", gap: 12 }}>
                <WindowCard label="RAISE.SYS" bodyClass="window-body window-body-yellow">
                  <div style={{ marginBottom: 4 }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6B6B7A", marginBottom: 4 }}>STAGE</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{startup.stage}</div>
                  </div>
                  <div style={{ marginBottom: startup.valuation ? 8 : 0 }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6B6B7A", marginBottom: 4 }}>RAISING</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#E8323C" }}>{startup.raisingAmount}</div>
                  </div>
                  {startup.valuation && (
                    <div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#6B6B7A", marginBottom: 4 }}>VALUATION</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{startup.valuation}</div>
                    </div>
                  )}
                </WindowCard>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Votes", value: startup.votes.toLocaleString(), color: "#E8323C" },
                    { label: "GitHub ★", value: `+${startup.githubStars.toLocaleString()}`, color: "#1C1C27" },
                    { label: "Dev Views", value: startup.developerViews.toLocaleString(), color: "#6B6B7A" },
                    { label: "Investors", value: startup.investorInterest + (interestReg[startup.id] ? 1 : 0), color: "#15803D" },
                  ].map((metric) => (
                    <div key={metric.label} style={{ padding: "8px 10px", border: "1.5px solid #D8D4CC", borderRadius: 7, background: "#fff" }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: "#6B6B7A", marginBottom: 3, letterSpacing: "0.05em" }}>
                        {metric.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: metric.color }}>{metric.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link href={`/launch/${startup.launchId}`} className="btn btn-primary btn-sm" style={{ justifyContent: "center", textDecoration: "none" }}>
                    View Startup →
                  </Link>
                  <button
                    className={interestReg[startup.id] ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
                    style={{ ...(interestReg[startup.id] ? { background: "#D4EDDA" } : {}), justifyContent: "center" }}
                    onClick={() => registerInterest(startup)}
                  >
                    {interestReg[startup.id] ? "Interest Registered" : "Register Investor Interest"}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ ...(bookmarked[startup.id] ? { background: "#F5D94E" } : {}), justifyContent: "center" }}
                    onClick={() => toggleBookmark(startup.id)}
                  >
                    {bookmarked[startup.id] ? "Saved" : "Bookmark"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`https://${startup.github}`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                    <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
                      GitHub ↗
                    </button>
                  </a>
                  <a href={`https://${startup.demo}`} target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                    <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center", fontSize: 11 }}>
                      Demo ↗
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </WindowCard>
        ))}

        <WindowCard label="LIST_YOUR_STARTUP.SYS" bodyClass="window-body window-body-yellow" style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 8 }}>List Your Startup</h3>
              <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, maxWidth: 500 }}>
                Research-backed startups can list on the Startup Marketplace to reach AthenaX investors, terminal subscribers, and developer
                communities. ARS-scored founders get priority placement.
              </p>
            </div>
            <Link href="/sponsor-onboarding" className="btn btn-primary" style={{ textDecoration: "none" }}>
              Apply to List →
            </Link>
          </div>
        </WindowCard>
      </div>
    </div>
  );
};

export default TechMarketplacePage;
