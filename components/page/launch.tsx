// ═══════════════════════════════════════════════════════════
// LAUNCH DETAIL PAGE — individual startup page

import { SEED_LAUNCHES, SEED_PAPERS } from "@/data/seed";
import { useState } from "react";
import WindowCard from "../ui/WindowCard";
import BookmarkButton from "../BookmarkButton";
import SEOMeta, { toSlug } from "../SEOMeta";
import { IconPaperSmall } from "../Icons";
import Footer from "../Footer";
import { bookmarkSvc } from "@/utils/lib";
import Modal from "../ui/Modal";

// ── Launch ranking score (weighted signals) ────────────────────────────
const calcLaunchScore = (l: {
  id?: string;
  name?: string;
  sector?: string;
  category?: string;
  stage?: string;
  funding?: string;
  founded?: string;
  votes: any;
  devViews: any;
  githubStars: any;
  investorRegs: any;
  comments?: { user: string; text: string }[];
  founders?: { name: string; ars: number; lab: string }[];
  papers: any;
  desc?: string;
  github?: string;
  demo?: string;
  tags?: string[];
  sponsors?: string[];
  rolesOpen?: number;
  rolesFilledViaAthenaX?: number;
  qualityBadge?: string;
  launchedToday?: boolean;
  status?: string;
}) =>
  (l.votes || 0) * 0.4 +
  (l.devViews || 0) * 0.0004 + // scale devViews (thousands) to match vote range
  (l.githubStars || 0) * 0.2 +
  (l.investorRegs || 0) * 2.0 + // high signal weight
  (l.papers?.length || 0) * 5.0; // research depth bonus

