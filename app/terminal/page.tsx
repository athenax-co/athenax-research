"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import { SEED_LABS, SEED_PAPERS, SEED_RESEARCHERS, SEED_SPONSORS } from "@/data/seed";
import { MediaIcon, IconLabsSmall } from "@/components/Icons";
import { calcARS } from "@/lib/db-helper";
import { useGlobal } from "@/components/GlobalProvider";
import { useSearchParams } from "next/navigation";

type SearchResult =
  | { kind: "paper"; item: (typeof SEED_PAPERS)[0] }
  | { kind: "lab"; item: (typeof SEED_LABS)[0] }
  | { kind: "researcher"; item: (typeof SEED_RESEARCHERS)[0] };

export default function Page() {
  const { user, showToast } = useGlobal();
  const searchParams = useSearchParams();
  const initialQueryRef = useRef(searchParams.get("q") ?? "");
  const initialQuery = initialQueryRef.current;

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [activeProto, setActiveProto] = useState("Ethereum");
  const [cmdInput, setCmdInput] = useState("");
  const [cmdLog, setCmdLog] = useState(["> AthenaX Research Terminal v2.0", "> Type 'help' for available commands."]);
  const [tab, setTab] = useState(initialQuery ? "search" : "search");

  // ── auto-run initialQuery on mount ─────────────────────
  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
  }, []);

  // ── search ──────────────────────────────────────────────
  const runSearch = (raw?: string): void => {
    const q = (raw || query).trim().toLowerCase();
    if (!q) return;
    let hits: SearchResult[] = [];
    if (q.startsWith("topic:")) {
      const t = q.replace("topic:", "").trim();
      hits = SEED_PAPERS.filter((p) => p.topic.toLowerCase().includes(t)).map((p) => ({ kind: "paper" as const, item: p }));
    } else if (q.startsWith("lab:")) {
      const l = q.replace("lab:", "").trim();
      hits = SEED_LABS.filter((x) => x.name.toLowerCase().includes(l)).map((x) => ({ kind: "lab" as const, item: x }));
    } else if (q.startsWith("researcher:")) {
      const r = q.replace("researcher:", "").trim();
      hits = SEED_RESEARCHERS.filter((x) => x.name.toLowerCase().includes(r)).map((x) => ({ kind: "researcher" as const, item: x }));
    } else {
      const pHits = SEED_PAPERS.filter(
        (p) => p.title.toLowerCase().includes(q) || p.topic.toLowerCase().includes(q) || p.authors.join(" ").toLowerCase().includes(q)
      ).map((p) => ({ kind: "paper" as const, item: p }));
      const lHits = SEED_LABS.filter((x) => x.name.toLowerCase().includes(q) || x.tags.join(" ").toLowerCase().includes(q)).map((x) => ({
        kind: "lab" as const,
        item: x,
      }));
      const rHits = SEED_RESEARCHERS.filter((x) => x.name.toLowerCase().includes(q)).map((x) => ({ kind: "researcher" as const, item: x }));
      hits = [...pHits, ...lHits, ...rHits];
    }
    setResults(hits);
  };

  // ── terminal cmd ────────────────────────────────────────
  const runCmd = (raw: string): void => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    const log = (lines: string[]): void => setCmdLog((p) => [...p.slice(-40), ...lines]);
    if (c === "help") {
      log([
        "> Commands:",
        "  search <query>    — full-text search",
        "  topic <name>      — filter by topic",
        "  lab <name>        — filter by lab",
        "  researcher <name> — find researcher",
        "  top papers        — highest cited",
        "  top topics        — most covered",
        "  top researchers   — highest ARS",
        "  clear             — clear log",
      ]);
    } else if (c === "clear") {
      setCmdLog(["> Terminal cleared."]);
    } else if (c === "top papers") {
      const top = [...SEED_PAPERS].sort((a, b) => b.citations - a.citations).slice(0, 3);
      log(["> Top 3 papers by citations:", ...top.map((p) => `  [${p.citations} cites] ${p.title.slice(0, 50)}`)]);
      setResults(top.map((p) => ({ kind: "paper" as const, item: p })));
      setTab("search");
    } else if (c === "top topics") {
      const tm: Record<string, number> = {};
      SEED_PAPERS.forEach((p) => {
        tm[p.topic] = (tm[p.topic] || 0) + 1;
      });
      const top = Object.entries(tm)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      log(["> Top topics by paper count:", ...top.map(([t, n]) => `  ${t}: ${n} papers`)]);
    } else if (c === "top researchers") {
      const top = [...SEED_RESEARCHERS].sort((a, b) => calcARS(b) - calcARS(a)).slice(0, 3);
      log(["> Top 3 researchers by ARS:", ...top.map((r) => `  ARS ${calcARS(r).toFixed(1)} — ${r.name}`)]);
      setResults(top.map((r) => ({ kind: "researcher" as const, item: r })));
      setTab("search");
    } else if (c.startsWith("topic ")) {
      const t = c.slice(6).trim();
      const hits = SEED_PAPERS.filter((p) => p.topic.toLowerCase().includes(t));
      log([`> ${hits.length} paper(s) on "${t}".`, ...hits.map((p) => `  ${p.title.slice(0, 50)}`)]);
      setResults(hits.map((p) => ({ kind: "paper" as const, item: p })));
      setTab("search");
    } else if (c.startsWith("lab ")) {
      const l = c.slice(4).trim();
      const hits = SEED_LABS.filter((x) => x.name.toLowerCase().includes(l));
      log([`> ${hits.length} lab(s) matching "${l}".`, ...hits.map((x) => `  ${x.name} — ${x.focus}`)]);
      setResults(hits.map((x) => ({ kind: "lab" as const, item: x })));
      setTab("search");
    } else if (c.startsWith("researcher ")) {
      const r = c.slice(11).trim();
      const hits = SEED_RESEARCHERS.filter((x) => x.name.toLowerCase().includes(r));
      log([`> ${hits.length} researcher(s) matching "${r}".`, ...hits.map((x) => `  ARS ${calcARS(x).toFixed(1)} — ${x.name}, ${x.university}`)]);
      setResults(hits.map((x) => ({ kind: "researcher" as const, item: x })));
      setTab("search");
    } else if (c.startsWith("search ")) {
      const sq = c.slice(7).trim();
      setQuery(sq);
      runSearch(sq);
      setTab("search");
      log([`> Searching for "${sq}"…`]);
    } else {
      log([`> Unknown command: "${c}". Type 'help'.`]);
    }
  };

  // ── trending data ────────────────────────────────────────
  const topPapers = [...SEED_PAPERS].sort((a, b) => b.citations - a.citations).slice(0, 4);
  const topResearchers = [...SEED_RESEARCHERS].sort((a, b) => calcARS(b) - calcARS(a)).slice(0, 4);
  const topicCounts: Record<string, number> = {};
  SEED_PAPERS.forEach((p) => {
    topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
  });
  const topTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

  // ── protocol intelligence ────────────────────────────────
  const PROTOCOLS = ["Ethereum", "Arbitrum", "EigenLayer", "Uniswap"];
  const protoData: Record<string, { papers: typeof SEED_PAPERS; labs: string[]; researchers: string[] }> = {
    Ethereum: {
      papers: SEED_PAPERS.filter((p) => p.lab === "Ethereum Foundation Research" || p.topic === "Protocol Economics"),
      labs: ["Ethereum Foundation Research", "MIT DCI"],
      researchers: ["Dankrad Feist", "Dr. James McCarthy"],
    },
    Arbitrum: {
      papers: SEED_PAPERS.filter((p) => p.topic === "DAO Governance" || p.topic === "Protocol Economics"),
      labs: ["Oxford Internet Institute"],
      researchers: ["Prof. Vili Lehdonvirta"],
    },
    EigenLayer: {
      papers: SEED_PAPERS.filter((p) => p.topic === "Protocol Economics" || p.topic === "ZK Proofs"),
      labs: ["Ethereum Foundation Research", "IF Labs"],
      researchers: ["Dankrad Feist", "Dr. Yuki Tanaka"],
    },
    Uniswap: {
      papers: SEED_PAPERS.filter((p) => p.topic === "DeFi" || p.topic === "Tokenomics"),
      labs: ["Stanford Blockchain", "MIT DCI"],
      researchers: ["Dr. Felix Chen", "Dr. James McCarthy"],
    },
  };
  const proto = protoData[activeProto] || { papers: [], labs: [], researchers: [] };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/terminal</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 48, marginBottom: 0 }}>Research Terminal</h1>
          <span className="status-badge" style={{ marginBottom: 0 }}>
            <div className="status-dot" />
            Live Data Feed
          </span>
        </div>
        <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>
          Query the AthenaX research knowledge graph. Protocol intelligence, researcher scores, trending topics.
        </p>
        <hr className="divider" />

        {/* ── Onboarding guide ── */}
        <WindowCard label="TERMINAL_GUIDE.SYS" bodyClass="window-body window-body-blue" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 10 }}>
                QUICK START — CLICK ANY EXAMPLE TO RUN
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "topic: zk proofs", q: "topic: zk proofs" },
                  { label: "researcher: Dankrad", q: "researcher: Dankrad" },
                  { label: "lab: MIT", q: "lab: MIT" },
                  { label: "top papers", q: "top papers" },
                  { label: "top researchers", q: "top researchers" },
                ].map((ex: { label: string; q: string }) => (
                  <button
                    key={ex.label}
                    className="ftag"
                    style={{ cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 11, border: "1.5px solid #1C1C27" }}
                    onClick={() => {
                      setTab("search");
                      if (ex.q === "top papers") {
                        setResults(topPapers.map((p) => ({ kind: "paper" as const, item: p })));
                        setQuery("top papers");
                        return;
                      }
                      if (ex.q === "top researchers") {
                        setResults(topResearchers.map((r) => ({ kind: "researcher" as const, item: r })));
                        setQuery("top researchers");
                        return;
                      }
                      setQuery(ex.q);
                      runSearch(ex.q);
                    }}
                  >
                    &gt; {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#6B6B7A", lineHeight: 1.8, flexShrink: 0 }}>
              <div>topic: &lt;name&gt; — filter papers</div>
              <div>lab: &lt;name&gt; — find a lab</div>
              <div>researcher: &lt;name&gt; — find researcher</div>
              <div>top papers / top researchers</div>
            </div>
          </div>
        </WindowCard>

        {/* ── Tab bar ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {[
            ["search", "Search"],
            ["trending", "Trending"],
            ["protocols", "Protocol Intel"],
            ["graph", "Graph Explorer"],
            ["access", "Terminal Access"],
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

        {/* ══════════════ SEARCH TAB ══════════════ */}
        {tab === "search" && (
          <div>
            {/* Search bar */}
            <WindowCard label=">_ QUERY.SYS" style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="inp"
                  style={{ flex: 1, fontFamily: "'Space Mono',monospace", fontSize: 13 }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="topic: zk proofs  |  lab: MIT  |  researcher: Vitalik  |  or free text…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                />
                <button className="btn btn-primary" onClick={() => runSearch()}>
                  Search →
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {["topic: ZK Proofs", "topic: DAO Governance", "lab: MIT", "researcher: Dankrad", "top papers"].map((s) => (
                  <button
                    key={s}
                    className="ftag"
                    style={{ cursor: "pointer", border: "1.5px solid #1C1C27" }}
                    onClick={() => {
                      if (s === "top papers") {
                        setResults(topPapers.map((p) => ({ kind: "paper" as const, item: p })));
                        return;
                      }
                      setQuery(s);
                      runSearch(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </WindowCard>

            {/* Results */}
            {results === null && (
              <WindowCard label="AWAITING_QUERY.SYS" bodyClass="window-body window-body-blue">
                <p style={{ color: "#6B6B7A", fontSize: 14, fontFamily: "'Space Mono',monospace" }}>
                  Enter a query above or use the quick filters to explore the research graph.
                </p>
              </WindowCard>
            )}
            {results !== null && results.length === 0 && (
              <WindowCard label="NO_RESULTS.SYS">
                <p style={{ color: "#6B6B7A", fontSize: 14 }}>No results matched your query. Try broader terms or a different prefix.</p>
              </WindowCard>
            )}
            {results !== null && results && results.length > 0 && (
              <div>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: "0.06em", color: "#6B6B7A", marginBottom: 12 }}>
                  {results.length} RESULT{results.length !== 1 ? "S" : ""}
                </div>
                {results.map((r: SearchResult, i: number) => {
                  if (r.kind === "paper")
                    return (
                      <Link key={i} href={`/paper/${r.item.id}`} className="archive-row" style={{ textDecoration: "none", color: "inherit" }}>
                        <MediaIcon type="Essay" />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span className="topic-pill" style={{ fontSize: 10, padding: "2px 8px" }}>
                              PAPER
                            </span>
                          </div>
                          <div className="archive-title">{r.item.title}</div>
                          <div className="archive-meta">
                            {r.item.year} // {r.item.topic} // {r.item.authors[0]}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#E8323C" }}>
                              {r.item.citations}
                            </div>
                            <div style={{ fontSize: 10, color: "#6B6B7A" }}>cites</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700 }}>{r.item.reviewScore}</div>
                            <div style={{ fontSize: 10, color: "#6B6B7A" }}>score</div>
                          </div>
                        </div>
                      </Link>
                    );
                  if (r.kind === "lab")
                    return (
                      <div key={i} className="archive-row">
                        <div className="archive-icon" style={{ background: "#EAF0F6" }}>
                          <IconLabsSmall />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span className="topic-pill" style={{ fontSize: 10, padding: "2px 8px", background: "#EAF0F6" }}>
                              LAB
                            </span>
                          </div>
                          <div className="archive-title">{r.item.name}</div>
                          <div className="archive-meta">{r.item.focus}</div>
                        </div>
                        <span className="ftag" style={{ background: r.item.active ? "#D4EDDA" : "#F5DDE0" }}>
                          {r.item.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    );
                  if (r.kind === "researcher")
                    return (
                      <div key={i} className="archive-row">
                        <div className="lb-avatar">{r.item.name.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span className="topic-pill" style={{ fontSize: 10, padding: "2px 8px", background: "#F9F5DC" }}>
                              RESEARCHER
                            </span>
                          </div>
                          <div className="archive-title">{r.item.name}</div>
                          <div className="archive-meta">
                            {r.item.university} // {r.item.lab}
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 13, fontWeight: 700, color: "#E8323C" }}>
                          ARS {calcARS(r.item).toFixed(1)}
                        </div>
                      </div>
                    );
                  return null;
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TRENDING TAB ══════════════ */}
        {tab === "trending" && (
          <div className="grid-2" style={{ gap: 22 }}>
            <div>
              <WindowCard label="TOP_PAPERS.SYS" style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                  HIGHEST CITED — ALL TIME
                </div>
                {topPapers.map((p, i) => (
                  <Link key={p.id} href={`/paper/${p.id}`} className="lb-row" style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}>
                    <div className="lb-rank">{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="lb-name" style={{ fontSize: 13 }}>
                        {p.title.slice(0, 44)}…
                      </div>
                      <div className="lb-meta">{p.topic}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#E8323C" }}>{p.citations}</div>
                      <div style={{ fontSize: 10, color: "#6B6B7A" }}>cites</div>
                    </div>
                  </Link>
                ))}
              </WindowCard>
              <WindowCard label="TOP_RESEARCHERS.SYS">
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                  HIGHEST ARS SCORE — CLICK TO EXPLORE
                </div>
                {topResearchers.map((r, i) => (
                  <div
                    key={r.id}
                    className="lb-row"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const q = `researcher: ${r.name.split(" ").pop()}`;
                      setQuery(q);
                      runSearch(q);
                      setTab("search");
                    }}
                  >
                    <div className={`lb-rank${i === 0 ? " gold" : ""}`}>{i + 1}</div>
                    <div className="lb-avatar">{r.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="lb-name">{r.name}</div>
                      <div className="lb-meta">{r.university}</div>
                    </div>
                    <div className="lb-ars">{calcARS(r).toFixed(1)}</div>
                  </div>
                ))}
              </WindowCard>
            </div>
            <div>
              <WindowCard label="TOPIC_VELOCITY.SYS" style={{ marginBottom: 22 }} bodyClass="window-body window-body-blue">
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                  PAPERS PER TOPIC
                </div>
                {topTopics.map(([topic, count]: [string, number]) => (
                  <div key={topic} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{topic}</span>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "#E8323C", fontWeight: 700 }}>{count as number}</span>
                    </div>
                    <div className="ars-bar-bg">
                      <div className="ars-bar-fill" style={{ width: `${((count as number) / SEED_PAPERS.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </WindowCard>
              <WindowCard label="TOPICS_INDEX.SYS" bodyClass="window-body window-body-yellow" style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 12 }}>
                  CLICK A TOPIC TO EXPLORE
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {topTopics.map(([topic]) => (
                    <button
                      key={topic}
                      className="topic-pill"
                      style={{ cursor: "pointer", border: "none", fontFamily: "'Space Grotesk',sans-serif" }}
                      onClick={() => {
                        const q = `topic: ${topic}`;
                        setQuery(q);
                        runSearch(q);
                        setTab("search");
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </WindowCard>
              <WindowCard label="NETWORK_STATS.SYS" bodyClass="window-body window-body-yellow">
                <div className="grid-2" style={{ gap: 12 }}>
                  {[
                    { label: "Indexed Papers", value: SEED_PAPERS.length },
                    { label: "Active Researchers", value: SEED_RESEARCHERS.length },
                    { label: "Partner Labs", value: SEED_LABS.filter((l) => l.active).length },
                    { label: "Avg. ARS", value: (SEED_RESEARCHERS.reduce((a, r) => a + calcARS(r), 0) / SEED_RESEARCHERS.length).toFixed(1) },
                  ].map((s) => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value" style={{ fontSize: 22 }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </WindowCard>
            </div>
          </div>
        )}

        {/* ══════════════ PROTOCOLS TAB ══════════════ */}
        {tab === "protocols" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
              {PROTOCOLS.map((p) => (
                <button
                  key={p}
                  className={activeProto === p ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
                  style={activeProto === p ? { background: "#F5D94E" } : {}}
                  onClick={() => setActiveProto(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="grid-2" style={{ gap: 22 }}>
              <div>
                <WindowCard label={`PAPERS: ${activeProto.toUpperCase()}`} style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                    RELEVANT RESEARCH
                  </div>
                  {proto.papers.length === 0 ? (
                    <p style={{ color: "#6B6B7A", fontSize: 13 }}>No indexed papers yet for this protocol.</p>
                  ) : (
                    proto.papers.slice(0, 3).map((p: (typeof SEED_PAPERS)[0]) => (
                      <Link
                        key={p.id}
                        href={`/paper/${p.id}`}
                        className="archive-row"
                        style={{ marginBottom: 8, textDecoration: "none", color: "inherit" }}
                      >
                        <MediaIcon type="Essay" />
                        <div style={{ flex: 1 }}>
                          <div className="archive-title" style={{ fontSize: 13 }}>
                            {p.title.slice(0, 48)}…
                          </div>
                          <div className="archive-meta">
                            {p.topic} // {p.citations} cites
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </WindowCard>
                <WindowCard label={`RESEARCHERS: ${activeProto.toUpperCase()}`}>
                  {proto.researchers.map((name: string) => {
                    const r = SEED_RESEARCHERS.find((x) => x.name === name);
                    if (!r) return null;
                    return (
                      <div key={name} className="lb-row">
                        <div className="lb-avatar">{name.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div className="lb-name">{name}</div>
                          <div className="lb-meta">{r.university}</div>
                        </div>
                        <div className="lb-ars">{calcARS(r).toFixed(1)}</div>
                      </div>
                    );
                  })}
                </WindowCard>
              </div>
              <div>
                <WindowCard label={`LABS: ${activeProto.toUpperCase()}`} bodyClass="window-body window-body-blue" style={{ marginBottom: 22 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
                    RESEARCH INFRASTRUCTURE
                  </div>
                  {proto.labs.map((name: string) => {
                    const l = SEED_LABS.find((x) => x.name === name);
                    if (!l) return null;
                    return (
                      <div key={name} className="archive-row" style={{ marginBottom: 8 }}>
                        <div className="archive-icon" style={{ background: "#fff" }}>
                          <IconLabsSmall />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="archive-title" style={{ fontSize: 13 }}>
                            {name}
                          </div>
                          <div className="archive-meta">{l.focus}</div>
                        </div>
                        <span className="ftag" style={{ background: l.active ? "#D4EDDA" : "#F5DDE0", flexShrink: 0 }}>
                          {l.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    );
                  })}
                </WindowCard>
                <WindowCard label="SPONSOR_INTEL.SYS" bodyClass="window-body window-body-yellow">
                  {SEED_SPONSORS.filter(
                    (s) =>
                      s.name.toLowerCase().includes(activeProto.toLowerCase()) || (activeProto === "Ethereum" && s.name === "Ethereum Foundation")
                  ).map((s: (typeof SEED_SPONSORS)[0]) => (
                    <div key={s.name}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 8 }}>
                        {s.category} · {s.programs} programs · {s.amount}
                      </div>
                      <p style={{ fontSize: 13, color: "#6B6B7A", lineHeight: 1.6 }}>{s.why}</p>
                    </div>
                  ))}
                  {!SEED_SPONSORS.some(
                    (s) =>
                      s.name.toLowerCase().includes(activeProto.toLowerCase()) || (activeProto === "Ethereum" && s.name === "Ethereum Foundation")
                  ) && <p style={{ color: "#6B6B7A", fontSize: 13 }}>No sponsor data indexed for {activeProto} yet.</p>}
                </WindowCard>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ GRAPH TAB ══════════════ */}
        {tab === "graph" && (
          <div>
            <WindowCard label="GRAPH_EXPLORER.SYS" bodyClass="window-body window-body-blue" style={{ marginBottom: 22 }}>
              <h3 style={{ fontSize: 22, marginBottom: 10 }}>Research Graph Explorer</h3>
              <p style={{ fontSize: 15, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 16 }}>
                The AthenaX knowledge graph maps the full relationship network of Web3 research.
              </p>
              <div className="grid-2" style={{ gap: 16, marginBottom: 20 }}>
                <div style={{ padding: "12px 14px", background: "#fff", border: "1.5px solid #1C1C27", borderRadius: 8 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.06em", color: "#6B6B7A", marginBottom: 8 }}>
                    NODES
                  </div>
                  {[
                    { c: "#E8323C", label: "Papers — indexed research" },
                    { c: "#F5D94E", label: "Researchers — ARS-scored" },
                    { c: "#1C1C27", label: "Labs — partner institutions" },
                    { c: "#EAF0F6", label: "Topics — research areas" },
                  ].map((n) => (
                    <div key={n.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: n.c, border: "1.5px solid #1C1C27", flexShrink: 0 }} />
                      {n.label}
                    </div>
                  ))}
                </div>
                <div style={{ padding: "12px 14px", background: "#fff", border: "1.5px solid #1C1C27", borderRadius: 8 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.06em", color: "#6B6B7A", marginBottom: 8 }}>
                    EDGES
                  </div>
                  {[{ label: "authored — paper ↔ lab" }, { label: "covers — paper ↔ topic" }, { label: "member_of — researcher ↔ lab" }].map((e) => (
                    <div key={e.label} style={{ fontSize: 13, color: "#1C1C27", marginBottom: 6 }}>
                      {e.label}
                    </div>
                  ))}
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.05em", color: "#6B6B7A", marginTop: 10 }}>
                    Drag · Scroll to zoom · Click to inspect
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.06em", color: "#6B6B7A", marginBottom: 8 }}>
                  TRY THESE COMMANDS IN THE GRAPH TERMINAL
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["topic zk", "researcher Dankrad", "top topics", "reset"].map((cmd) => (
                    <button
                      key={cmd}
                      className="ftag"
                      style={{ cursor: "pointer", fontFamily: "'Space Mono',monospace", fontSize: 11, border: "1.5px solid #1C1C27" }}
                      onClick={() => {
                        runCmd(cmd);
                      }}
                    >
                      &gt; {cmd}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link className="btn btn-primary" href="/research/graph" style={{ textDecoration: "none" }}>
                  Open Full Graph →
                </Link>
                <Link className="btn btn-outline" href="/archive" style={{ textDecoration: "none" }}>
                  Browse Archive
                </Link>
              </div>
            </WindowCard>
            <div className="grid-3" style={{ gap: 20 }}>
              {[
                {
                  label: "Total Nodes",
                  value: SEED_PAPERS.length + SEED_RESEARCHERS.length + SEED_LABS.length + Object.keys(topicCounts).length,
                  sub: "papers + researchers + labs + topics",
                },
                { label: "Total Edges", value: SEED_PAPERS.length * 2, sub: "authored + covers relationships" },
                { label: "Topics Mapped", value: Object.keys(topicCounts).length, sub: "unique research areas" },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-sub">{s.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 22 }}>
              <WindowCard label=">_ GRAPH_TERMINAL" bodyClass="window-body window-body-yellow">
                <p style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 12 }}>
                  Run queries from the terminal below — results will highlight the corresponding nodes when you open the full graph.
                </p>
                <div
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 11,
                    minHeight: 80,
                    maxHeight: 120,
                    overflowY: "auto",
                    marginBottom: 12,
                    padding: "10px 12px",
                    background: "#F2EFE9",
                    borderRadius: 8,
                    border: "1.5px solid #1C1C27",
                  }}
                >
                  {cmdLog.slice(-6).map((l, i) => (
                    <div key={i} style={{ color: l.startsWith(">") ? "#1C1C27" : "#6B6B7A", lineHeight: 1.7 }}>
                      {l}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="inp"
                    style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, padding: "8px 12px", flex: 1 }}
                    value={cmdInput}
                    onChange={(e) => setCmdInput(e.target.value)}
                    placeholder="top papers"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        runCmd(cmdInput);
                        setCmdInput("");
                      }
                    }}
                  />
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      runCmd(cmdInput);
                      setCmdInput("");
                    }}
                  >
                    Run
                  </button>
                </div>
              </WindowCard>
            </div>
          </div>
        )}

        {/* ══════════════ ACCESS TAB ══════════════ */}
        {tab === "access" && (
          <div>
            <div className="grid-3" style={{ gap: 22, marginBottom: 22 }}>
              {[
                {
                  plan: "Individual",
                  price: "$500",
                  period: "/month per seat",
                  features: [
                    "Full paper search",
                    "Researcher ARS scores",
                    "Protocol intelligence",
                    "Citation & download data",
                    "Weekly digest access",
                  ],
                  highlight: false,
                },
                {
                  plan: "Team",
                  price: "$3,500",
                  period: "/month unlimited seats",
                  features: [
                    "Everything in Individual",
                    "Team workspace",
                    "Saved searches & alerts",
                    "Custom protocol watchlists",
                    "Priority support",
                    "API access (beta)",
                  ],
                  highlight: true,
                },
                {
                  plan: "Enterprise",
                  price: "Custom",
                  period: "pricing",
                  features: [
                    "Everything in Team",
                    "Custom data exports",
                    "Direct researcher introductions",
                    "White-label reports",
                    "SLA & dedicated support",
                    "Governance analytics",
                  ],
                  highlight: false,
                },
              ].map((t) => (
                <WindowCard
                  key={t.plan}
                  label={`PLAN: ${t.plan.toUpperCase()}`}
                  bodyClass={t.highlight ? "window-body window-body-yellow" : "window-body"}
                >
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 32, fontWeight: 700, color: t.highlight ? "#E8323C" : "#1C1C27" }}>{t.price}</div>
                    <div style={{ fontSize: 13, color: "#6B6B7A", fontFamily: "'Space Mono',monospace" }}>{t.period}</div>
                  </div>
                  <hr className="divider-sm" />
                  {t.features.map((f) => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: "#4CAF50", fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  <hr className="divider-sm" />
                  <button
                    className={t.highlight ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => {
                      if (!user) {
                        showToast("Sign in to subscribe.", "error");
                        return;
                      }
                      showToast(`${t.plan} plan inquiry submitted!`, "success");
                    }}
                  >
                    {t.price === "Custom" ? "Get in Touch →" : "Subscribe →"}
                  </button>
                </WindowCard>
              ))}
            </div>
            <WindowCard label="SUBSCRIBERS.SYS" bodyClass="window-body window-body-blue">
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>Who Uses the Terminal</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  "Paradigm",
                  "Electric Capital",
                  "Variant Fund",
                  "Delphi Digital",
                  "Multicoin",
                  "a16z crypto",
                  "Protocol treasury teams",
                  "Independent researchers",
                ].map((s) => (
                  <span key={s} className="ftag">
                    {s}
                  </span>
                ))}
              </div>
            </WindowCard>
          </div>
        )}

        {/* ══════════════ PERSISTENT CMD STRIP ══════════════ */}
        {tab !== "graph" && (
          <div style={{ marginTop: 32 }}>
            <WindowCard label=">_ TERMINAL_CMD">
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, minHeight: 60, maxHeight: 100, overflowY: "auto", marginBottom: 10 }}>
                {cmdLog.slice(-4).map((l, i) => (
                  <div key={i} style={{ color: l.startsWith(">") ? "#1C1C27" : "#6B6B7A", lineHeight: 1.7 }}>
                    {l}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="inp"
                  style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, padding: "8px 12px", flex: 1 }}
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  placeholder="help | top papers | topic zk | researcher Dankrad…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      runCmd(cmdInput);
                      setCmdInput("");
                      if (
                        ["top papers", "top researchers"].includes(cmdInput.toLowerCase()) ||
                        cmdInput.toLowerCase().startsWith("topic ") ||
                        cmdInput.toLowerCase().startsWith("researcher ") ||
                        cmdInput.toLowerCase().startsWith("search ")
                      )
                        setTab("search");
                    }
                  }}
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    runCmd(cmdInput);
                    setCmdInput("");
                  }}
                >
                  Run
                </button>
              </div>
            </WindowCard>
          </div>
        )}
      </div>
    </div>
  );
}
