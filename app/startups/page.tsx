"use client";

import { useState } from "react";
import Link from "next/link";
import { SEED_PAPERS, SEED_STARTUPS } from "@/data/seed";
import { IconPaperSmall } from "@/components/Icons";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";

type SortKey = "investorInterest" | "votes" | "developerViews" | "githubStars";

const SECTORS = ["All", "AI & Agents", "Robotics", "Biotech", "Crypto & DeFi", "Developer Tools", "Infrastructure"];
const SORTS: [SortKey, string][] = [
  ["investorInterest", "⬡ Investor Interest"],
  ["votes", "▲ Top Voted"],
  ["developerViews", "👁 Developer Interest"],
  ["githubStars", "★ GitHub Stars"],
];

export default function Page() {
  const { user, showToast } = useGlobal();
  const [sector, setSector] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("investorInterest");
  const [interestReg, setInterestReg] = useState<Record<string, boolean>>({});
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});

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
    <div className="section page-wrap">
      <div className="path-badge">/root/startups</div>
      <h1 className="mb-2 text-5xl">Startup Marketplace</h1>
      <p className="text-[17px] text-muted">
        Research-backed startups raising funding across frontier technology. Register investor interest, track research lineage, and discover founders
        before the market does.
      </p>
      <hr className="divider" />

      <div className="mb-7 grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Startups Listed", value: SEED_STARTUPS.length },
          { label: "Total Raising", value: "$1.4B+" },
          {
            label: "Avg. Founder ARS",
            value: (SEED_STARTUPS.reduce((sum, startup) => sum + startup.founders[0].ars, 0) / SEED_STARTUPS.length).toFixed(1),
          },
          { label: "Investor Intros Made", value: "142" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value text-xl">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-2.5 flex flex-wrap gap-2">
        {SECTORS.map((entry) => (
          <button
            key={entry}
            className={`${sector === entry ? "btn btn-ghost bg-yellow" : "btn btn-outline"} btn-sm`}
            onClick={() => setSector(entry)}
          >
            {entry}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap justify-end gap-2">
        {SORTS.map(([key, label]) => (
          <button
            key={key}
            className={`${sortBy === key ? "btn btn-ghost bg-yellow" : "btn btn-outline"} btn-sm text-xs`}
            onClick={() => setSortBy(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.map((startup) => (
        <WindowCard key={startup.id} label={`STARTUP: ${startup.name.toUpperCase().replace(/\s+/g, "-")}`} className="mb-4.5">
          <div className="flex flex-wrap gap-5">
            <div className="min-w-65 flex-1">
              <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                <h3 className="mb-0 text-[21px]">{startup.name}</h3>
                <span className="topic-pill">{startup.sector}</span>
                <span className="ftag bg-[#EAF0F6] text-[11px]">{startup.category}</span>
              </div>

              <p className="mb-3 text-[13px] leading-7 text-ink">{startup.desc}</p>

              <div className="mb-3">
                <div className="mb-1.5 font-mono text-[10px] tracking-[0.07em] text-muted">FOUNDERS</div>
                <div className="flex flex-wrap gap-2.5">
                  {startup.founders.map((founder) => (
                    <div key={founder.name} className="flex items-center gap-1.5 rounded-[7px] border border-ink bg-paper px-2.5 py-1.25">
                      <span className="text-[13px] font-semibold">{founder.name.split(" ").slice(-1)[0]}</span>
                      <span className="font-mono text-[11px] font-bold text-danger">ARS {founder.ars}</span>
                      <span className="text-[10px] text-muted">{founder.lab}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <div className="mb-1.5 font-mono text-[10px] tracking-[0.07em] text-muted">RESEARCH LINEAGE</div>
                {startup.researchLineage.map((title) => {
                  const paper = SEED_PAPERS.find((entry) => entry.title === title);
                  const content = (
                    <>
                      <IconPaperSmall />
                      <span className="ml-2 text-xs">
                        {title.slice(0, 65)}
                        {title.length > 65 ? "..." : ""}
                      </span>
                      {paper && <span className="ml-auto shrink-0 font-mono text-[11px] text-muted">{paper.citations} cites</span>}
                    </>
                  );

                  return paper ? (
                    <Link key={title} href={`/paper/${paper.id}`} className="archive-row mb-0.75 px-2.5 py-1.5 text-inherit no-underline">
                      {content}
                    </Link>
                  ) : (
                    <div key={title} className="archive-row mb-0.75 cursor-default px-2.5 py-1.5">
                      {content}
                    </div>
                  );
                })}
              </div>

              <div>
                <div className="mb-1.5 font-mono text-[10px] tracking-[0.06em] text-muted">CURRENT INVESTORS</div>
                <div className="flex flex-wrap gap-1.5">
                  {startup.investors.map((investor) => (
                    <span key={investor} className="ftag text-[11px]">
                      {investor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid min-w-50 shrink-0 gap-3">
              <WindowCard label="RAISE.SYS" bodyClass="window-body window-body-yellow">
                <div className="mb-1">
                  <div className="mb-1 font-mono text-[10px] text-muted">STAGE</div>
                  <div className="text-sm font-bold">{startup.stage}</div>
                </div>
                <div className={startup.valuation ? "mb-2" : ""}>
                  <div className="mb-1 font-mono text-[10px] text-muted">RAISING</div>
                  <div className="text-base font-bold text-danger">{startup.raisingAmount}</div>
                </div>
                {startup.valuation && (
                  <div>
                    <div className="mb-1 font-mono text-[10px] text-muted">VALUATION</div>
                    <div className="text-[13px] font-semibold">{startup.valuation}</div>
                  </div>
                )}
              </WindowCard>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Votes", value: startup.votes.toLocaleString(), color: "text-danger" },
                  { label: "GitHub ★", value: `+${startup.githubStars.toLocaleString()}`, color: "text-ink" },
                  { label: "Dev Views", value: startup.developerViews.toLocaleString(), color: "text-muted" },
                  { label: "Investors", value: startup.investorInterest + (interestReg[startup.id] ? 1 : 0), color: "text-[#15803D]" },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[7px] border border-[#D8D4CC] bg-white px-2.5 py-2">
                    <div className="mb-0.75 font-mono text-[9px] tracking-[0.05em] text-muted">{metric.label.toUpperCase()}</div>
                    <div className={`text-sm font-bold ${metric.color}`}>{metric.value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Link href={`/launch/${startup.launchId}`} className="btn btn-primary btn-sm justify-center no-underline">
                  View Startup →
                </Link>
                <button
                  className={`${interestReg[startup.id] ? "btn btn-ghost bg-success" : "btn btn-outline"} btn-sm justify-center`}
                  onClick={() => registerInterest(startup)}
                >
                  {interestReg[startup.id] ? "Interest Registered" : "Register Investor Interest"}
                </button>
                <button
                  className={`${bookmarked[startup.id] ? "btn btn-ghost bg-yellow" : "btn btn-ghost"} btn-sm justify-center`}
                  onClick={() => toggleBookmark(startup.id)}
                >
                  {bookmarked[startup.id] ? "Saved" : "Bookmark"}
                </button>
              </div>

              <div className="flex gap-2">
                <a href={`https://${startup.github}`} target="_blank" rel="noreferrer" className="flex-1">
                  <button className="btn btn-ghost btn-sm w-full justify-center text-[11px]">GitHub ↗</button>
                </a>
                <a href={`https://${startup.demo}`} target="_blank" rel="noreferrer" className="flex-1">
                  <button className="btn btn-ghost btn-sm w-full justify-center text-[11px]">Demo ↗</button>
                </a>
              </div>
            </div>
          </div>
        </WindowCard>
      ))}

      <WindowCard label="LIST_YOUR_STARTUP.SYS" bodyClass="window-body window-body-yellow" className="mt-3.5">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h3 className="mb-2 text-[22px]">List Your Startup</h3>
            <p className="max-w-125 text-[15px] leading-7 text-muted">
              Research-backed startups can list on the Startup Marketplace to reach AthenaX investors, terminal subscribers, and developer
              communities. ARS-scored founders get priority placement.
            </p>
          </div>
          <Link href="/sponsors/apply" className="btn btn-primary no-underline">
            Apply to List →
          </Link>
        </div>
      </WindowCard>
    </div>
  );
}