// ═══════════════════════════════════════════════════════════
const LaunchDetailPage = ({
  launchId,
  setPage,
  user,
  showToast,
}: {
  launchId: string;
  setPage: (page: string) => void;
  user: any;
  showToast: (message: string, type: string) => void;
}) => {
  const launch = SEED_LAUNCHES.find((l) => l.id === launchId);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(launch?.votes || 0);

  if (!launch)
    return (
      <div className="page-wrap section">
        <p>Launch not found.</p>
        <button className="link-arrow" onClick={() => setPage("launch")}>
          ← Back to Launch
        </button>
      </div>
    );

  const handleVote = () => {
    if (!user) {
      showToast("Sign in to upvote.", "error");
      return;
    }
    if (voted) {
      showToast("Already upvoted.", "info");
      return;
    }
    setVoted(true);
    setVoteCount((v) => v + 1);
    showToast(`Upvoted ${launch.name}!`, "success");
  };

  const linkedPapers = SEED_PAPERS.filter((p) => launch.papers.includes(p.title));

  return (
    <div>
      <div className="page-wrap section">
        <SEOMeta
          title={`${launch.name} — ${launch.category} | AthenaX Launch`}
          description={`${launch.name} launched on AthenaX. Built by ARS-scored researchers. ${launch.desc.slice(0, 120)}`}
          type="product"
        />
        <button className="link-arrow" onClick={() => setPage("launch")} style={{ marginBottom: 20 }}>
          ← Back to Launch
        </button>
        <div className="path-badge">/root/launch/{toSlug(launch.name)}</div>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              border: "2px solid #1C1C27",
              background: "#F9F5DC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {launch.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
              <h1 style={{ fontSize: 36, marginBottom: 0 }}>{launch.name}</h1>
              <span className="topic-pill">{launch.category}</span>
              <span className="ftag" style={{ background: launch.stage === "Seed" ? "#D4EDDA" : "#EAF0F6" }}>
                {launch.stage}
              </span>
              <span className="ftag" style={{ background: "#F9F5DC", color: "#15803D", fontWeight: 700 }}>
                {launch.funding}
              </span>
            </div>
            <p style={{ fontSize: 16, color: "#6B6B7A", lineHeight: 1.6 }}>{launch.desc}</p>
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <button
              className={voted ? "btn btn-ghost" : "btn btn-outline"}
              style={{ ...(voted ? { background: "#D4EDDA" } : {}), flexDirection: "column", padding: "14px 22px" }}
              onClick={handleVote}
            >
              <div style={{ fontSize: 22, lineHeight: 1 }}>▲</div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: "#E8323C", marginTop: 4 }}>
                {voteCount.toLocaleString()}
              </div>
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11, padding: "5px 10px" }}
              onClick={() => {
                navigator.clipboard && navigator.clipboard.writeText(`${launch.name} | athenax.io/launch/${toSlug(launch.name)}`);
                showToast("Link copied!", "success");
              }}
            >
              ⬡ Share
            </button>
          </div>
        </div>

        <hr className="divider" />

        <div className="grid-2" style={{ gap: 22 }}>
          {/* Left column */}
          <div>
            {/* Research lineage */}
            <WindowCard label="RESEARCH_LINEAGE.SYS" style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 12 }}>
                THIS PRODUCT IS BUILT ON
              </div>
              {linkedPapers.length > 0 ? (
                linkedPapers.map((p) => (
                  <div key={p.id} className="archive-row" style={{ marginBottom: 8, cursor: "pointer" }} onClick={() => setPage(`paper:${p.id}`)}>
                    <IconPaperSmall />
                    <div style={{ flex: 1, marginLeft: 8 }}>
                      <div className="archive-title" style={{ fontSize: 13 }}>
                        {p.title}
                      </div>
                      <div className="archive-meta">
                        {p.year} // {p.topic} // {p.citations} cites
                      </div>
                    </div>
                    <span style={{ color: "#6B6B7A", fontSize: 14 }}>→</span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 13, color: "#6B6B7A" }}>Research lineage indexed. {launch.papers.join(", ")}</p>
              )}
            </WindowCard>

            {/* Tags + sponsors */}
            <WindowCard label="ECOSYSTEM.SYS" bodyClass="window-body window-body-blue" style={{ marginBottom: 22 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 8 }}>
                  RESEARCH AREAS
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {launch.tags.map((t) => (
                    <button
                      key={t}
                      className="topic-pill"
                      style={{ cursor: "pointer", border: "none", fontFamily: "'Space Grotesk',sans-serif" }}
                      onClick={() => setPage(`terminal:topic:${t}`)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="divider-sm" />
              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 8 }}>
                  INFRASTRUCTURE SPONSORS
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {launch.sponsors.map((s) => (
                    <span key={s} className="ftag" style={{ background: "#fff" }}>
                      ✦ {s}
                    </span>
                  ))}
                </div>
              </div>
            </WindowCard>

            {/* Links */}
            <WindowCard label="LINKS.SYS">
              {[
                { label: "GitHub Repository", url: launch.github, color: "#1C1C27" },
                { label: "Live Demo", url: launch.demo, color: "#E8323C" },
              ].map((l) => (
                <div
                  key={l.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #D8D4CC",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{l.label}</span>
                  <a
                    href={`https://${l.url}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: l.color }}
                  >
                    ↗ {l.url}
                  </a>
                </div>
              ))}
            </WindowCard>
          </div>

          {/* Right column */}
          <div>
            {/* Founders */}
            <WindowCard label="FOUNDERS.SYS" style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                ARS-VERIFIED FOUNDERS
              </div>
              {launch.founders.map((f) => (
                <div key={f.name} className="lb-row" style={{ cursor: "pointer", padding: "12px 0" }} onClick={() => setPage("researchers")}>
                  <div className="lb-avatar" style={{ width: 40, height: 40, fontSize: 15 }}>
                    {f.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="lb-name">{f.name}</div>
                    <div className="lb-meta">{f.lab}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 14, fontWeight: 700, color: "#E8323C" }}>ARS {f.ars}</div>
                  </div>
                </div>
              ))}
            </WindowCard>

            {/* Metrics */}
            <WindowCard label="METRICS.SYS" style={{ marginBottom: 22 }}>
              <div className="grid-2" style={{ gap: 12 }}>
                {[
                  { label: "Launch Votes", value: voteCount.toLocaleString() },
                  { label: "Funding", value: launch.funding },
                  { label: "Stage", value: launch.stage },
                  { label: "Founded", value: launch.founded },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value" style={{ fontSize: 18 }}>
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            </WindowCard>

            {/* Investor + talent CTAs */}
            <WindowCard label="ACTIONS.SYS" bodyClass="window-body window-body-yellow">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  className="btn btn-primary"
                  style={{ justifyContent: "center" }}
                  onClick={() => {
                    showToast("Investor interest registered. Founders will be notified.", "success");
                  }}
                >
                  ★ Register Investor Interest
                </button>
                <BookmarkButton user={user} launch={launch} showToast={showToast} size="sm" />
                <button className="btn btn-outline" style={{ justifyContent: "center", marginTop: 4 }} onClick={() => setPage("talent")}>
                  Startup Marketplace →
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }} onClick={() => setPage("terminal")}>
                  Research in Terminal →
                </button>
              </div>
            </WindowCard>

            {/* B2B: Developer Activity */}
            <WindowCard label="DEVELOPER_ACTIVITY.SYS" style={{ marginTop: 20 }} bodyClass="window-body window-body-blue">
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 12 }}>
                SINCE LAUNCH
              </div>
              {[
                { label: "Developer views", value: launch.devViews?.toLocaleString() || "—" },
                { label: "GitHub stars gained", value: `+${launch.githubStars || 0}` },
                { label: "Bookmarks", value: Math.floor((launch.votes || 0) * 0.4) },
                { label: "Discussion comments", value: launch.comments?.length || 0 },
              ].map((r) => (
                <div
                  key={r.label}
                  style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #D8D4CC", fontSize: 13 }}
                >
                  <span style={{ color: "#6B6B7A" }}>{r.label}</span>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{r.value}</span>
                </div>
              ))}
              <a href={`https://${launch.github}`} target="_blank" rel="noreferrer" style={{ display: "block", marginTop: 12 }}>
                <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                  ⌥ View on GitHub →
                </button>
              </a>
              <a href={`https://${launch.demo}`} target="_blank" rel="noreferrer">
                <button className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                  ↗ Try This Product →
                </button>
              </a>
            </WindowCard>

            {/* B2B: Talent Pipeline */}
            <WindowCard label="TALENT_PIPELINE.SYS" style={{ marginTop: 20 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 12 }}>
                HIRING VIA ATHENAX
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: "#6B6B7A" }}>Open roles</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{launch.rolesOpen || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 13 }}>
                <span style={{ color: "#6B6B7A" }}>Filled via AthenaX</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "#15803D" }}>{launch.rolesFilledViaAthenaX || 0}</span>
              </div>
              <button className="btn btn-outline btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPage("talent")}>
                Browse All Startups →
              </button>
              {user && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
                  onClick={() => showToast("Joining team interest registered!", "success")}
                >
                  + Express Interest in Joining
                </button>
              )}
            </WindowCard>

            {/* B2B: Investor Signals */}
            <WindowCard label="INVESTOR_SIGNALS.SYS" style={{ marginTop: 20 }} bodyClass="window-body window-body-yellow">
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 12 }}>
                INVESTOR ACTIVITY
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: "#6B6B7A" }}>Interest registrations</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700, color: "#E8323C" }}>{launch.investorRegs || 0}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 13 }}>
                <span style={{ color: "#6B6B7A" }}>Terminal subscribers watching</span>
                <span style={{ fontFamily: "'Space Mono',monospace", fontWeight: 700 }}>{Math.floor((launch.investorRegs || 0) * 1.4)}</span>
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => showToast("Investor interest registered. Founders will be notified.", "success")}
              >
                ★ Register Investor Interest
              </button>
            </WindowCard>
          </div>
        </div>

        {/* Discussion */}
        <div style={{ marginTop: 32 }}>
          <WindowCard label="DISCUSSION.SYS">
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 16 }}>
              {launch.comments?.length || 0} COMMENTS — DEVELOPER & RESEARCHER DISCUSSION
            </div>
            {(launch.comments || []).map((c, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid #D8D4CC", display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#EAF0F6",
                    border: "1.5px solid #1C1C27",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {c.user.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontFamily: "'Space Mono',monospace", color: "#6B6B7A", marginBottom: 4 }}>{c.user}</div>
                  <div style={{ fontSize: 14, color: "#1C1C27", lineHeight: 1.6 }}>{c.text}</div>
                </div>
              </div>
            ))}
            {user ? (
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                <input className="inp" style={{ flex: 1, padding: "8px 12px", fontSize: 13 }} placeholder="Add a technical comment or question…" />
                <button className="btn btn-primary btn-sm" onClick={() => showToast("Comment posted!", "success")}>
                  Post
                </button>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: "#6B6B7A", marginTop: 12 }}>Sign in to join the discussion.</p>
            )}
          </WindowCard>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LAUNCH PAGE — AthenaX startup discovery platform
