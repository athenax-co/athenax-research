"use client";

import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta from "@/components/SEOMeta";
import { SEED_LAUNCHES } from "@/data/seed";
import { useGlobal } from "@/components/GlobalProvider";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { bookmarkSvc } from "@/utils/lib";

const calcLaunchScore = (l: any) =>
  (l.votes || 0) * 0.4 + (l.devViews || 0) * 0.0004 + (l.githubStars || 0) * 0.2 + (l.investorRegs || 0) * 2.0 + (l.papers?.length || 0) * 5.0;

export default function Page() {
  const { user, showToast } = useGlobal();
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [timeTab, setTimeTab] = useState("all");
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    name: "",
    url: "",
    sector: "AI & Agents",
    desc: "",
    github: "",
    tier: "standard",
    arsEmail: user?.email || "",
  });

  const SECTORS = ["All", "AI & Agents", "Robotics", "Biotech", "Crypto & DeFi", "Developer Tools", "Infrastructure", "Climate & Energy"];
  const TIME_TABS = [
    ["all", "All"],
    ["week", "This Week"],
    ["month", "This Month"],
  ];

  const todayCount = SEED_LAUNCHES.filter((l) => l.launchedToday).length;
  const timeFiltered = timeTab === "all" ? SEED_LAUNCHES : timeTab === "week" ? SEED_LAUNCHES.slice(0, 5) : SEED_LAUNCHES;
  const filtered = (filter === "All" ? timeFiltered : timeFiltered.filter((l) => l.sector === filter)).sort((a, b) => {
    if (sortBy === "score") return calcLaunchScore(b) - calcLaunchScore(a);
    if (sortBy === "votes") return b.votes - a.votes;
    if (sortBy === "devViews") return b.devViews - a.devViews;
    if (sortBy === "investorRegs") return b.investorRegs - a.investorRegs;
    if (sortBy === "papers") return b.papers.length - a.papers.length;
    if (sortBy === "new") return b.founded.localeCompare(a.founded);
    return 0;
  });

  const submitLaunch = () => {
    if (!submitForm.name || !submitForm.url) {
      showToast("Product name and URL are required.", "error");
      return;
    }
    showToast(`${submitForm.name} launch submitted! We'll review within 48 hours.`, "success");
    setShowSubmit(false);
  };

  return (
    <div>
      <div className="page-wrap section">
        <SEOMeta
          title="AthenaX Launch — Research-Backed Products Across Frontier Technology"
          description="Discover research-backed products across AI, robotics, biotech, crypto, and infrastructure. Every founder is ARS-scored. Every product is grounded in indexed research."
        />
        <div className="path-badge">/root/launch</div>

        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="mb-1 text-[48px]">AthenaX Launch</h1>
            <span className="status-badge mb-0">
              <div className="status-dot" />
              {todayCount} Launched Today · {SEED_LAUNCHES.length} This Month
            </span>
          </div>
          <button
            className="btn btn-primary self-start"
            onClick={() => {
              if (!user) {
                showToast("Sign in to submit a launch.", "error");
                return;
              }
              setShowSubmit(true);
            }}
          >
            + Submit Your Product
          </button>
        </div>

        <p className="mb-0 text-[17px] text-muted">
          Research-backed products launching across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate. Every founder is
          ARS-scored. Every product is grounded in indexed research.
        </p>
        <hr className="divider" />

        <div className="mb-7 grid grid-cols-4 gap-3.5">
          {[
            { label: "Launches This Month", value: SEED_LAUNCHES.length },
            { label: "Total Funding Raised", value: "$18.4M" },
            { label: "Avg. Founder ARS", value: "7.3" },
            { label: "Investor Intros Made", value: "142" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value text-[20px]">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-2 border-b-2 border-b-[#1C1C27] pb-2.5">
          {TIME_TABS.map(([k, l]) => (
            <button
              key={k}
              className={timeTab === k ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={timeTab === k ? { background: "#F5D94E" } : {}}
              onClick={() => setTimeTab(k)}
            >
              {l} {k === "all" ? `(${SEED_LAUNCHES.length})` : ""}
            </button>
          ))}
          <span className="ml-auto self-center font-['Space_Mono',monospace] text-xs text-muted">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mb-2.5 flex flex-wrap gap-2">
          {SECTORS.map((c) => (
            <button
              key={c}
              className={filter === c ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={filter === c ? { background: "#F5D94E" } : {}}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.map((launch) => (
          <div key={launch.id} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5">
            <div className="flex flex-wrap gap-5">
              <div className="min-w-65 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="mb-0 text-[21px]">
                    <Link href={`/launch/${launch.id}`} className="cursor-pointer text-inherit no-underline">
                      {launch.name}
                    </Link>
                  </h3>
                  <span className="topic-pill">{launch.sector}</span>
                  <span className="ftag bg-[#EAF0F6] text-[10px]">{launch.qualityBadge}</span>
                  {launch.launchedToday && <span className="ftag bg-success text-[10px] font-bold">✦ Today</span>}
                </div>
                <p className="mb-2.5 text-[13px] leading-[1.6] text-[#1C1C27]">{launch.desc}</p>

                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  {launch.founders.map((f) => (
                    <span key={f.name} className="flex items-center gap-1 text-xs text-muted">
                      <span className="font-['Space_Mono',monospace] font-bold text-[#E8323C]">ARS {f.ars}</span>
                      {f.name.split(" ").slice(-1)[0]}
                    </span>
                  ))}
                  <span className="text-xs text-muted">·</span>
                  <span className="text-xs text-muted">{launch.category}</span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="font-['Space_Mono',monospace] text-xs font-bold text-[#E8323C]">▲ {launch.votes.toLocaleString()}</span>
                  <span className="text-xs text-muted">💬 {launch.comments.length}</span>
                  <span className="text-xs text-muted">★ {Math.max(bookmarkSvc.count(launch.id), Math.floor(launch.votes * 0.08))}</span>
                  <span className="ftag bg-[#EAF0F6] text-[10px]">{launch.qualityBadge}</span>
                </div>
              </div>

              <div className="flex min-w-30 shrink-0 flex-col justify-start gap-1.5">
                <span className="ftag bg-[#EAF0F6] text-center text-[11px]">
                  {launch.stage} · {launch.funding}
                </span>
                <Link href={`/launch/${launch.id}`} className="btn btn-primary btn-sm justify-center no-underline">
                  View →
                </Link>
                <BookmarkButton user={user} launch={launch} showToast={showToast} size="sm" />
              </div>
            </div>
          </div>
        ))}

        <WindowCard label="LAUNCH_TIERS.SYS" className="mt-7">
          <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">LAUNCH PROMOTION TIERS</div>
          <div className="mb-5 grid grid-cols-4 gap-3.5">
            {[
              {
                tier: "Standard",
                price: "Free",
                highlight: false,
                perks: ["Public listing", "ARS badge", "Archive indexing", "Research lineage display"],
              },
              {
                tier: "Verified",
                price: "$2,000",
                highlight: false,
                perks: ["Everything in Standard", "Featured 48 hours", "Researcher network blast", "Slug: /launch/your-product"],
              },
              {
                tier: "Premier",
                price: "$7,500",
                highlight: true,
                perks: ["Everything in Verified", "Investor intro email blast", "Terminal featured slot", "Cohort alumni spotlight"],
              },
              {
                tier: "Homepage",
                price: "$15,000",
                highlight: false,
                perks: ["Everything in Premier", "Homepage placement 7 days", "Newsletter promotion", "Weekly Digest feature"],
              },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-[10px] border-2 border-[#1C1C27] p-4"
                style={{
                  background: t.highlight ? "#F9F5DC" : "#fff",
                  boxShadow: t.highlight ? "3px 3px 0 #1C1C27" : "none",
                }}
              >
                <div className="mb-1 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">{t.tier.toUpperCase()}</div>
                <div className="mb-3" style={{ fontSize: 22, fontWeight: 700, color: t.highlight ? "#E8323C" : "#1C1C27" }}>
                  {t.price}
                </div>
                {t.perks.map((p) => (
                  <div key={p} className="mb-1.25 flex items-start gap-1.5 text-xs">
                    <span className="shrink-0 font-bold text-[#4CAF50]">✓</span>
                    {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!user) {
                  showToast("Sign in to submit a launch.", "error");
                  return;
                }
                setShowSubmit(true);
              }}
            >
              Submit Your Launch →
            </button>
          </div>
        </WindowCard>

        {showSubmit && (
          <Modal title="SUBMIT_LAUNCH.SYS" onClose={() => setShowSubmit(false)}>
            <div className="inp-group">
              <label className="inp-label">Product Name</label>
              <input
                className="inp"
                value={submitForm.name}
                onChange={(e) => setSubmitForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. AxonOS"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Product URL / Demo</label>
              <input
                className="inp"
                value={submitForm.url}
                onChange={(e) => setSubmitForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://yourproduct.com"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">GitHub Repository</label>
              <input
                className="inp"
                value={submitForm.github}
                onChange={(e) => setSubmitForm((f) => ({ ...f, github: e.target.value }))}
                placeholder="github.com/you/repo"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Sector</label>
              <select className="inp" value={submitForm.sector} onChange={(e) => setSubmitForm((f) => ({ ...f, sector: e.target.value }))}>
                {["AI & Agents", "Robotics", "Biotech", "Crypto & DeFi", "Developer Tools", "Infrastructure", "Climate & Energy"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="inp-group">
              <label className="inp-label">One-line Description</label>
              <input
                className="inp"
                value={submitForm.desc}
                onChange={(e) => setSubmitForm((f) => ({ ...f, desc: e.target.value }))}
                placeholder="What does your product do?"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Launch Tier</label>
              <select className="inp" value={submitForm.tier} onChange={(e) => setSubmitForm((f) => ({ ...f, tier: e.target.value }))}>
                <option value="standard">Standard — Free</option>
                <option value="verified">Verified — $2,000 (featured 48h)</option>
                <option value="premier">Premier — $7,500 (investor blast)</option>
                <option value="homepage">Homepage — $15,000 (7-day placement)</option>
              </select>
            </div>
            <div className="mb-3.5 text-xs text-muted">Quality requirement: ARS-scored founder, indexed research paper, or cohort graduate.</div>
            <button className="btn btn-primary w-full justify-center" onClick={submitLaunch}>
              Submit Launch →
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
}