// ═══════════════════════════════════════════════════════════
const TOPIC_META = {
  "ai-agents": { label: "AI & Agents", desc: "Autonomous AI agents, multi-agent systems, and LLM orchestration frameworks.", sector: "AI & Agents" },
  robotics: { label: "Robotics", desc: "Robotic manipulation, locomotion, perception, and autonomous systems research.", sector: "Robotics" },
  biotech: {
    label: "Biotech",
    desc: "Synthetic biology, computational genomics, AI-assisted drug discovery, and CRISPR tooling.",
    sector: "Biotech",
  },
  crypto: {
    label: "Crypto & DeFi",
    desc: "Zero-knowledge proofs, decentralized protocols, and blockchain infrastructure research.",
    sector: "Crypto & DeFi",
  },
  devtools: {
    label: "Developer Tools",
    desc: "AI-powered developer tooling, evaluation frameworks, code generation, and LLM APIs.",
    sector: "Developer Tools",
  },
  infrastructure: {
    label: "Infrastructure",
    desc: "GPU clusters, distributed training, ML scheduling, and hyperscale compute systems.",
    sector: "Infrastructure",
  },
  climate: {
    label: "Climate & Energy",
    desc: "Carbon intelligence, climate modeling, clean energy systems, and sustainability platforms.",
    sector: "Climate & Energy",
  },
};

const LaunchPage = ({
  setPage,
  user,
  showToast,
}: {
  setPage: (page: string) => void;
  user: any;
  showToast: (message: string, type: string) => void;
}) => {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [timeTab, setTimeTab] = useState("month"); // "today"|"week"|"month"
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
  const SORTS = [
    ["score", "⬡ Ranked"],
    ["votes", "▲ Top"],
    ["new", "New"],
    ["devViews", "Developer Interest"],
    ["investorRegs", "Investor Interest"],
    ["papers", "Research Depth"],
  ];
  const TIME_TABS = [
    ["today", "Today"],
    ["week", "This Week"],
    ["month", "This Month"],
  ];

  const todayCount = SEED_LAUNCHES.filter((l) => l.launchedToday).length;

  // Time filtering (demo: "today" = launchedToday, "week" = first 4, "month" = all)
  const timeFiltered =
    timeTab === "today" ? SEED_LAUNCHES.filter((l) => l.launchedToday) : timeTab === "week" ? SEED_LAUNCHES.slice(0, 5) : SEED_LAUNCHES;

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
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: 48, marginBottom: 4 }}>AthenaX Launch</h1>
            <span className="status-badge" style={{ marginBottom: 0 }}>
              <div className="status-dot" />
              {todayCount} Launched Today · {SEED_LAUNCHES.length} This Month
            </span>
          </div>
          <button
            className="btn btn-primary"
            style={{ alignSelf: "flex-start" }}
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
        <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>
          Research-backed products launching across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate. Every founder is
          ARS-scored. Every product is grounded in indexed research.
        </p>
        <hr className="divider" />

        {/* Stats strip */}
        <div className="grid-4" style={{ gap: 14, marginBottom: 28 }}>
          {[
            { label: "Launches This Month", value: SEED_LAUNCHES.length },
            { label: "Total Funding Raised", value: "$18.4M" },
            { label: "Avg. Founder ARS", value: "7.3" },
            { label: "Investor Intros Made", value: "142" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: 20 }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Time tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid #1C1C27", paddingBottom: 10 }}>
          {TIME_TABS.map(([k, l]) => (
            <button
              key={k}
              className={timeTab === k ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={timeTab === k ? { background: "#F5D94E" } : {}}
              onClick={() => setTimeTab(k)}
            >
              {l} {k === "today" && todayCount > 0 ? `(${todayCount})` : ""}
            </button>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#6B6B7A", alignSelf: "center", fontFamily: "'Space Mono',monospace" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Sector filter bar */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
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

        {/* Sort bar */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, justifyContent: "flex-end" }}>
          {SORTS.map(([k, l]) => (
            <button
              key={k}
              className={sortBy === k ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={sortBy === k ? { background: "#F5D94E" } : { fontSize: 12 }}
              onClick={() => setSortBy(k)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Launch listings */}
        {filtered.map((launch) => (
          <div key={launch.id} style={{ borderBottom: "2px solid #D8D4CC", padding: "20px 0", marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {/* Left: main info */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 21, marginBottom: 0, cursor: "pointer" }} onClick={() => setPage(`launch-detail:${launch.id}`)}>
                    {launch.name}
                  </h3>
                  <span className="topic-pill">{launch.sector}</span>
                  <span className="ftag" style={{ background: "#EAF0F6", fontSize: 10 }}>
                    {launch.qualityBadge}
                  </span>
                  {launch.launchedToday && (
                    <span className="ftag" style={{ background: "#D4EDDA", fontSize: 10, fontWeight: 700 }}>
                      ✦ Today
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#1C1C27", lineHeight: 1.6, marginBottom: 10 }}>{launch.desc}</p>

                {/* Founders */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                  {launch.founders.map((f) => (
                    <span key={f.name} style={{ fontSize: 12, color: "#6B6B7A", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontWeight: 700, color: "#E8323C", fontFamily: "'Space Mono',monospace" }}>ARS {f.ars}</span>
                      {f.name.split(" ").slice(-1)[0]}
                    </span>
                  ))}
                  <span style={{ fontSize: 12, color: "#6B6B7A" }}>·</span>
                  <span style={{ fontSize: 12, color: "#6B6B7A" }}>{launch.category}</span>
                </div>

                {/* Primary signals only — secondary signals live in Launch Detail */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#E8323C" }}>
                    ▲ {launch.votes.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 12, color: "#6B6B7A" }}>💬 {launch.comments.length}</span>
                  <span style={{ fontSize: 12, color: "#6B6B7A" }}>★ {Math.max(bookmarkSvc.count(launch.id), Math.floor(launch.votes * 0.08))}</span>
                  <span className="ftag" style={{ background: "#EAF0F6", fontSize: 10 }}>
                    {launch.qualityBadge}
                  </span>
                </div>
              </div>

              {/* Right: lean CTAs */}
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 6, justifyContent: "flex-start", minWidth: 120 }}>
                <span className="ftag" style={{ background: launch.stage === "Seed" ? "#D4EDDA" : "#EAF0F6", textAlign: "center", fontSize: 11 }}>
                  {launch.stage} · {launch.funding}
                </span>
                <button className="btn btn-primary btn-sm" style={{ justifyContent: "center" }} onClick={() => setPage(`launch-detail:${launch.id}`)}>
                  View →
                </button>
                <BookmarkButton user={user} launch={launch} showToast={showToast} size="sm" />
              </div>
            </div>
          </div>
        ))}

        {/* Promo tiers */}
        <WindowCard label="LAUNCH_TIERS.SYS" style={{ marginTop: 28 }}>
          <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 16 }}>
            LAUNCH PROMOTION TIERS
          </div>
          <div className="grid-4" style={{ gap: 14, marginBottom: 20 }}>
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
                style={{
                  padding: "16px",
                  border: "2px solid #1C1C27",
                  borderRadius: 10,
                  background: t.highlight ? "#F9F5DC" : "#fff",
                  boxShadow: t.highlight ? "3px 3px 0 #1C1C27" : "none",
                }}
              >
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 4 }}>
                  {t.tier.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: t.highlight ? "#E8323C" : "#1C1C27", marginBottom: 12 }}>{t.price}</div>
                {t.perks.map((p) => (
                  <div key={p} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5, fontSize: 12 }}>
                    <span style={{ color: "#4CAF50", fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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

        {/* Submit Launch modal */}
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
            <div style={{ fontSize: 12, color: "#6B6B7A", marginBottom: 14 }}>
              Quality requirement: ARS-scored founder, indexed research paper, or cohort graduate.
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={submitLaunch}>
              Submit Launch →
            </button>
          </Modal>
        )}
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

export default LaunchPage;
export { LaunchDetailPage };
