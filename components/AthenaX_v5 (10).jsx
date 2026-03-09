import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// ATHENAX v5 — SINGLE-FILE REACT APPLICATION
// Self-contained: all data, auth, components, pages inlined.
// Design tokens: bg #FDFBF7 · accent #E63636 · text #1F2937
// Fonts: Londrina Solid · Space Grotesk · VT323
// ═══════════════════════════════════════════════════════════

// ── 1. DESIGN TOKENS (locked — never modify) ───────────────
// bg:     #FDFBF7   accent:  #E63636
// text:   #1F2937   border:  2px solid #1F2937
// shadow: 4px 4px 0px #1F2937
// Fonts:  Londrina Solid (headings) · Space Grotesk (body) · VT323 (terminal)

const GlobalStyles = () => (
  <style>{`
    /* ── AthenaX Brand Tokens v2 ── */
    :root {
      --cream:          #FDFBF7;
      --ink:            #1F2937;
      --accent-red:     #E63636;
      --accent-yellow:  #FDE68A;
      --accent-blue:    #DBEAFE;
      --success-green:  #22C55E;
      --border:         3px solid #1F2937;
      --border-2:       2px solid #1F2937;
      --shadow:         6px 6px 0px #1F2937;
      --shadow-sm:      4px 4px 0px #1F2937;
      --shadow-lg:      8px 8px 0px #1F2937;
      --shadow-red:     6px 6px 0px #E63636;
      --radius:         10px;
      --radius-sm:      7px;
      --radius-xs:      5px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 16px; }
    body, #root {
      background: var(--cream); color: var(--ink);
      font-family: var(--font-space-grotesk), sans-serif;
      min-height: 100vh; -webkit-font-smoothing: antialiased;
    }
    h1,h2,h3,h4,.font-heading { font-family: var(--font-londrina), cursive; letter-spacing: 0.01em; }
    .vt { font-family: var(--font-vt323), monospace; }

    /* ── Window cards ── */
    .window-card {
      background: var(--cream); border: var(--border);
      box-shadow: var(--shadow);
      transition: box-shadow 0.14s ease, transform 0.14s ease;
      border-radius: var(--radius);
      overflow: hidden;
    }
    .window-card:hover { box-shadow: var(--shadow-lg); transform: translate(-2px,-2px); }
    .window-card--static:hover { box-shadow: var(--shadow); transform: none; }

    /* ── Card colour variants — yellow NEVER full bg ── */
    .window-card--blue   { background: var(--accent-blue); }
    .window-card--ink    { background: var(--ink); color: var(--cream); }
    .window-card--cream  { background: var(--cream); }

    .window-header {
      background: var(--ink); color: var(--cream);
      padding: 7px 14px; display: flex; align-items: center; gap: 10px;
      font-family: var(--font-vt323), monospace; font-size: 14px; letter-spacing: 0.08em;
      user-select: none; flex-shrink: 0;
    }
    .window-body   { padding: 20px; }
    .window-body--sm { padding: 14px; }
    .window-body--lg { padding: 28px; }

    /* ── Traffic lights ── */
    .tl-group { display: flex; gap: 5px; align-items: center; flex-shrink: 0; }
    .tl { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.25); flex-shrink: 0; }
    .tl-red    { background: var(--accent-red); }
    .tl-yellow { background: #F5A623; }
    .tl-green  { background: var(--success-green); }

    /* ── Terminal panel ── */
    .terminal-panel {
      background: var(--ink); color: var(--cream);
      border: var(--border); box-shadow: var(--shadow);
      font-family: var(--font-vt323), monospace; font-size: 17px; line-height: 1.55;
      border-radius: var(--radius); overflow: hidden;
    }
    .terminal-panel .window-header { border-bottom: 1px solid rgba(255,255,255,0.15); }
    .terminal-body { padding: 16px 18px; }
    .term-green  { color: var(--success-green); }
    .term-red    { color: var(--accent-red); }
    .term-yellow { color: #F5A623; }
    .term-dim    { opacity: 0.45; }

    /* ── Buttons — Inter 600, 3px border, 6px shadow ── */
    .btn {
      font-family: var(--font-inter), sans-serif; font-size: 13px; font-weight: 700;
      letter-spacing: 0.05em; text-transform: uppercase;
      cursor: pointer; transition: box-shadow 0.14s ease, transform 0.14s ease;
      display: inline-flex; align-items: center; justify-content: center;
      border: 3px solid var(--ink);
      padding: 9px 22px; line-height: 1; white-space: nowrap; background: transparent;
      border-radius: var(--radius-sm);
    }
    .btn:hover  { box-shadow: var(--shadow); transform: translate(-2px,-2px); }
    .btn:active { box-shadow: 2px 2px 0px var(--ink); transform: translate(2px,2px); }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

    .btn-primary  { background: var(--accent-red); color: var(--cream); border-color: var(--ink); box-shadow: var(--shadow-sm); }
    .btn-primary:hover { box-shadow: var(--shadow); }
    .btn-secondary{ background: var(--cream); color: var(--ink); border-color: var(--ink); box-shadow: var(--shadow-sm); }
    .btn-secondary:hover { box-shadow: var(--shadow); }
    .btn-dark     { background: var(--ink); color: var(--cream); border-color: var(--ink); box-shadow: var(--shadow-red); }
    .btn-dark:hover { box-shadow: 8px 8px 0px var(--accent-red); }
    .btn-ghost    { background: transparent; color: var(--ink); border: 3px solid var(--ink); box-shadow: none; }
    .btn-ghost:hover { box-shadow: var(--shadow-sm); }
    .btn-outline-white { color: var(--cream); border: 3px solid rgba(255,255,255,0.6); box-shadow: 4px 4px 0px rgba(255,255,255,0.25); }
    .btn-outline-white:hover { box-shadow: 6px 6px 0px rgba(255,255,255,0.35); transform: translate(-2px,-2px); }
    .btn-sm { font-size: 11px; padding: 6px 14px; }
    .btn-lg { font-size: 15px; padding: 13px 30px; }

    /* ── Tags — Inter 600, yellow only for small badges/section labels ── */
    .tag         { font-family: var(--font-inter), sans-serif; font-weight: 600; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border: 2px solid var(--ink); display: inline-block; line-height: 1.5; border-radius: var(--radius-xs); background: var(--cream); }
    .tag-accent  { font-family: var(--font-inter), sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border: 2px solid var(--accent-red); color: var(--accent-red); display: inline-block; line-height: 1.5; border-radius: var(--radius-xs); background: rgba(230,54,54,0.07); }
    .tag-green   { font-family: var(--font-inter), sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border: 2px solid var(--success-green); color: var(--success-green); display: inline-block; line-height: 1.5; border-radius: var(--radius-xs); background: rgba(34,197,94,0.07); }
    /* Yellow = small highlight badge ONLY — section tags, status labels, mini badges */
    .tag-yellow  { font-family: var(--font-inter), sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.07em; text-transform: uppercase; padding: 2px 7px; border: 2px solid #B45309; color: #78350F; display: inline-block; line-height: 1.5; border-radius: var(--radius-xs); background: var(--accent-yellow); }
    .tag-blue    { font-family: var(--font-inter), sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; padding: 3px 9px; border: 2px solid #3B82F6; color: #1E40AF; display: inline-block; line-height: 1.5; border-radius: var(--radius-xs); background: var(--accent-blue); }

    /* ── Table ── */
    .retro-table { border-collapse: collapse; width: 100%; }
    .retro-table th {
      background: var(--ink); color: var(--cream);
      font-family: var(--font-inter), sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      padding: 9px 14px; text-align: left; white-space: nowrap;
    }
    .retro-table td {
      font-family: var(--font-inter), sans-serif; font-size: 13px; font-weight: 400;
      padding: 10px 14px; border-bottom: 1px solid rgba(31,41,55,0.12);
      vertical-align: middle;
    }
    .retro-table tr:last-child td { border-bottom: none; }
    .retro-table tr:hover td     { background: rgba(31,41,55,0.035); }

    /* ── Forms ── */
    input, textarea, select {
      font-family: var(--font-inter), sans-serif; font-weight: 400;
      background: var(--cream); border: var(--border);
      outline: none; color: var(--ink); font-size: 13px;
      border-radius: var(--radius-sm);
    }
    input:focus, textarea:focus, select:focus { box-shadow: var(--shadow); }
    input::placeholder, textarea::placeholder { opacity: 0.4; }
    .form-field   { margin-bottom: 18px; }
    .form-label   { font-family: var(--font-inter), sans-serif; font-weight: 600; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; display: block; margin-bottom: 6px; color: var(--ink); }
    .form-input   { width: 100%; padding: 10px 12px; display: block; }
    .form-select  { width: 100%; padding: 10px 12px; display: block; cursor: pointer; }

    /* ── Layout helpers ── */
    .page-container { max-width: 1200px; margin: 0 auto; padding: 56px 32px; }
    .section-label  { font-family: var(--font-inter), sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-red); margin-bottom: 10px; display: block; }
    /* Yellow badge for section tags — inline pill, not full background */
    .section-badge  { font-family: var(--font-inter), sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 0.10em; text-transform: uppercase; color: #78350F; background: var(--accent-yellow); border: 2px solid #B45309; border-radius: var(--radius-xs); padding: 2px 8px; display: inline-block; margin-bottom: 12px; }
    .section-title  { font-family: var(--font-londrina), cursive; font-size: clamp(36px,5vw,60px); line-height: 1.0; margin-bottom: 12px; }
    .section-subtitle { font-family: var(--font-inter), sans-serif; font-weight: 400; font-size: 15px; line-height: 1.65; opacity: 0.65; max-width: 560px; }

    .grid-2     { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
    .grid-3     { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
    .grid-auto  { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 16px; }
    .grid-auto-sm { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 14px; }

    .stat-number { font-family: var(--font-londrina), cursive; font-size: 48px; color: var(--accent-red); line-height: 1; }
    .stat-label  { font-family: var(--font-inter), sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.55; margin-top: 4px; }

    .progress-track { height: 6px; background: rgba(31,41,55,0.1); border: 1px solid rgba(31,41,55,0.18); border-radius: 3px; }
    .progress-fill  { height: 100%; background: var(--accent-red); transition: width 0.3s ease; border-radius: 3px; }
    .progress-fill--green { background: var(--success-green); }

    /* ── Modal ── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(31,41,55,0.75);
      z-index: 200; display: flex; align-items: center;
      justify-content: center; padding: 20px;
    }
    .modal-box {
      background: var(--cream); border: var(--border);
      box-shadow: var(--shadow-xl); border-radius: var(--radius);
      max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto;
    }

    /* ── Toast ── */
    .toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 300;
      min-width: 280px; border: var(--border); background: var(--cream);
      box-shadow: var(--shadow); padding: 14px 18px;
      border-radius: var(--radius);
      display: flex; align-items: center; gap: 12px;
      animation: slide-in 0.18s ease both;
    }
    .toast--success { border-color: var(--success-green); box-shadow: 6px 6px 0px var(--success-green); }
    .toast--error   { border-color: var(--accent-red); box-shadow: 4px 4px 0px var(--accent-red); }
    .toast--info    { border-color: #D97706; box-shadow: 4px 4px 0px #D97706; }

    /* ── Animations ── */
    @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
    .blink { animation: blink 1s step-end infinite; }
    @keyframes page-in    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .page-enter { animation: page-in 0.18s ease both; }
    @keyframes slide-in   { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
    @keyframes spin       { to{transform:rotate(360deg)} }
    .spin { animation: spin 0.8s linear infinite; display: inline-block; }

    /* ── Dot background ── */
    .dot-bg {
      background-image: radial-gradient(circle, rgba(31,41,55,0.12) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar        { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track  { background: var(--cream); }
    ::-webkit-scrollbar-thumb  { background: var(--ink); border-radius: 4px; }

    /* ── Highlight panels ── */
    /* panel-yellow removed per brand spec: yellow not used as full backgrounds */
    .panel-blue   { background: var(--accent-blue);   border: var(--border); box-shadow: var(--shadow); border-radius: var(--radius); padding: 16px 20px; overflow: hidden; }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .page-container { padding: 32px 16px; }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .hide-mobile { display: none; }
    }
  `}</style>
);

// ═══════════════════════════════════════════════════════════
// 2. UI PRIMITIVES
// ═══════════════════════════════════════════════════════════

const TrafficLights = () => (
  <div className="tl-group">
    <div className="tl tl-red"/><div className="tl tl-yellow"/><div className="tl tl-green"/>
  </div>
);

const WindowCard = ({
  title, children, className = "", bodyClass = "window-body",
  style = {}, headerRight = null, staticHover = false
}) => (
  <div className={`window-card ${staticHover ? "window-card--static" : ""} ${className}`} style={style}>
    <div className="window-header">
      <TrafficLights />
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
      {headerRight && <span style={{ fontSize: 13, opacity: 0.7, flexShrink: 0 }}>{headerRight}</span>}
    </div>
    <div className={bodyClass}>{children}</div>
  </div>
);

const TerminalPanel = ({ title, children, style = {}, headerRight = null }) => (
  <div className="terminal-panel" style={style}>
    <div className="window-header">
      <TrafficLights />
      <span style={{ flex: 1 }}>{title}</span>
      {headerRight && <span style={{ fontSize: 13, opacity: 0.6 }}>{headerRight}</span>}
    </div>
    <div className="terminal-body">{children}</div>
  </div>
);

const SectionLabel = ({ children }) => (
  <span className="section-badge">{children}</span>
);

const StatCard = ({ label, value, sub = "" }) => (
  <WindowCard title={label} staticHover style={{ flex: "1 1 140px" }}>
    <div style={{ textAlign: "center", padding: "6px 0" }}>
      <div className="stat-number">{value}</div>
      {sub && <div className="stat-label">{sub}</div>}
    </div>
  </WindowCard>
);

const Spinner = () => <span className="spin" style={{ fontSize: 18 }}>◌</span>;

// ── Toast notification ──────────────────────────────────────
const Toast = ({ msg, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const icon = msg.type === "success" ? "✓" : msg.type === "error" ? "✗" : "!";
  const iconColor = msg.type === "success" ? "#22C55E" : msg.type === "error" ? "#E63636" : "#F5A623";
  return (
    <div className={`toast toast--${msg.type}`}>
      <span className="vt" style={{ fontSize: 20, color: iconColor, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight:500, fontSize: 13, letterSpacing: "0.01em" }}>{msg.text}</span>
    </div>
  );
};

// ── Modal wrapper ───────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal-box">
      <div className="window-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TrafficLights />
          <span>{title}</span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "#FDFBF7", cursor: "pointer", fontFamily: "var(--font-vt323), monospace", fontSize: 20 }}
        >✕ CLOSE</button>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

// ── Shared card components ──────────────────────────────────
const ResearchCard = ({ paper, onClick }) => (
  <div className="window-card" style={{ cursor: "pointer" }} onClick={onClick}>
    <div className="window-header" style={{ justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <TrafficLights />
        <span style={{ fontSize: 13 }}>PAPER_{paper.id} · {paper.year}</span>
      </div>
      {paper.reviewScore > 0 && (
        <span className="vt" style={{ color: "var(--success-green)", fontSize: 14 }}>★ {paper.reviewScore}</span>
      )}
    </div>
    <div className="window-body">
      <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
        <span className="tag-accent">{paper.topic}</span>
        <span className="tag">{paper.university}</span>
        <span className="tag">{paper.lab}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}>
        {paper.title}
      </h3>
      <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.65, marginBottom: 14 }}>
        {paper.abstract.slice(0, 140)}…
      </p>
      <div style={{ fontFamily: "var(--font-vt323), monospace", fontSize: 15, opacity: 0.7, display: "flex", gap: 16 }}>
        <span>✦ {paper.citations} CITE</span>
        <span>↓ {paper.downloads.toLocaleString()} DL</span>
        <span>▲ {paper.votes} VOTES</span>
      </div>
    </div>
  </div>
);

const LabCard = ({ lab, onClick }) => (
  <div className="window-card" style={{ cursor: "pointer" }} onClick={onClick}>
    <div className="window-header">
      <TrafficLights />
      <span style={{ fontSize: 13 }}>LAB_PROFILE.sys</span>
      <span style={{ marginLeft: "auto", fontSize: 12, color: lab.active ? "#22C55E" : "rgba(255,255,255,0.35)" }}>
        {lab.active ? "● ACTIVE" : "○ INACTIVE"}
      </span>
    </div>
    <div className="window-body">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, background: "#1F2937", color: "#FDFBF7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-londrina), cursive", fontSize: 22, border: "2px solid #1F2937", flexShrink: 0 }}>
          {lab.name.charAt(0)}
        </div>
        <span className="tag-accent" style={{ fontSize: 12 }}>{lab.papers} PAPERS</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, marginBottom: 6 }}>{lab.name}</h3>
      <p style={{ fontSize: 13, opacity: 0.65, marginBottom: 12, lineHeight: 1.5 }}>{lab.focus}</p>
      <div className="vt" style={{ fontSize: 13, opacity: 0.5, marginBottom: 10 }}>
        PARTNERS: {lab.partners.join(" · ")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {lab.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// 3. STATIC SEED DATA
// (Will be replaced by the mock API in Part 2)
// ═══════════════════════════════════════════════════════════

const SEED_LABS = [
  { id: "lab_1", name: "IF Labs", focus: "Frontier Infrastructure & Protocol Research", partners: ["MIT", "Oxford"], papers: 14, tags: ["DeFi", "ZK Proofs", "L2 Scaling"], description: "IF Labs is the founding research partner of AthenaX, specializing in applied blockchain infrastructure research with a focus on zero-knowledge proofs, Layer 2 scaling, and DeFi protocol design.", researchers: ["Dr. Yuki Tanaka", "Prof. Amara Osei", "Dr. Felix Chen"], active: true },
  { id: "lab_2", name: "MIT DCI", focus: "Digital Currency Initiative", partners: ["MIT", "Harvard"], papers: 89, tags: ["Crypto Economics", "CBDC", "Privacy"], description: "The MIT Digital Currency Initiative bridges academic research and practical implementation of digital currencies and decentralized systems.", researchers: ["Prof. Neha Narula", "Dr. James McCarthy", "Sarah Kim"], active: true },
  { id: "lab_3", name: "Stanford Blockchain", focus: "Blockchain Protocol Research", partners: ["Stanford", "Caltech"], papers: 67, tags: ["Consensus", "Smart Contracts", "Security"], description: "Stanford's Blockchain Research Center conducts fundamental research in distributed systems, cryptography, and decentralized application design.", researchers: ["Prof. Dan Boneh", "Dr. Benedikt Bünz", "Pratyush Mishra"], active: true },
  { id: "lab_4", name: "Oxford Internet Institute", focus: "Internet & Society Research", partners: ["Oxford", "Cambridge"], papers: 112, tags: ["Governance", "DAOs", "Digital Nations"], description: "The OII examines the social, economic, and political implications of internet technologies and decentralized governance systems.", researchers: ["Prof. Vili Lehdonvirta", "Dr. Markus Ante", "Clara Jensen"], active: false },
  { id: "lab_5", name: "Ethereum Foundation Research", focus: "Ethereum Protocol Development", partners: ["ETH Zurich", "Imperial College"], papers: 203, tags: ["Ethereum", "PoS", "EVM"], description: "The EF Research team drives the technical evolution of the Ethereum protocol — consensus, data availability, execution, and beyond.", researchers: ["Vitalik Buterin", "Justin Drake", "Dankrad Feist"], active: true },
  { id: "lab_6", name: "Consensys R&D", focus: "Applied Protocol Engineering", partners: ["Columbia", "Imperial College"], papers: 41, tags: ["EVM", "Dev Tools", "Layer 2"], description: "Consensys R&D combines protocol engineering with applied research across the Ethereum ecosystem.", researchers: ["Dr. Péter Szilágyi", "Danno Ferrin", "Antoine Toulme"], active: true },
];

const SEED_PAPERS = [
  { id: "001", title: "ZK-SNARKs in Layer 2 Rollup Systems: A Comprehensive Analysis", authorIds: ["user_001"], authors: ["Dr. Yuki Tanaka", "Prof. Amara Osei"], university: "MIT", lab: "IF Labs", topic: "ZK Proofs", citations: 142, downloads: 3840, reviewScore: 9.2, abstract: "A systematic analysis of zero-knowledge proof systems deployed in Layer 2 rollup architectures, evaluating security guarantees, computational overhead, and practical tradeoffs for production deployments.", year: 2024, status: "published", votes: 234 },
  { id: "002", title: "DAO Governance Mechanisms: Voting Theory Meets Decentralization", authorIds: ["user_002"], authors: ["Prof. Vili Lehdonvirta", "Dr. Clara Jensen"], university: "Oxford", lab: "Oxford Internet Institute", topic: "DAO Governance", citations: 98, downloads: 2210, reviewScore: 8.7, abstract: "An interdisciplinary examination of DAO governance structures through the lens of political science and distributed systems theory, proposing a unified framework for evaluation.", year: 2024, status: "published", votes: 189 },
  { id: "003", title: "Tokenomics Design Patterns for Sustainable DeFi Protocols", authorIds: ["user_003"], authors: ["Dr. Felix Chen", "Sarah Kim"], university: "Stanford", lab: "Stanford Blockchain", topic: "Tokenomics", citations: 76, downloads: 1950, reviewScore: 8.1, abstract: "We survey 47 DeFi protocols to identify common tokenomic design patterns and propose a framework for protocol designers seeking long-term sustainability.", year: 2024, status: "published", votes: 143 },
  { id: "004", title: "AI Agent Coordination in Multi-Chain Environments", authorIds: ["user_004"], authors: ["Dr. James McCarthy", "Elena Rodriguez"], university: "MIT", lab: "MIT DCI", topic: "AI Agents", citations: 201, downloads: 5670, reviewScore: 9.5, abstract: "This work investigates the coordination problem for autonomous AI agents operating across heterogeneous blockchain networks, with formal safety guarantees.", year: 2025, status: "published", votes: 312 },
  { id: "005", title: "Crypto Economic Security: Game Theoretic Models for Validator Incentives", authorIds: ["user_005"], authors: ["Dankrad Feist", "Justin Drake"], university: "ETH Zurich", lab: "Ethereum Foundation Research", topic: "Crypto Economics", citations: 315, downloads: 8920, reviewScore: 9.8, abstract: "A rigorous game-theoretic analysis of validator incentive structures in proof-of-stake systems, with formal security proofs under Byzantine fault models.", year: 2025, status: "published", votes: 487 },
  { id: "006", title: "Digital Nations: Governance Frameworks for Network States", authorIds: ["user_002"], authors: ["Prof. Vili Lehdonvirta", "Dr. Markus Ante"], university: "Oxford", lab: "Oxford Internet Institute", topic: "Digital Nations", citations: 54, downloads: 1340, reviewScore: 7.9, abstract: "We examine the emerging concept of digital nations and network states, analysing governance primitives borrowed from blockchain systems and their sociological implications.", year: 2024, status: "published", votes: 98 },
];

const SEED_SPONSORS = [
  { name: "Ethereum Foundation", category: "Protocol Layer",  amount: "$2.4M", ticker: "ETH",   programs: 12, why: "Funding open cryptography and consensus research to advance the Ethereum protocol." },
  { name: "Arbitrum",            category: "L2 Network",      amount: "$800K", ticker: "ARB",    programs: 4,  why: "Sponsoring research into optimistic rollup security, fraud proofs, and decentralised sequencing." },
  { name: "EigenLayer",          category: "Restaking",       amount: "$1.2M", ticker: "EIGEN",  programs: 6,  why: "Funding formal verification and economic security research for restaking infrastructure." },
  { name: "Uniswap Foundation",  category: "DeFi Protocol",   amount: "$400K", ticker: "UNI",    programs: 3,  why: "Supporting cross-chain liquidity and MEV research to improve decentralised trading." },
  { name: "Mantle",              category: "L2 Network",      amount: "$600K", ticker: "MNT",    programs: 3,  why: "Funding L2 performance, data availability, and modular architecture research." },
  { name: "Coinbase",            category: "Exchange / L2",   amount: "$500K", ticker: "CB",     programs: 2,  why: "Sponsoring regulatory research and Base L2 infrastructure studies." },
];

const SEED_BOUNTIES = [
  { id: "B001", title: "ZK Proof Optimization for Mobile Wallets",               sponsor: "Ethereum Foundation", reward: "$45,000", deadline: "2025-03-31", applicants: 14, topic: "ZK Proofs",    status: "open" },
  { id: "B002", title: "DAO Voter Participation Incentive Models",                sponsor: "Arbitrum",            reward: "$22,000", deadline: "2025-02-28", applicants: 7,  topic: "DAO Governance",status: "open" },
  { id: "B003", title: "Cross-chain Liquidity Protocol Design",                  sponsor: "Uniswap Foundation",  reward: "$35,000", deadline: "2025-04-30", applicants: 21, topic: "DeFi",         status: "open" },
  { id: "B004", title: "EigenLayer Slashing Conditions Formal Verification",     sponsor: "EigenLayer",          reward: "$60,000", deadline: "2025-05-31", applicants: 5,  topic: "Security",     status: "open" },
];

const SEED_LEADERBOARD = [
  { rank: 1, name: "Dankrad Feist",          university: "ETH Zurich",           lab: "EF Research",              citations: 315, downloads: 8920, votes: 487 },
  { rank: 2, name: "Dr. James McCarthy",     university: "MIT",                  lab: "MIT DCI",                  citations: 201, downloads: 5670, votes: 312 },
  { rank: 3, name: "Prof. Vili Lehdonvirta", university: "Oxford",               lab: "Oxford Internet Institute", citations: 152, downloads: 4550, votes: 287 },
  { rank: 4, name: "Dr. Yuki Tanaka",        university: "MIT",                  lab: "IF Labs",                  citations: 142, downloads: 3840, votes: 234 },
  { rank: 5, name: "Dr. Felix Chen",         university: "Stanford",             lab: "Stanford Blockchain",      citations: 76,  downloads: 1950, votes: 143 },
];


// ═══════════════════════════════════════════════════════════
// PART 3 — AUTH DATA LAYER (inlined from services/db.js)
// ═══════════════════════════════════════════════════════════

const DB_KEYS = {
  USERS:"ax_users", SESSION:"ax_session", RESEARCHERS:"ax_researchers",
  PAPERS:"ax_papers", BOUNTIES:"ax_bounties", APPLICATIONS:"ax_applications",
  SEEDED:"ax_seeded_v1",
};
const dbRead  = (k, fb=[]) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch{ return fb; } };
const dbWrite = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };
const dbUid   = (p="id") => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const dbNow   = () => new Date().toISOString();

const SEED_USERS = [
  { id:"user_001", email:"yuki@mit.edu",         password:"demo123",  name:"Dr. Yuki Tanaka",        role:"researcher", university:"MIT",       lab:"IF Labs",   avatar:"Y", researcherId:"res_001", createdAt:"2024-01-01T00:00:00Z" },
  { id:"user_002", email:"vili@ox.ac.uk",         password:"demo123",  name:"Prof. Vili Lehdonvirta", role:"researcher", university:"Oxford",    lab:"OII",       avatar:"V", researcherId:"res_002", createdAt:"2024-01-05T00:00:00Z" },
  { id:"user_003", email:"felix@stanford.edu",    password:"demo123",  name:"Dr. Felix Chen",         role:"researcher", university:"Stanford",  lab:"Stanford Blockchain", avatar:"F", researcherId:"res_003", createdAt:"2024-02-01T00:00:00Z" },
  { id:"user_004", email:"james@mit.edu",         password:"demo123",  name:"Dr. James McCarthy",     role:"researcher", university:"MIT",       lab:"MIT DCI",   avatar:"J", researcherId:"res_004", createdAt:"2024-01-10T00:00:00Z" },
  { id:"user_005", email:"dankrad@ef.org",        password:"demo123",  name:"Dankrad Feist",          role:"researcher", university:"ETH Zurich",lab:"EF Research",avatar:"D",researcherId:"res_005", createdAt:"2023-11-01T00:00:00Z" },
  { id:"user_s01", email:"grants@ethereum.org",   password:"demo123",  name:"Ethereum Foundation",    role:"sponsor",    organization:"Ethereum Foundation", avatar:"E", createdAt:"2024-01-01T00:00:00Z" },
  { id:"user_s02", email:"research@arbitrum.io",  password:"demo123",  name:"Arbitrum Research",      role:"sponsor",    organization:"Arbitrum",            avatar:"A", createdAt:"2024-02-01T00:00:00Z" },
  { id:"user_adm", email:"admin@athenax.io",      password:"admin123", name:"AthenaX Admin",          role:"admin",                                          avatar:"X", createdAt:"2023-10-01T00:00:00Z" },
];
const SEED_RESEARCHERS = [
  { id:"res_001", userId:"user_001", name:"Dr. Yuki Tanaka",        university:"MIT",       lab:"IF Labs",   bio:"ZK proof systems researcher.",        avatar:"Y", citations:142, peerReviews:12, downloads:3840, votes:234, sponsorEndorsements:3, bountyCompletions:2 },
  { id:"res_002", userId:"user_002", name:"Prof. Vili Lehdonvirta", university:"Oxford",    lab:"OII",       bio:"Internet & Society researcher.",      avatar:"V", citations:152, peerReviews:15, downloads:3550, votes:287, sponsorEndorsements:2, bountyCompletions:1 },
  { id:"res_003", userId:"user_003", name:"Dr. Felix Chen",         university:"Stanford",  lab:"Stanford Blockchain", bio:"DeFi protocol designer.", avatar:"F", citations:76,  peerReviews:7,  downloads:1950, votes:143, sponsorEndorsements:1, bountyCompletions:3 },
  { id:"res_004", userId:"user_004", name:"Dr. James McCarthy",     university:"MIT",       lab:"MIT DCI",   bio:"AI agents & multi-chain systems.",    avatar:"J", citations:201, peerReviews:18, downloads:5670, votes:312, sponsorEndorsements:4, bountyCompletions:2 },
  { id:"res_005", userId:"user_005", name:"Dankrad Feist",          university:"ETH Zurich",lab:"EF Research",bio:"Ethereum protocol, polynomial commitments.", avatar:"D", citations:315, peerReviews:24, downloads:8920, votes:487, sponsorEndorsements:5, bountyCompletions:4 },
];

const initDB = () => {
  if (localStorage.getItem(DB_KEYS.SEEDED)) return;
  dbWrite(DB_KEYS.USERS,       SEED_USERS);
  dbWrite(DB_KEYS.RESEARCHERS, SEED_RESEARCHERS);
  dbWrite(DB_KEYS.APPLICATIONS, []);
  localStorage.setItem(DB_KEYS.SEEDED, "1");
};

// ── ARS formula ──────────────────────────────────────────────
const calcARS = (r) => {
  if (!r) return 0;
  const s = (r.citations||0)*0.30 + (r.peerReviews||0)*0.25 +
    Math.min((r.downloads||0)/1000,20)*0.15 + Math.min((r.votes||0)/100,20)*0.15 +
    (r.sponsorEndorsements||0)*0.10 + (r.bountyCompletions||0)*0.05;
  return Math.min(10, parseFloat(s.toFixed(1)));
};

// ── Auth service ─────────────────────────────────────────────
const authSvc = {
  getSession: () => {
    const s = dbRead(DB_KEYS.SESSION, null);
    if (!s?.userId) return null;
    return dbRead(DB_KEYS.USERS).find(u => u.id === s.userId) || null;
  },
  login: (email, password) => {
    const user = dbRead(DB_KEYS.USERS).find(u => u.email===email && u.password===password);
    if (!user) return { error:"Invalid email or password." };
    dbWrite(DB_KEYS.SESSION, { userId:user.id, loginAt:dbNow() });
    return { user };
  },
  logout: () => localStorage.removeItem(DB_KEYS.SESSION),
  register: (data) => {
    const users = dbRead(DB_KEYS.USERS);
    if (users.find(u => u.email===data.email)) return { error:"An account with this email already exists." };
    const user = { id:dbUid("user"), ...data, avatar:data.name?.charAt(0).toUpperCase()||"?", createdAt:dbNow() };
    dbWrite(DB_KEYS.USERS, [...users, user]);
    if (data.role==="researcher") {
      const researchers = dbRead(DB_KEYS.RESEARCHERS);
      dbWrite(DB_KEYS.RESEARCHERS, [...researchers, {
        id:dbUid("res"), userId:user.id, name:data.name, university:data.university||"",
        lab:data.lab||"", bio:data.bio||"", avatar:user.avatar,
        citations:0, peerReviews:0, downloads:0, votes:0, sponsorEndorsements:0, bountyCompletions:0,
      }]);
    }
    dbWrite(DB_KEYS.SESSION, { userId:user.id, loginAt:dbNow() });
    return { user };
  },
  updateProfile: (userId, updates) => {
    const users = dbRead(DB_KEYS.USERS).map(u => u.id===userId ? {...u,...updates,updatedAt:dbNow()} : u);
    dbWrite(DB_KEYS.USERS, users);
    const updated = users.find(u => u.id===userId);
    if (updated?.role==="researcher") {
      const rs = dbRead(DB_KEYS.RESEARCHERS);
      const ri = rs.findIndex(r => r.userId===userId);
      if (ri>=0) { ["name","bio","university","lab","avatar"].forEach(k => { if(updates[k]!==undefined) rs[ri][k]=updates[k]; }); dbWrite(DB_KEYS.RESEARCHERS,rs); }
    }
    return updated;
  },
  getResearcher: (userId) => dbRead(DB_KEYS.RESEARCHERS).find(r => r.userId===userId)||null,
  getPapersByUser: (userId) => SEED_PAPERS.filter(p => (p.authorIds||[]).includes(userId)),
  getApplications: (userId) => dbRead(DB_KEYS.APPLICATIONS).filter(a => a.userId===userId),
  DEMO_ACCOUNTS: [
    { label:"Researcher — Dr. Yuki Tanaka",  email:"yuki@mit.edu",        password:"demo123"  },
    { label:"Researcher — Dankrad Feist",    email:"dankrad@ef.org",      password:"demo123"  },
    { label:"Sponsor — Ethereum Foundation", email:"grants@ethereum.org", password:"demo123"  },
    { label:"Admin",                         email:"admin@athenax.io",    password:"admin123" },
  ],
};

// ═══════════════════════════════════════════════════════════
// PART 3 — LOGIN MODAL
// ═══════════════════════════════════════════════════════════
const LoginModal = ({ onClose, onSuccess, showToast }) => {
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const submit = () => {
    setError("");
    if(!email||!pw){setError("Email and password required.");return;}
    setLoading(true);
    setTimeout(()=>{
      const r=authSvc.login(email,pw); setLoading(false);
      if(r.error){setError(r.error);return;}
      showToast?.(`Welcome back, ${r.user.name}!`,"success");
      onSuccess(r.user); onClose();
    },320);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(31,41,55,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#FDFBF7",border:"3px solid #1F2937",boxShadow:"8px 8px 0 #1F2937",border:"3px solid #1F2937",borderRadius:10,maxWidth:460,width:"100%",maxHeight:"90vh",overflowY:"auto",overflow:"hidden"}}>
        <div style={{background:"#1F2937",color:"#FDFBF7",padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"var(--font-vt323), monospace",fontSize:15,letterSpacing:"0.06em"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><TrafficLights/><span>ATHENAX_LOGIN.sys</span></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#FDFBF7",cursor:"pointer",fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:13}}>✕ CLOSE</button>
        </div>
        <div style={{padding:28}}>
          {[["EMAIL","email",email,setEmail,"researcher@university.edu"],["PASSWORD","password",pw,setPw,"••••••••"]].map(([label,type,val,setter,ph])=>(
            <div key={label} style={{marginBottom:16}}>
              <label style={{fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:11,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:6,color:"#1F2937"}}>{label}</label>
              <input type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} onKeyDown={e=>e.key==="Enter"&&submit()}
                style={{width:"100%",padding:"10px 12px",fontFamily:"var(--font-inter), sans-serif",background:"#FDFBF7",border:"2px solid #1F2937",outline:"none",fontSize:13,display:"block"}}/>
            </div>
          ))}
          {error&&<div style={{fontFamily:"var(--font-inter), sans-serif",fontWeight:600,color:"#E63636",fontSize:12,marginBottom:14,padding:"8px 10px",border:"1.5px solid #E63636",borderRadius:6,background:"rgba(230,54,54,0.06)"}}>✗ {error}</div>}
          <button onClick={submit} disabled={loading}
            style={{width:"100%",padding:"11px 0",fontFamily:"var(--font-inter), sans-serif",fontWeight:700,fontSize:14,letterSpacing:"0.06em",background:"#E63636",color:"#FDFBF7",border:"3px solid #1F2937",boxShadow:"6px 6px 0 #1F2937",borderRadius:6,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1,textTransform:"uppercase"}}>
            {loading ? "SIGNING IN…" : "SIGN IN"}
          </button>
          <div style={{borderTop:"1px solid rgba(31,41,55,0.15)",margin:"22px 0 14px"}}/>
          <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.5,marginBottom:10,letterSpacing:"0.04em"}}>DEMO ACCOUNTS — CLICK TO PREFILL:</div>
          {authSvc.DEMO_ACCOUNTS.map(acc=>(
            <div key={acc.email} onClick={()=>{setEmail(acc.email);setPw(acc.password);setError("");}}
              style={{cursor:"pointer",border:"1px solid rgba(31,41,55,0.2)",padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(31,41,55,0.04)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{fontSize:12}}>{acc.label}</span>
              <span style={{fontFamily:"var(--font-vt323), monospace",color:"#E63636",fontSize:16}}>USE →</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PART 3 — REGISTER MODAL
// ═══════════════════════════════════════════════════════════
const ROLE_DESCS = {
  researcher:"Publish research, earn ARS reputation, apply to cohorts, claim bounties.",
  sponsor:"Fund research programs, post bounties, access researcher talent.",
  builder:"Build startups from validated research through the builder pipeline.",
};

const RegisterModal = ({ onClose, onSuccess, showToast }) => {
  const [step,setStep]       = useState(1);
  const [loading,setLoading] = useState(false);
  const [error,setError]     = useState("");
  const [form,setForm]       = useState({ name:"",email:"",password:"",confirm:"",role:"researcher",university:"",lab:"",bio:"",organization:"" });
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const iStyle = { width:"100%",padding:"10px 12px",fontFamily:"var(--font-inter), sans-serif",background:"#FDFBF7",border:"2px solid #1F2937",outline:"none",fontSize:13,marginTop:5,display:"block" };
  const lStyle = { fontFamily:"var(--font-vt323), monospace",fontSize:14,letterSpacing:"0.06em",opacity:0.7,display:"block" };

  const step1ok = () => {
    if(!form.name.trim()) return "Full name required.";
    if(!/\S+@\S+\.\S+/.test(form.email)) return "Valid email required.";
    if(form.password.length<6) return "Password must be 6+ characters.";
    if(form.password!==form.confirm) return "Passwords do not match.";
    return null;
  };

  const submit = () => {
    if(step===1){ const e=step1ok(); if(e){setError(e);return;} setError(""); setStep(2); return; }
    setLoading(true);
    setTimeout(()=>{
      const r=authSvc.register({ name:form.name.trim(),email:form.email.trim(),password:form.password,
        role:form.role,university:form.university.trim(),lab:form.lab.trim(),bio:form.bio.trim(),organization:form.organization.trim() });
      setLoading(false);
      if(r.error){setError(r.error);return;}
      showToast?.(`Account created! Welcome, ${r.user.name}.`,"success");
      onSuccess(r.user); onClose();
    },420);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(31,41,55,0.75)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#FDFBF7",border:"3px solid #1F2937",boxShadow:"8px 8px 0 #1F2937",border:"3px solid #1F2937",borderRadius:10,maxWidth:500,width:"100%",maxHeight:"90vh",overflowY:"auto",overflow:"hidden"}}>
        <div style={{background:"#1F2937",color:"#FDFBF7",padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"var(--font-vt323), monospace",fontSize:15,letterSpacing:"0.06em"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><TrafficLights/><span>CREATE_ACCOUNT.sys — STEP {step}/2</span></div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#FDFBF7",cursor:"pointer",fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:13}}>✕ CLOSE</button>
        </div>
        {/* step tabs */}
        <div style={{display:"flex",borderBottom:"1px solid rgba(31,41,55,0.15)"}}>
          {[["1","CREDENTIALS"],["2","PROFILE"]].map(([n,lbl])=>(
            <div key={n} style={{flex:1,padding:"9px 16px",borderBottom:step===+n?"3px solid #E63636":"3px solid transparent"}}>
              <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:15,color:step===+n?"#E63636":"rgba(31,41,55,0.35)",letterSpacing:"0.06em"}}>STEP {n}: {lbl}</span>
            </div>
          ))}
        </div>
        <div style={{padding:28}}>
          {step===1 && <>
            <div style={{marginBottom:14}}><label style={lStyle}>FULL NAME</label><input value={form.name} onChange={set("name")} placeholder="Dr. Jane Smith" style={iStyle}/></div>
            <div style={{marginBottom:14}}><label style={lStyle}>EMAIL</label><input type="email" value={form.email} onChange={set("email")} placeholder="jane@university.edu" style={iStyle}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div><label style={lStyle}>PASSWORD</label><input type="password" value={form.password} onChange={set("password")} placeholder="min 6 chars" style={iStyle}/></div>
              <div><label style={lStyle}>CONFIRM</label><input type="password" value={form.confirm} onChange={set("confirm")} placeholder="repeat" style={iStyle}/></div>
            </div>
            <div style={{marginBottom:4}}><label style={lStyle}>I AM A…</label></div>
            {["researcher","sponsor","builder"].map(role=>(
              <div key={role} onClick={()=>setForm(f=>({...f,role}))}
                style={{cursor:"pointer",border:form.role===role?"2px solid #E63636":"2px solid rgba(31,41,55,0.2)",padding:"10px 14px",marginBottom:6,background:form.role===role?"rgba(230,54,54,0.06)":"transparent",borderRadius:6,display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:13,height:13,borderRadius:"50%",border:form.role===role?"4px solid #E63636":"2px solid #1F2937",flexShrink:0}}/>
                <div>
                  <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:17,textTransform:"uppercase",color:form.role===role?"#E63636":"#1F2937"}}>{role}</div>
                  <div style={{fontSize:12,opacity:0.55,lineHeight:1.4}}>{ROLE_DESCS[role]}</div>
                </div>
              </div>
            ))}
          </>}
          {step===2 && <>
            <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:15,color:"#E63636",marginBottom:16,letterSpacing:"0.06em"}}>ROLE: {form.role.toUpperCase()} · Complete your profile</div>
            {form.role==="researcher" && <>
              <div style={{marginBottom:14}}><label style={lStyle}>UNIVERSITY / INSTITUTION</label><input value={form.university} onChange={set("university")} placeholder="MIT, Stanford, Oxford…" style={iStyle}/></div>
              <div style={{marginBottom:14}}><label style={lStyle}>LAB (optional)</label><input value={form.lab} onChange={set("lab")} placeholder="IF Labs, MIT DCI…" style={iStyle}/></div>
            </>}
            {form.role==="sponsor" && <div style={{marginBottom:14}}><label style={lStyle}>ORGANIZATION</label><input value={form.organization} onChange={set("organization")} placeholder="Protocol / Foundation / DAO" style={iStyle}/></div>}
            <div style={{marginBottom:14}}><label style={lStyle}>BIO (optional)</label>
              <textarea value={form.bio} onChange={set("bio")} placeholder="Brief research focus or mission…" style={{...iStyle,minHeight:76,resize:"vertical"}}/>
            </div>
          </>}
          {error&&<div style={{fontFamily:"var(--font-inter), sans-serif",fontWeight:600,color:"#E63636",fontSize:12,marginBottom:14,padding:"8px 10px",border:"1.5px solid #E63636",borderRadius:6,background:"rgba(230,54,54,0.06)"}}>✗ {error}</div>}
          <div style={{display:"flex",gap:8}}>
            {step===2&&<button onClick={()=>{setStep(1);setError("");}} style={{padding:"11px 18px",fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:13,background:"transparent",color:"#1F2937",border:"2px solid #1F2937",cursor:"pointer",letterSpacing:"0.06em"}}>← BACK</button>}
            <button onClick={submit} disabled={loading}
              style={{flex:1,padding:"11px 0",fontFamily:"var(--font-inter), sans-serif",fontWeight:700,fontSize:14,letterSpacing:"0.06em",background:"#E63636",color:"#FDFBF7",border:"3px solid #1F2937",boxShadow:"6px 6px 0 #1F2937",borderRadius:6,cursor:loading?"not-allowed":"pointer",opacity:loading?0.6:1,textTransform:"uppercase"}}>
              {loading?"CREATING…":step===1?"NEXT →":"CREATE ACCOUNT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PART 3 — PROFILE PAGE
// ═══════════════════════════════════════════════════════════
const ArsBreakdown = ({ r }) => {
  const comps = [
    ["Citations",           r.citations||0,      (r.citations||0),                          0.30],
    ["Peer Reviews",        r.peerReviews||0,    (r.peerReviews||0),                        0.25],
    ["Downloads (÷1000)",   r.downloads||0,      Math.min((r.downloads||0)/1000,20),        0.15],
    ["Votes (÷100)",        r.votes||0,          Math.min((r.votes||0)/100,20),             0.15],
    ["Sponsor Endorsements",r.sponsorEndorsements||0,(r.sponsorEndorsements||0),            0.10],
    ["Bounty Completions",  r.bountyCompletions||0,(r.bountyCompletions||0),                0.05],
  ];
  const ars = calcARS(r);
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
        <span style={{fontFamily:"var(--font-londrina), cursive",fontSize:52,color:ars>=8?"#22C55E":ars>=5?"#F5A623":"#E63636",lineHeight:1}}>{ars.toFixed(1)}</span>
        <div><div style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.5,letterSpacing:"0.06em"}}>ATHENAX REPUTATION SCORE</div><div style={{fontSize:11,opacity:0.35}}>Max 10.0</div></div>
      </div>
      {comps.map(([label,raw,w,weight])=>{
        const contrib=parseFloat((w*weight).toFixed(2));
        return (
          <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid rgba(31,41,55,0.07)"}}>
            <span style={{fontSize:13}}>{label} <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:12,opacity:0.4}}>×{weight}</span></span>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.5}}>{raw.toLocaleString()}</span>
              <span style={{fontFamily:"var(--font-londrina), cursive",fontSize:17,color:"#E63636",minWidth:32,textAlign:"right"}}>{contrib}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProfilePage = ({ user, setPage, showToast, onUserUpdate }) => {
  const [editing,setEditing] = useState(false);
  const [editForm,setEditForm] = useState(null);

  const researcher  = user?.role==="researcher" ? authSvc.getResearcher(user.id) : null;
  const papers      = user ? authSvc.getPapersByUser(user.id) : [];
  const applications= user ? authSvc.getApplications(user.id) : [];
  const bounties    = user?.role==="sponsor" ? SEED_BOUNTIES.filter(b=>b.sponsorId===user.id||b.sponsor===user.organization||b.sponsor===user.name) : [];
  const ars         = researcher ? calcARS(researcher) : 0;

  const startEdit = () => setEditForm({ name:user.name, bio:researcher?.bio||user.bio||"", university:researcher?.university||user.university||"", lab:researcher?.lab||user.lab||"", organization:user.organization||"" });
  const cancelEdit = () => { setEditing(false); setEditForm(null); };
  const saveEdit = () => {
    const updated = authSvc.updateProfile(user.id, editForm);
    if(updated){ onUserUpdate(updated); showToast("Profile updated.","success"); cancelEdit(); }
  };

  const iStyle = { width:"100%",padding:"9px 12px",fontFamily:"var(--font-inter), sans-serif",background:"#FDFBF7",border:"2px solid #1F2937",outline:"none",fontSize:13,marginTop:4,display:"block" };
  const lStyle = { fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.65,display:"block" };

  if (!user) return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"56px 32px"}}>
      <WindowCard title="AUTH_REQUIRED.sys" staticHover>
        <div style={{textAlign:"center",padding:"32px 0"}}>
          <div style={{fontFamily:"var(--font-londrina), cursive",fontSize:26,color:"#E63636",marginBottom:12,letterSpacing:1}}>○ NOT SIGNED IN</div>
          <button className="btn btn-primary" onClick={()=>setPage("login")}>SIGN IN</button>
        </div>
      </WindowCard>
    </div>
  );

  return (
    <div style={{maxWidth:1200,margin:"0 auto",padding:"56px 32px"}} className="page-enter">
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:24,alignItems:"start"}}>

        {/* Left */}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <WindowCard title="USER_PROFILE.sys">
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{width:68,height:68,background:"#1F2937",color:"#FDFBF7",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-londrina), cursive",fontSize:30,border:"2px solid #1F2937",margin:"0 auto 12px"}}>
                {user.avatar||user.name?.charAt(0)}
              </div>
              {editing && editForm ? (
                <div style={{textAlign:"left"}}>
                  <div style={{marginBottom:10}}><label style={lStyle}>NAME</label><input value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} style={iStyle}/></div>
                  {user.role==="researcher"&&<>
                    <div style={{marginBottom:10}}><label style={lStyle}>UNIVERSITY</label><input value={editForm.university} onChange={e=>setEditForm(f=>({...f,university:e.target.value}))} style={iStyle}/></div>
                    <div style={{marginBottom:10}}><label style={lStyle}>LAB</label><input value={editForm.lab} onChange={e=>setEditForm(f=>({...f,lab:e.target.value}))} style={iStyle}/></div>
                  </>}
                  {user.role==="sponsor"&&<div style={{marginBottom:10}}><label style={lStyle}>ORGANIZATION</label><input value={editForm.organization} onChange={e=>setEditForm(f=>({...f,organization:e.target.value}))} style={iStyle}/></div>}
                  <div style={{marginBottom:12}}><label style={lStyle}>BIO</label><textarea value={editForm.bio} onChange={e=>setEditForm(f=>({...f,bio:e.target.value}))} style={{...iStyle,minHeight:64,resize:"vertical"}}/></div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-primary btn-sm" onClick={saveEdit}>SAVE</button>
                    <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>CANCEL</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{fontFamily:"var(--font-londrina), cursive",fontSize:24,marginBottom:3}}>{user.name}</div>
                  <div style={{fontSize:12,opacity:0.45,marginBottom:8}}>{user.email}</div>
                  {(researcher?.university||user.university)&&<div style={{fontFamily:"var(--font-vt323), monospace",fontSize:14,opacity:0.55,marginBottom:2}}>{researcher?.university||user.university}</div>}
                  {(researcher?.lab||user.lab)&&<div style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.4,marginBottom:10}}>{researcher?.lab||user.lab}</div>}
                  {user.organization&&<div style={{fontFamily:"var(--font-vt323), monospace",fontSize:14,opacity:0.55,marginBottom:10}}>{user.organization}</div>}
                  {(researcher?.bio||user.bio)&&<p style={{fontSize:12,lineHeight:1.55,opacity:0.6,marginBottom:12,textAlign:"left"}}>{researcher?.bio||user.bio}</p>}
                  <div style={{display:"flex",gap:5,justifyContent:"center",flexWrap:"wrap",marginBottom:14}}>
                    <span className={user.role==="researcher"?"tag-green":user.role==="sponsor"?"tag-yellow":"tag-accent"} style={{fontSize:12}}>{user.role.toUpperCase()}</span>
                    {researcher&&<span className={ars>=8?"tag-green":ars>=5?"tag-yellow":"tag-accent"} style={{fontSize:12}}>ARS {ars.toFixed(1)}</span>}
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:14}} onClick={()=>{ startEdit(); setEditing(true); }}>EDIT PROFILE</button>
                </>
              )}
            </div>
          </WindowCard>

          {researcher&&<WindowCard title="ARS_BREAKDOWN.sys" staticHover><ArsBreakdown r={researcher}/></WindowCard>}

          <WindowCard title="QUICK_ACTIONS.sys">
            {user.role==="researcher"&&<>
              <button className="btn btn-primary btn-sm" style={{width:"100%",marginBottom:7,fontSize:16}} onClick={()=>setPage("submit-paper")}>+ SUBMIT PAPER</button>
              <button className="btn btn-secondary btn-sm" style={{width:"100%",marginBottom:7,fontSize:16}} onClick={()=>setPage("cohorts")}>APPLY TO COHORT</button>
              <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:16}} onClick={()=>setPage("bounties")}>VIEW BOUNTIES</button>
            </>}
            {user.role==="sponsor"&&<>
              <button className="btn btn-primary btn-sm" style={{width:"100%",marginBottom:7,fontSize:16}} onClick={()=>setPage("post-bounty")}>+ POST BOUNTY</button>
              <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:16}} onClick={()=>setPage("sponsors")}>SPONSOR OVERVIEW</button>
            </>}
            {user.role==="builder"&&<>
              <button className="btn btn-primary btn-sm" style={{width:"100%",marginBottom:7,fontSize:16}} onClick={()=>setPage("cohorts")}>VIEW COHORTS</button>
              <button className="btn btn-ghost btn-sm" style={{width:"100%",fontSize:16}} onClick={()=>setPage("archive")}>BROWSE RESEARCH</button>
            </>}
            {user.role==="admin"&&<button className="btn btn-dark btn-sm" style={{width:"100%",fontSize:16}} onClick={()=>setPage("admin")}>ADMIN PANEL →</button>}
          </WindowCard>
        </div>

        {/* Right */}
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          {user.role==="researcher"&&(
            <WindowCard title={`MY_PAPERS.archive (${papers.length})`}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:"var(--font-londrina), cursive",fontSize:24}}>Published Research</h3>
                <button className="btn btn-primary btn-sm" onClick={()=>setPage("submit-paper")}>+ SUBMIT</button>
              </div>
              {papers.length===0
                ? <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:16,opacity:0.35,textAlign:"center",padding:"20px 0"}}>NO PAPERS SUBMITTED YET</div>
                : papers.map(p=>(
                  <div key={p.id} onClick={()=>setPage("paper_"+p.id)} style={{padding:"11px 0",borderBottom:"1px solid rgba(31,41,55,0.08)",cursor:"pointer"}}>
                    <div style={{fontFamily:"var(--font-londrina), cursive",fontSize:19,lineHeight:1.2,marginBottom:4}}>{p.title}</div>
                    <div style={{display:"flex",gap:12}}>
                      <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.45}}>{p.year}</span>
                      <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,color:"#E63636"}}>{p.citations} CITE</span>
                      <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,opacity:0.45}}>{(p.status||"published").toUpperCase()}</span>
                    </div>
                  </div>
                ))
              }
            </WindowCard>
          )}

          {user.role==="sponsor"&&(
            <WindowCard title={`MY_BOUNTIES.active (${bounties.length})`}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontFamily:"var(--font-londrina), cursive",fontSize:24}}>Posted Bounties</h3>
                <button className="btn btn-primary btn-sm" onClick={()=>setPage("post-bounty")}>+ NEW</button>
              </div>
              {bounties.length===0
                ? <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:16,opacity:0.35,textAlign:"center",padding:"20px 0"}}>NO BOUNTIES POSTED YET</div>
                : bounties.map(b=>(
                  <div key={b.id} style={{padding:"11px 0",borderBottom:"1px solid rgba(31,41,55,0.08)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontWeight:600,fontSize:13}}>{b.title}</span>
                      <span style={{fontFamily:"var(--font-londrina), cursive",fontSize:18,color:"#E63636"}}>{b.reward}</span>
                    </div>
                    <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:13,color:b.status==="open"?"#22C55E":"rgba(31,41,55,0.4)"}}>{b.applicants} PROPOSALS · {(b.status||"open").toUpperCase()}</span>
                  </div>
                ))
              }
            </WindowCard>
          )}

          <WindowCard title={`COHORT_APPLICATIONS.log (${applications.length})`}>
            <h3 style={{fontFamily:"var(--font-londrina), cursive",fontSize:24,marginBottom:14}}>Cohort Applications</h3>
            {applications.length===0
              ? <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:15,opacity:0.35,textAlign:"center",padding:"16px 0"}}>
                  NO APPLICATIONS YET — <span style={{color:"#E63636",cursor:"pointer"}} onClick={()=>setPage("cohorts")}>APPLY TO A COHORT</span>
                </div>
              : applications.map(a=>(
                <div key={a.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(31,41,55,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13,marginBottom:2}}>Cohort: {a.cohortId}</div>
                    <div style={{fontFamily:"var(--font-vt323), monospace",fontSize:12,opacity:0.4}}>{a.track&&`Track: ${a.track} · `}{new Date(a.createdAt).toLocaleDateString()}</div>
                  </div>
                  <span className={a.status==="accepted"?"tag-green":a.status==="rejected"?"tag-accent":"tag-yellow"} style={{fontSize:11}}>
                    {(a.status||"pending").toUpperCase()}
                  </span>
                </div>
              ))
            }
          </WindowCard>

          {user.role==="admin"&&(
            <WindowCard title="ADMIN_ACCESS.sys">
              <div style={{fontFamily:"var(--font-vt323), monospace",color:"#E63636",fontSize:16,marginBottom:8}}>● ADMIN PRIVILEGES ACTIVE</div>
              <p style={{fontSize:13,opacity:0.65,marginBottom:14,lineHeight:1.6}}>Full access to the AthenaX admin panel. Moderate papers, manage applications, review users.</p>
              <button className="btn btn-dark btn-sm" onClick={()=>setPage("admin")}>OPEN ADMIN PANEL →</button>
            </WindowCard>
          )}

          <WindowCard title="ACCOUNT_INFO.sys" staticHover>
            {[["USER ID",user.id.slice(0,14)+"…"],["ROLE",user.role.toUpperCase()],["MEMBER SINCE",new Date(user.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})]].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(31,41,55,0.08)"}}>
                <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:14}}>{k}</span>
                <span style={{fontFamily:"var(--font-londrina), cursive",fontSize:18,color:"#E63636"}}>{v}</span>
              </div>
            ))}
          </WindowCard>
        </div>
      </div>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════
// 4. NAVIGATION
// ═══════════════════════════════════════════════════════════

// ── 5-item top nav with dropdown menus ──────────────────────
const TOP_NAV = [
  {
    id: "home", label: "Research",
    dropdown: [
      { id:"home",        label:"Overview",         desc:"Platform home"            },
      { id:"archive",     label:"Archive",          desc:"All published papers"     },
      { id:"reports",     label:"Research Reports", desc:"Whitepapers & digests"    },
      { id:"roundtables", label:"Roundtables",      desc:"Academic debates"         },
      { id:"digest",      label:"Research Digest",  desc:"Weekly newsletter"        },
    ],
  },
  {
    id: "network", label: "Network",
    dropdown: [
      { id:"network",     label:"Overview",          desc:"Ecosystem map"           },
      { id:"labs",        label:"Research Labs",     desc:"Partner labs"            },
      { id:"universities",label:"Universities",      desc:"Academic partners"       },
      { id:"sponsors",    label:"Sponsors",          desc:"Protocol funders"        },
      { id:"talent",      label:"Talent Marketplace",desc:"Roles & fellowships"     },
    ],
  },
  {
    id: "funding", label: "Funding",
    dropdown: [
      { id:"funding",     label:"Overview",          desc:"How funding works"       },
      { id:"bounties",    label:"Bounties",          desc:"Open research challenges"},
      { id:"post-bounty", label:"Post a Bounty",     desc:"Sponsors only"           },
      { id:"cohorts",     label:"Cohorts",           desc:"Funded research programs"},
    ],
  },
  { id: "builders",  label: "Builders",  dropdown: null },
  { id: "terminal",  label: "Terminal ▤",
    dropdown: [
      { id:"terminal",       label:"Research Terminal", desc:"Search & query papers" },
      { id:"research-graph", label:"Research Graph",    desc:"Visual knowledge graph" },
    ],
  },
];

// Which top-level section is "active" for a given page
const getActiveSection = (page) => {
  const researchPages   = ["home","archive","reports","roundtables","digest","how-it-works","paper_","leaderboard"];
  const networkPages    = ["network","labs","lab-profile","universities","sponsors","talent"];
  const fundingPages    = ["funding","bounties","post-bounty","cohorts","apply-cohort","business-model"];
  if (researchPages.some(p => page===p || page.startsWith(p))) return "home";
  if (networkPages.includes(page))  return "network";
  if (fundingPages.includes(page))  return "funding";
  if (page === "builders")                      return "builders";
  if (page === "terminal" || page === "research-graph") return "terminal";
  return null;
};

const Navbar = ({ current, setPage, user, onAuthClick }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const activeSection = getActiveSection(current);

  const navBtnStyle = (id) => ({
    padding: "0 14px",
    height: 56,
    background: "transparent",
    color: activeSection === id ? "#E63636" : "#1F2937",
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-space-grotesk),sans-serif",
    fontWeight: activeSection === id ? 700 : 500,
    fontSize: 13,
    whiteSpace: "nowrap",
    flexShrink: 0,
    borderBottom: activeSection === id ? "3px solid #E63636" : "3px solid transparent",
    position: "relative",
    letterSpacing: "0.01em",
  });

  return (
    <nav
      style={{ borderBottom:"2px solid #1F2937", background:"#FDFBF7", position:"sticky", top:0, zIndex:100, height:56, display:"flex", alignItems:"center" }}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>

        {/* Logo lockup */}
        <div onClick={() => setPage("home")}
          style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer", userSelect:"none", flexShrink:0 }}>
          <div style={{ width:32, height:32, background:"#111827", borderRadius:6, color:"#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 2px rgba(0,0,0,0.2)", flexShrink:0, padding:4 }}>
            <img src="https://athenax.mypinx.store/Logo_Icon_White.png" alt="AthenaX Logo" style={{ width:"100%", height:"100%", objectFit:"contain" }} />
          </div>
          <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:30, letterSpacing:0, color:"#1F2937", lineHeight:1 }}>
            AthenaX
          </span>
        </div>

        {/* 5 top-level items */}
        <div style={{ display:"flex", alignItems:"stretch", flex:1, justifyContent:"center", height:56 }}>
          {TOP_NAV.map(item => (
            <div key={item.id} style={{ position:"relative", display:"flex", alignItems:"stretch" }}
              onMouseEnter={() => item.dropdown && setOpenMenu(item.id)}
            >
              <button
                onClick={() => { setOpenMenu(null); setPage(item.id); }}
                style={navBtnStyle(item.id)}
              >
                {item.label}
                {item.dropdown && (
                  <span style={{ fontSize:9, marginLeft:4, opacity:0.4, verticalAlign:"middle" }}>▾</span>
                )}
              </button>

              {/* Dropdown */}
              {item.dropdown && openMenu === item.id && (
                <div style={{ position:"absolute", top:"calc(100% + 2px)", left:"50%", transform:"translateX(-50%)", background:"#FDFBF7", border:"3px solid #1F2937", boxShadow:"6px 6px 0 #1F2937", borderRadius:10, minWidth:220, zIndex:200, overflow:"hidden" }}>
                  {/* Dropdown header */}
                  <div style={{ background:"#1F2937", padding:"7px 16px", fontFamily:"var(--font-space-grotesk),sans-serif", fontWeight:700, fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(253,251,247,0.5)" }}>
                    {item.label.toUpperCase()}_MENU.sys
                  </div>
                  {item.dropdown.map((sub, i) => (
                    <div key={sub.id}
                      onClick={() => { setOpenMenu(null); setPage(sub.id); }}
                      style={{ padding:"10px 14px", cursor:"pointer", borderBottom: i < item.dropdown.length-1 ? "1px solid rgba(31,41,55,0.08)" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(230,54,54,0.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ fontFamily:"var(--font-space-grotesk),sans-serif", fontWeight:600, fontSize:13, color: current===sub.id?"#E63636":"#1F2937" }}>
                        {current === sub.id && <span style={{ color:"#E63636", marginRight:5 }}>▸</span>}
                        {sub.label}
                      </div>
                      <div style={{ fontFamily:"var(--font-space-grotesk),sans-serif", fontWeight:400, fontSize:11, opacity:0.5, marginTop:2 }}>{sub.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Auth controls */}
        <div style={{ display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
          {user ? (
            <>
              {user.role === "admin" && (
                <button onClick={() => setPage("admin")}
                  style={{ padding:"4px 10px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"var(--font-vt323),monospace", fontSize:15, color:"#E63636", letterSpacing:"0.04em" }}>
                  ● ADMIN
                </button>
              )}
              <button onClick={() => setPage("dashboard")}
                style={{ padding:"4px 8px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"var(--font-vt323),monospace", fontSize:14, opacity:0.6 }}>
                DASH
              </button>
              <button onClick={() => setPage("profile")}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 10px", background:"transparent", border:"2px solid #1F2937", cursor:"pointer", fontFamily:"var(--font-space-grotesk),sans-serif", fontSize:13 }}>
                <div style={{ width:22, height:22, background:"#1F2937", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-londrina),cursive", fontSize:13, flexShrink:0 }}>
                  {user.avatar || user.name?.charAt(0)}
                </div>
                <span>{user.name?.split(" ")[0]}</span>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => onAuthClick?.("logout")}>OUT</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => onAuthClick?.("login")}>SIGN IN</button>
              <button className="btn btn-primary btn-sm" onClick={() => onAuthClick?.("register")}>JOIN</button>
            </>
          )}
          <button className="btn btn-primary btn-sm" style={{ background:"#1F2937", color:"#FDFBF7", boxShadow:"3px 3px 0 #E63636" }} onClick={() => setPage("sponsors")}>Sponsor</button>
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ setPage }) => (
  <footer style={{ borderTop: "2px solid #1F2937", background: "#1F2937", color: "#FDFBF7", padding: "40px 32px", marginTop: 80 }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 48, marginBottom: 36 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer", marginBottom:10 }} onClick={() => setPage("home")}>
            <div style={{ width:32, height:32, background:"#111827", borderRadius:6, color:"#FFFFFF", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 1px 2px rgba(0,0,0,0.35)", flexShrink:0, padding:4 }}>
              <img src="https://athenax.mypinx.store/Logo_Icon_White.png" alt="AthenaX Logo" style={{ width:"100%", height:"100%", objectFit:"contain" }} />
            </div>
            <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:30, color:"#FDFBF7", letterSpacing:0, lineHeight:1 }}>AthenaX</span>
          </div>
          <div style={{ fontFamily:"var(--font-space-grotesk),sans-serif", fontSize: 11, fontWeight:600, letterSpacing:"0.08em", opacity: 0.35, marginBottom: 14, textTransform:"uppercase" }}>Research OS v5.0</div>
          <p style={{ fontSize: 12, opacity: 0.5, lineHeight: 1.65 }}>The research and innovation engine of Web3.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {[
            { title: "PLATFORM",  links: [["How It Works","how-it-works"],["Funding","funding"],["Builders","builders"],["Business Model","business-model"],["Terminal ▤","terminal"]] },
            { title: "ECOSYSTEM", links: [["Talent Marketplace","talent"],["Research Reports","reports"],["AthenaX Live","live"],["Roundtables","roundtables"],["Research Digest","digest"]] },
            { title: "NETWORK",  links: [["Research Network","network"],["Labs","labs"],["Universities","universities"],["Sponsors","sponsors"]] },
            { title: "RESEARCH", links: [["Archive","archive"],["Cohorts","cohorts"],["Leaderboard","leaderboard"],["Bounties","bounties"]] },
            { title: "ACCOUNT",  links: [["Dashboard","dashboard"],["Profile","profile"],["Submit Paper","submit-paper"],["Post Bounty","post-bounty"]] },
          ].map(col => (
            <div key={col.title}>
              <div className="vt" style={{ fontSize: 15, color: "#E63636", marginBottom: 12, letterSpacing: "0.08em" }}>{col.title}</div>
              {col.links.map(([label, id]) => (
                <div key={label} onClick={() => setPage(id)} style={{ fontSize: 13, opacity: 0.55, marginBottom: 7, cursor: "pointer" }}>{label}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div className="vt" style={{ fontSize: 13, opacity: 0.3 }}>© 2025 ATHENAX RESEARCH NETWORK · ALL RESEARCH OPEN ACCESS</div>
        <div className="vt" style={{ fontSize: 13, opacity: 0.3 }}>BUILT ON OPEN SCIENCE · POWERED BY WEB3</div>
      </div>
    </div>
  </footer>
);

// ═══════════════════════════════════════════════════════════
// 5. PAGES
// ═══════════════════════════════════════════════════════════

// ── HOME ────────────────────────────────────────────────────
const HomePage = ({ setPage }) => {
  const [tick, setTick] = useState(true);
  useEffect(() => { const id = setInterval(() => setTick(t => !t), 800); return () => clearInterval(id); }, []);
  return (
    <div className="page-enter">
      {/* Hero */}
      <section style={{ borderBottom: "2px solid #1F2937", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(31,41,55,0.12) 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "80px 32px 72px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 48, alignItems: "center" }}>
            <div>
              <div className="vt" style={{ fontSize: 16, color: "#E63636", letterSpacing: "0.1em", marginBottom: 18 }}>
                ATHENAX RESEARCH OS v5.0 ▶ SYSTEM ONLINE <span className="blink">{tick ? "█" : " "}</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: "clamp(44px,6vw,80px)", lineHeight: 1.0, marginBottom: 24 }}>
                The Research &amp; Innovation Engine of <span style={{ color: "#E63636" }}>Web3</span>
              </h1>
              <p style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.7, maxWidth: 500, marginBottom: 14 }}>
                AthenaX connects universities, research labs, and Web3 protocols to produce credentialed open research — then turns validated ideas into funded startups.
              </p>
              <div className="vt" style={{ fontSize: 16, opacity: 0.5, marginBottom: 32, letterSpacing: "0.03em" }}>
                Researchers get paid. Protocols get credibility. Ideas become companies.
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg" onClick={() => setPage("how-it-works")}>How It Works</button>
                <button className="btn btn-secondary btn-lg" onClick={() => setPage("archive")}>Research Archive</button>
                <button className="btn btn-dark btn-lg" onClick={() => setPage("register")}>Join the Network →</button>
              </div>
            </div>
            <WindowCard title="NETWORK_STATUS.sys" headerRight="● LIVE" staticHover>
              {[
                ["ACTIVE COHORTS",  "3",    "#22C55E"],
                ["PARTNER LABS",    "12",   "#F5A623"],
                ["RESEARCHERS",     "340+", "#1F2937"],
                ["SPONSORS",        "6",    "#1F2937"],
                ["TOTAL PRIZE POOL","$2.5M","#E63636"],
                ["PAPERS PUBLISHED","530+", "#E63636"],
              ].map(([label, value, color], i, arr) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(31,41,55,0.1)" : "none" }}>
                  <span className="vt" style={{ fontSize: 16, letterSpacing: "0.04em" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 26, color }}>{value}</span>
                </div>
              ))}
            </WindowCard>
          </div>
        </div>
      </section>

      {/* Cohort banner */}
      <div style={{ background: "#1F2937", color: "#FDFBF7", borderBottom: "2px solid #1F2937", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
        <span className="vt" style={{ fontSize: 14, opacity: 0.5 }}>NOW RUNNING</span>
        <span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: "#E63636", letterSpacing: 2 }}>ATHENAX × IF LABS RESEARCH COHORT 01</span>
        <span className="vt" style={{ fontSize: 14, opacity: 0.5 }}>PRIZE POOL: $500,000</span>
        <button className="btn btn-primary btn-sm" style={{ border: "2px solid rgba(255,255,255,0.4)" }} onClick={() => setPage("cohorts")}>VIEW COHORT</button>
      </div>

      {/* Three columns — fully clickable nav cards */}
      <div style={{ background: "#1F2937", color: "#FDFBF7", borderBottom: "2px solid #1F2937" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            { label: "FOR RESEARCHERS", icon: "▣", title: "Get paid to do research",     desc: "Funded cohort positions. AthenaX Reputation Scores. Direct access to Web3 protocols.", cta: "Join as Researcher", page: "register"  },
            { label: "FOR PROTOCOLS",   icon: "◆", title: "Fund research that matters",  desc: "Sponsor credentialed academic work. Open-access papers from top labs.",                cta: "Sponsor Research",  page: "sponsors"  },
            { label: "FOR BUILDERS",    icon: "◎", title: "Build the next Web3 startup", desc: "Take validated research through the builder pipeline into funded startups.",            cta: "Join as Builder",   page: "builders"  },
          ].map((col, i) => (
            <div
              key={col.label}
              onClick={() => setPage(col.page)}
              style={{ padding: "32px 28px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none", cursor: "pointer" }}
            >
              <div style={{ fontFamily: "var(--font-vt323), monospace", fontSize: 32, color: "#E63636", marginBottom: 10, letterSpacing: "0.04em" }}>{col.icon}</div>
              <div className="vt" style={{ fontSize: 13, color: "#E63636", letterSpacing: "0.1em", marginBottom: 8 }}>{col.label}</div>
              <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 26, marginBottom: 10, color: "#FDFBF7" }}>{col.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, opacity: 0.6, marginBottom: 20 }}>{col.desc}</p>
              <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", color: "rgba(253,251,247,0.7)", border: "2px solid rgba(255,255,255,0.4)", padding: "5px 12px", borderRadius: 6, display: "inline-block" }}>{col.cta} →</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent papers */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px" }}>
        <SectionLabel>RECENT RESEARCH</SectionLabel>
        <div style={{ height: 16 }} />
        <div className="grid-auto">
          {SEED_PAPERS.slice(0, 3).map(p => (
            <ResearchCard key={p.id} paper={p} onClick={() => setPage("paper_" + p.id)} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="btn btn-ghost" onClick={() => setPage("archive")}>View Full Archive →</button>
        </div>
      </section>
    </div>
  );
};

// ── HOW IT WORKS ─────────────────────────────────────────────
const HowItWorksPage = ({ setPage }) => (
  <div className="page-enter">
    <div style={{ background: "#1F2937", color: "#FDFBF7", borderBottom: "2px solid #1F2937", padding: "64px 32px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>PLATFORM MECHANICS</SectionLabel>
        <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: "clamp(44px,6vw,76px)", lineHeight: 1.0, marginBottom: 18, color: "#FDFBF7" }}>How AthenaX Works</h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.65, maxWidth: 580, marginBottom: 36 }}>
          AthenaX is the coordination layer between academic research and Web3 innovation. Ideas enter as papers and exit as protocols, products, and companies.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={() => setPage("funding")}>Funding Model</button>
          <button className="btn btn-outline-white" onClick={() => setPage("builders")}>Builder Pipeline</button>
        </div>
      </div>
    </div>

    <div className="page-container">
      {/* Pipeline steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 2, marginBottom: 48 }}>
        {[
          { n: "01", label: "RESEARCH", title: "Academic Research",  desc: "University labs produce rigorous, peer-reviewed research in Web3-relevant fields.", icon: "▣", dark: true,  page: "archive"     },
          { n: "02", label: "VALIDATE", title: "Peer Review + ARS", desc: "Community review and ARS scoring validates quality and builds researcher reputation.", icon: "◉", dark: false, page: "leaderboard" },
          { n: "03", label: "FUND",     title: "Protocol Funding",   desc: "Web3 foundations sponsor cohorts. AthenaX earns a 10–20% platform fee.", icon: "◆", dark: true,  page: "funding"     },
          { n: "04", label: "BUILD",    title: "Builder Cohorts",    desc: "Validated research is matched with builders for 6-month incubation programs.", icon: "◎", dark: false, page: "builders"    },
          { n: "05", label: "LAUNCH",   title: "Ecosystem Impact",   desc: "Deployed protocols, trained researchers, funded startups, open datasets.", icon: "▤", dark: true,  page: "network"     },
        ].map(step => (
          <div
            key={step.n}
            onClick={() => setPage(step.page)}
            style={{
              background: step.dark ? "#1F2937" : "#E63636",
              border: "2px solid #1F2937", padding: "20px 16px",
              cursor: "pointer",
            }}
          >
            <div className="vt" style={{ fontSize: 12, opacity: 0.5, color: "#FDFBF7", marginBottom: 4 }}>{step.label}</div>
            <div style={{ fontFamily: "var(--font-vt323), monospace", fontSize: 28, color: "#FDFBF7", marginBottom: 8, letterSpacing: "0.04em" }}>{step.icon}</div>
            <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 19, color: "#FDFBF7", lineHeight: 1.1, marginBottom: 10 }}>{step.title}</div>
            <p style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.65)", marginBottom: 10 }}>{step.desc}</p>
            <div style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
              Explore →
            </div>
          </div>
        ))}
      </div>

      {/* Value props */}
      <div className="grid-3">
        {[
          { who: "Researchers", items: ["Funded cohort stipends ($5K–$50K)", "Portable AthenaX Reputation Score", "Access to Web3 protocol networks", "Career placement via talent marketplace"] },
          { who: "Web3 Protocols", items: ["Peer-reviewed open research output", "Named research programs at top universities", "Access to pre-vetted research talent", "Ecosystem credibility"] },
          { who: "AthenaX Revenue", items: ["10–20% fee on sponsored programs", "Research Terminal subscriptions ($49–$2,500/mo)", "10% bounty marketplace take", "5–8% equity in incubated startups"] },
        ].map(col => (
          <WindowCard key={col.who} title={`VALUE_${col.who.toUpperCase().replace(/ /g, "_")}.md`}>
            <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, marginBottom: 14, color: "#E63636" }}>{col.who}</h3>
            {col.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(31,41,55,0.08)", alignItems: "flex-start" }}>
                <span className="vt" style={{ color: "#E63636", fontSize: 16, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 13, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </WindowCard>
        ))}
      </div>
    </div>
  </div>
);

// ── FUNDING ──────────────────────────────────────────────────
const FundingPage = ({ setPage }) => (
  <div className="page-enter">
    <div style={{ background: "#1F2937", color: "#FDFBF7", borderBottom: "2px solid #1F2937", padding: "64px 32px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>RESEARCH FUNDING ENGINE</SectionLabel>
        <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: "clamp(44px,6vw,76px)", lineHeight: 1.0, marginBottom: 18, color: "#FDFBF7" }}>Funding</h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.65, maxWidth: 580 }}>
          Web3 protocols sponsor open research programs. AthenaX sources labs, manages peer review, handles escrow, and publishes open-access papers.
        </p>
      </div>
    </div>
    <div className="page-container">
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
        <StatCard label="TOTAL FUNDED"    value="$2.5M"  sub="ALL PROGRAMS" />
        <StatCard label="ACTIVE PROGRAMS" value="8"      sub="RUNNING NOW"  />
        <StatCard label="AVG PROGRAM"     value="$180K"  sub="PROGRAM SIZE" />
        <StatCard label="PLATFORM FEE"    value="10–20%" sub="ATHENAX TAKE" />
      </div>
      <div className="grid-2" style={{ marginBottom: 48 }}>
        <TerminalPanel title="FEE_MODEL.sys">
          <div className="term-green" style={{ marginBottom: 6 }}>$ cat /athenax/docs/fee-structure.md</div>
          <div style={{ marginBottom: 10 }}><span className="term-dim">PROTOCOL POSTS: </span><span className="term-yellow">$250,000</span></div>
          <div style={{ paddingLeft: 16 }}>
            <div>→ Researcher payout: <span className="term-green">$212,500</span></div>
            <div>→ AthenaX fee: <span className="term-red">$37,500 (15%)</span></div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 10, marginTop: 10 }}>
            <div>$25K–$100K: <span className="term-yellow">20%</span></div>
            <div>$100K–$500K: <span className="term-yellow">15%</span></div>
            <div>$500K+: <span className="term-yellow">10%</span></div>
          </div>
        </TerminalPanel>
        <WindowCard title="MILESTONE_ESCROW.sys" staticHover>
          <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, marginBottom: 16, color: "#E63636" }}>Milestone-Based Release</h3>
          {[["Research Brief Approved", "20%"], ["First Draft Submitted", "30%"], ["Peer Review Passed", "30%"], ["Paper Published", "20%"]].map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(31,41,55,0.08)" }}>
              <span style={{ fontSize: 13 }}>{m[0]}</span>
              <span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, color: "#E63636" }}>{m[1]}</span>
            </div>
          ))}
        </WindowCard>
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="btn btn-primary btn-lg" onClick={() => setPage("sponsors")}>Become a Research Sponsor →</button>
      </div>
    </div>
  </div>
);

// ── BUILDERS ─────────────────────────────────────────────────
const BuildersPage = ({ setPage }) => (
  <div className="page-enter">
    <div style={{ background: "#1F2937", color: "#FDFBF7", borderBottom: "2px solid #1F2937", padding: "64px 32px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SectionLabel>STARTUP PIPELINE</SectionLabel>
        <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: "clamp(44px,6vw,76px)", lineHeight: 1.0, marginBottom: 18, color: "#FDFBF7" }}>Builders</h1>
        <p style={{ fontSize: 17, lineHeight: 1.7, opacity: 0.65, maxWidth: 580, marginBottom: 36 }}>
          AthenaX turns research into companies. Every paper in the archive is a potential startup.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-primary" onClick={() => setPage("cohorts")}>View Active Cohorts</button>
          <button className="btn btn-outline-white" onClick={() => setPage("how-it-works")}>How It Works</button>
        </div>
      </div>
    </div>
    <div className="page-container">
      <div className="grid-2" style={{ marginBottom: 48 }}>
        <TerminalPanel title="EQUITY_TERMS.sys">
          <div className="term-green">$ cat /builders/equity.json</div>
          <div className="term-yellow">{"{"}</div>
          <div style={{ paddingLeft: 16 }}>
            <div>"athenax_equity": <span className="term-red">"5–8%"</span>,</div>
            <div>"instrument": <span className="term-green">"SAFE"</span>,</div>
            <div>"cohort_funding": <span className="term-yellow">"$50K–$500K"</span>,</div>
            <div>"duration": <span className="term-yellow">"6 months"</span></div>
          </div>
          <div className="term-yellow">{"}"}</div>
        </TerminalPanel>
        <WindowCard title="BUILDER_BENEFITS.md" staticHover>
          <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, marginBottom: 16, color: "#E63636" }}>What Builders Get</h3>
          {[
            ["Validated research foundation", "Start from peer-reviewed IP"],
            ["Cohort funding", "$50K–$500K non-dilutive"],
            ["Sponsor network", "24+ Web3 protocol intros"],
            ["Lab advisor access", "Original researchers as advisors"],
            ["AthenaX brand signal", "Credibility with investors"],
          ].map(([t, s], i) => (
            <div key={i} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i < 4 ? "1px solid rgba(31,41,55,0.08)" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{t}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>{s}</div>
            </div>
          ))}
        </WindowCard>
      </div>
      <SectionLabel>OPEN BUILDER OPPORTUNITIES</SectionLabel>
      <div style={{ height: 16 }} />
      <div className="grid-3">
        {SEED_PAPERS.slice(0, 3).map(p => (
          <WindowCard key={p.id} title={`BUILD_OPP_${p.id}.sys`}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              <span className="tag-accent">{p.topic}</span>
              <span className="tag">{p.university}</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, lineHeight: 1.2, marginBottom: 10 }}>{p.title.slice(0, 60)}…</h3>
            <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 28, color: "#E63636", marginBottom: 10 }}>$50K – $200K</div>
            <button className="btn btn-primary" style={{ width: "100%", fontSize: 16 }} onClick={() => setPage("cohorts")}>APPLY TO BUILD</button>
          </WindowCard>
        ))}
      </div>
    </div>
  </div>
);

// ── SPONSORS ─────────────────────────────────────────────────
const SponsorsPage = ({ setPage }) => (
  <div className="page-enter page-container">
    <div style={{ marginBottom: 48 }}>
      <SectionLabel>WEB3 ECOSYSTEM</SectionLabel>
      <h1 className="section-title">Sponsors</h1>
      <p className="section-subtitle">Web3 protocols fund open research that advances the entire ecosystem.</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
      {SEED_SPONSORS.map(s => (
        <div key={s.name} className="window-card window-card--static">
          <div className="window-header" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <TrafficLights />
              <span style={{ fontSize: 13 }}>{s.name.toUpperCase().replace(/ /g, "_")}.sponsor</span>
            </div>
            <span className="tag-accent">{s.category}</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 20, alignItems: "center" }}>
            <div style={{ width: 50, height: 50, background: "#1F2937", color: "#FDFBF7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-londrina), cursive", fontSize: 13, border: "2px solid #1F2937", textAlign: "center", lineHeight: 1.1 }}>{s.ticker}</div>
            <div>
              <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, marginBottom: 6 }}>{s.name}</h3>
              <p style={{ fontSize: 13, opacity: 0.65 }}>{s.why}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 32, color: "#E63636", marginBottom: 4 }}>{s.amount}</div>
              <div className="vt" style={{ fontSize: 14, opacity: 0.5 }}>{s.programs} PROGRAMS FUNDED</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ textAlign: "center" }}>
      <button className="btn btn-primary btn-lg" onClick={() => setPage("funding")}>SPONSOR RESEARCH →</button>
    </div>
  </div>
);

// ── BUSINESS MODEL ────────────────────────────────────────────
const BusinessModelPage = ({ setPage }) => (
  <div className="page-enter page-container">
    <div style={{ marginBottom: 48 }}>
      <SectionLabel>BUSINESS MODEL</SectionLabel>
      <h1 className="section-title">How AthenaX Makes Money</h1>
      <p className="section-subtitle">Five revenue streams across the research-to-startup pipeline.</p>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 48 }}>
      {[
        ["01","Sponsored Research Programs","▣","Transaction","10–20%","$150K","$900K","$3.0M"],
        ["02","Research Terminal Subscriptions","▤","Recurring","$49–$2,500/mo","$400K","$2.2M","$7.5M"],
        ["03","Bounty Marketplace","◎","Transaction","10% fee","$100K","$700K","$3.0M"],
        ["04","Talent Marketplace","◈","Transaction","15–20%","$540K","$2.5M","$5.0M"],
        ["05","Startup Equity","◆","Equity","5–8% SAFE","—","—","$50M+"],
      ].map(([id, name, icon, type, take, y1, y2, y3]) => (
        <div key={id} className="window-card window-card--static">
          <div className="window-header" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><TrafficLights /><span>REVENUE_STREAM_{id}.sys</span></div>
            <span className="tag" style={{ color: type === "Recurring" ? "#22C55E" : type === "Equity" ? "#F5A623" : "#FDFBF7", borderColor: type === "Recurring" ? "#22C55E" : type === "Equity" ? "#F5A623" : "rgba(253,251,247,0.4)", fontSize: 12 }}>{type.toUpperCase()}</span>
          </div>
          <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "center" }}>
            <div style={{ fontFamily: "var(--font-vt323), monospace", fontSize: 28, color: "#E63636", minWidth: 28, letterSpacing: "0.04em" }}>{icon}</div>
            <div>
              <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 22, marginBottom: 4 }}>{name}</h3>
              <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 18, color: "#E63636" }}>{take}</div>
            </div>
            <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
              {[["Y1", y1], ["Y2", y2], ["Y3", y3]].map(([yr, val]) => (
                <div key={yr}><div className="vt" style={{ fontSize: 12, opacity: 0.45 }}>{yr}</div><div className="vt" style={{ fontSize: 15, color: val === "—" ? "rgba(31,41,55,0.3)" : "#1F2937" }}>{val}</div></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ textAlign: "center", display: "flex", gap: 16, justifyContent: "center" }}>
      <button className="btn btn-primary btn-lg" onClick={() => setPage("funding")}>FUNDING MODEL</button>
      <button className="btn btn-secondary btn-lg" onClick={() => setPage("sponsors")}>SPONSORS</button>
    </div>
  </div>
);

// ── NETWORK ───────────────────────────────────────────────────
const NetworkPage = ({ setPage }) => (
  <div className="page-enter page-container">
    <div style={{ marginBottom: 48 }}>
      <SectionLabel>ECOSYSTEM</SectionLabel>
      <h1 className="section-title">Research Network</h1>
      <p className="section-subtitle">AthenaX is the coordination layer connecting academic institutions, independent labs, and Web3 organizations.</p>
    </div>
    <div className="grid-3">
      {[
        { title: "Universities", icon: "▣", desc: "Academic institutions partner with AthenaX for grants, mentorship, and industry access.", items: ["Co-branded Programs", "Student Fellowships", "Research Grants", "Industry Mentorship"] },
        { title: "Research Labs", icon: "◉", desc: "Labs run cohorts, publish papers, and build the cumulative body of Web3 knowledge.", items: ["Cohort Leadership", "Sponsor Connections", "Archive Publication", "Prize Pool Access"] },
        { title: "Web3 Sponsors", icon: "◆", desc: "Protocols fund research tracks aligned with protocol needs, gaining academic credibility.", items: ["Branded Research Tracks", "Researcher Recruiting", "Protocol Improvement", "Ecosystem Signal"] },
      ].map(p => (
        <WindowCard key={p.title} title={`${p.title.toUpperCase().replace(/ /g, "_")}_PILLAR.md`}>
          <div style={{ fontFamily: "var(--font-vt323), monospace", fontSize: 30, color: "#E63636", marginBottom: 14, letterSpacing: "0.04em" }}>{p.icon}</div>
          <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 26, marginBottom: 10 }}>{p.title}</h3>
          <p style={{ fontSize: 13, lineHeight: 1.65, opacity: 0.7, marginBottom: 18 }}>{p.desc}</p>
          <hr style={{ border: "none", borderTop: "1px solid rgba(31,41,55,0.15)", marginBottom: 14 }} />
          {p.items.map(b => <div key={b} className="vt" style={{ fontSize: 16, marginBottom: 5, opacity: 0.75 }}>▸ {b}</div>)}
        </WindowCard>
      ))}
    </div>
  </div>
);

// ── LABS ──────────────────────────────────────────────────────
const LabsPage = ({ setPage, setSelectedLab }) => (
  <div className="page-enter page-container">
    <div style={{ marginBottom: 36 }}>
      <SectionLabel>DIRECTORY</SectionLabel>
      <h1 className="section-title">Labs Directory</h1>
      <p className="section-subtitle">Research laboratories in the AthenaX network.</p>
    </div>
    <TerminalPanel title="LAB_INDEX.sys" style={{ marginBottom: 32 }}>
      <div className="term-green">$ ls -la /athenax/labs/</div>
      <div>total <span className="term-red">{SEED_LABS.length}</span> labs · <span className="term-yellow">{SEED_LABS.filter(l => l.active).length}</span> active · <span className="term-green">{SEED_LABS.reduce((a, b) => a + b.papers, 0)}</span> papers published</div>
      <div className="term-dim">&gt; click any card to open lab profile <span className="blink">█</span></div>
    </TerminalPanel>
    <div className="grid-auto">
      {SEED_LABS.map(lab => (
        <LabCard key={lab.id} lab={lab} onClick={() => { setSelectedLab(lab); setPage("lab-profile"); }} />
      ))}
    </div>
  </div>
);

// ── LAB PROFILE ───────────────────────────────────────────────
const LabProfilePage = ({ lab, setPage }) => {
  if (!lab) return (
    <div className="page-enter page-container">
      <WindowCard title="LAB_NOT_FOUND.sys" staticHover>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div className="vt" style={{ fontSize: 20, color: "#E63636", marginBottom: 12 }}>○ NO LAB SELECTED</div>
          <button className="btn btn-primary" onClick={() => setPage("labs")}>← BACK TO LABS</button>
        </div>
      </WindowCard>
    </div>
  );
  const labPapers = SEED_PAPERS.filter(p => p.lab === lab.name);
  return (
    <div className="page-enter page-container">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => setPage("labs")}>← BACK TO LABS</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div>
          <WindowCard title={`LAB_PROFILE — ${lab.name.toUpperCase()}`} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span className={lab.active ? "tag-green" : "tag"}>{lab.active ? "● ACTIVE" : "○ INACTIVE"}</span>
              <span className="tag">{lab.papers} PAPERS</span>
              {lab.tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
            <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 48, marginBottom: 6 }}>{lab.name}</h1>
            <div className="vt" style={{ fontSize: 18, color: "#E63636", marginBottom: 16 }}>{lab.focus}</div>
            <p style={{ fontSize: 14, lineHeight: 1.75, opacity: 0.75 }}>{lab.description}</p>
          </WindowCard>
          <WindowCard title="RESEARCHERS.roster" style={{ marginBottom: 20 }}>
            <div className="grid-auto-sm">
              {lab.researchers.map((r, i) => (
                <div key={i} style={{ border: "1px solid #1F2937", padding: 14 }}>
                  <div style={{ width: 36, height: 36, background: "#1F2937", color: "#FDFBF7", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-londrina), cursive", fontSize: 18, marginBottom: 10 }}>{r.charAt(0)}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{r}</div>
                  <div className="vt" style={{ fontSize: 13, opacity: 0.45 }}>RESEARCHER</div>
                </div>
              ))}
            </div>
          </WindowCard>
          <SectionLabel>PUBLISHED RESEARCH</SectionLabel>
          <div style={{ height: 14 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {labPapers.length > 0
              ? labPapers.map(p => <ResearchCard key={p.id} paper={p} onClick={() => setPage("paper_" + p.id)} />)
              : <div style={{ border: "1px dashed rgba(31,41,55,0.3)", padding: 28, textAlign: "center" }}><span className="vt" style={{ fontSize: 17, opacity: 0.4 }}>NO PAPERS INDEXED FOR THIS LAB</span></div>
            }
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <WindowCard title="LAB_STATS.sys" staticHover>
            {[["PAPERS", lab.papers], ["RESEARCHERS", lab.researchers.length], ["PARTNERS", lab.partners.length], ["STATUS", lab.active ? "ACTIVE" : "INACTIVE"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(31,41,55,0.1)" }}>
                <span className="vt" style={{ fontSize: 15 }}>{k}</span>
                <span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: "#E63636" }}>{v}</span>
              </div>
            ))}
          </WindowCard>
          <WindowCard title="UNIVERSITY_PARTNERS.list" staticHover>
            {lab.partners.map(p => <div key={p} className="vt" style={{ fontSize: 17, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(31,41,55,0.08)" }}>▸ {p}</div>)}
          </WindowCard>
          {lab.active && (
            <WindowCard title="ACTIVE_PROGRAMS.sys">
              <div style={{ border: "1px solid #22C55E", background: "rgba(39,201,63,0.06)", padding: 12, marginBottom: 14 }}>
                <div className="vt" style={{ fontSize: 15, color: "var(--success-green)", marginBottom: 4 }}>● COHORT 01 ACTIVE</div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>ATHENAX × IF Labs Research Cohort 01</div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", fontSize: 16 }} onClick={() => setPage("cohorts")}>VIEW COHORT</button>
            </WindowCard>
          )}
        </div>
      </div>
    </div>
  );
};

// ── UNIVERSITIES ──────────────────────────────────────────────
const UniversitiesPage = ({ setPage }) => (
  <div className="page-enter page-container">
    <div style={{ marginBottom: 48 }}>
      <SectionLabel>ACADEMIC PARTNERSHIPS</SectionLabel>
      <h1 className="section-title">Universities</h1>
      <p className="section-subtitle">AthenaX partners with leading academic institutions to bridge rigorous research with Web3 ecosystem needs.</p>
    </div>
    <WindowCard title="PARTNER_UNIVERSITIES.list" staticHover style={{ marginBottom: 32 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))", gap: 10 }}>
        {["MIT", "Stanford", "Oxford", "Harvard", "ETH Zurich", "Imperial College", "Columbia", "NYU", "Caltech", "Cambridge", "Berkeley", "Yale"].map(u => (
          <div key={u} style={{ border: "1px solid #1F2937", padding: "10px 14px", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 19 }}>{u}</span>
          </div>
        ))}
      </div>
    </WindowCard>
    <div style={{ textAlign: "center" }}>
      <button className="btn btn-primary btn-lg">APPLY AS UNIVERSITY PARTNER</button>
    </div>
  </div>
);

// ── COHORTS (static shell — logic added in Part 6) ────────────
const CohortsPage = ({ setPage }) => {
  const topics = ["AI Agents", "DAO Governance", "Crypto Economics", "Tokenomics", "DeFi Systems", "Digital Nations"];
  const [sel, setSel] = useState(null);
  return (
    <div className="page-enter page-container">
      <div style={{ background: "#1F2937", color: "#FDFBF7", border: "2px solid #1F2937", boxShadow: "4px 4px 0px #E63636", padding: "32px 36px", marginBottom: 36 }}>
        <span className="vt" style={{ fontSize: 14, opacity: 0.45 }}>PROGRAM_001 · STATUS: ACTIVE · COHORT_START: Q1 2025</span>
        <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: "clamp(30px,4.5vw,52px)", lineHeight: 1.05, marginBottom: 14, marginTop: 8 }}>ATHENAX × IF LABS<br />RESEARCH COHORT 01</h1>
        <p style={{ fontSize: 15, opacity: 0.65, maxWidth: 560, lineHeight: 1.65, marginBottom: 28 }}>A 6-month open research program connecting top university researchers with Web3 ecosystem sponsors.</p>
        <button className="btn btn-primary" style={{ border: "2px solid rgba(255,255,255,0.5)" }} onClick={() => setPage("apply-cohort")}>APPLY TO COHORT</button>
      </div>
      <SectionLabel>RESEARCH TRACKS — CLICK TO SELECT</SectionLabel>
      <div style={{ height: 14 }} />
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {topics.map((topic, idx) => (
          <div key={topic} className="window-card" style={{ cursor: "pointer", background: sel === topic ? "#1F2937" : "#FDFBF7", border: sel === topic ? "2px solid #E63636" : "2px solid #1F2937", boxShadow: sel === topic ? "4px 4px 0 #E63636" : "4px 4px 0 #1F2937" }} onClick={() => setSel(sel === topic ? null : topic)}>
            <div className="window-header" style={{ background: sel === topic ? "#E63636" : "#1F2937" }}>
              <TrafficLights />
              <span style={{ fontSize: 12 }}>TRACK_{String(idx + 1).padStart(2, "0")}</span>
              {sel === topic && <span style={{ marginLeft: "auto", fontSize: 12 }}>● SELECTED</span>}
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: sel === topic ? "#E63636" : "#1F2937" }}>{topic}</div>
              <div className="vt" style={{ fontSize: 13, opacity: 0.5, marginTop: 4 }}>RESEARCH TRACK</div>
            </div>
          </div>
        ))}
      </div>
      {sel && (
        <WindowCard title={`TRACK_DETAIL — ${sel.toUpperCase()}`} style={{ marginBottom: 24, border: "2px solid #E63636" }}>
          <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 24, color: "#E63636", marginBottom: 10 }}>{sel}</h3>
          <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.72, marginBottom: 16 }}>
            Apply for the {sel} research track. You'll receive mentorship, funding access, and direct protocol connections.
          </p>
          <button className="btn btn-primary" onClick={() => setPage("apply-cohort")}>APPLY FOR THIS TRACK →</button>
        </WindowCard>
      )}
    </div>
  );
};

// ── ARCHIVE (static shell — logic added in Part 4) ────────────
const ArchivePage = ({ setPage }) => {
  const [filter, setFilter] = useState("ALL");
  const topics = ["ALL", ...Array.from(new Set(SEED_PAPERS.map(p => p.topic)))];
  const filtered = filter === "ALL" ? SEED_PAPERS : SEED_PAPERS.filter(p => p.topic === filter);
  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom: 36 }}>
        <SectionLabel>OPEN ACCESS ARCHIVE</SectionLabel>
        <h1 className="section-title">Research Archive</h1>
        <p className="section-subtitle">All published research — peer-reviewed, open access, always free.</p>
      </div>
      <TerminalPanel title="ARCHIVE_QUERY.sys" style={{ marginBottom: 24 }}>
        <div className="term-green">$ query --database=athenax --sort=citations_desc --status=published</div>
        <div>Found <span className="term-red">{filtered.length}</span> papers · Citations: <span className="term-yellow">{filtered.reduce((a, b) => a + b.citations, 0)}</span></div>
        <div className="term-dim">Filter: <span style={{ color: "#FDFBF7" }}>{filter}</span> <span className="blink">█</span></div>
      </TerminalPanel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
        {topics.map(t => (
          <button key={t} onClick={() => setFilter(t)} className="btn btn-sm" style={{ background: filter === t ? "#1F2937" : "transparent", color: filter === t ? "#FDFBF7" : "#1F2937", boxShadow: filter === t ? "4px 4px 0 #1F2937" : "none" }}>{t}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(paper => (
          <ResearchCard key={paper.id} paper={paper} onClick={() => setPage("paper_" + paper.id)} />
        ))}
      </div>
    </div>
  );
};

// ── PAPER DETAIL (static shell — full system in Part 4) ───────
const PaperPage = ({ paperId, setPage }) => {
  const paper = SEED_PAPERS.find(p => p.id === paperId);
  const [comment, setComment] = useState("");
  if (!paper) return (
    <div className="page-enter page-container">
      <WindowCard title="PAPER_NOT_FOUND.sys" staticHover>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div className="vt" style={{ fontSize: 20, color: "#E63636", marginBottom: 12 }}>○ PAPER NOT FOUND</div>
          <button className="btn btn-primary" onClick={() => setPage("archive")}>← BACK TO ARCHIVE</button>
        </div>
      </WindowCard>
    </div>
  );
  return (
    <div className="page-enter page-container">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={() => setPage("archive")}>← BACK TO ARCHIVE</button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div>
          <WindowCard title={`PAPER_${paper.id}.pdf`} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="tag-accent">{paper.topic}</span>
              <span className="tag">{paper.university}</span>
              <span className="tag">{paper.year}</span>
              <span className="tag-green">PUBLISHED</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, marginBottom: 12 }}>{paper.title}</h1>
            <div className="vt" style={{ fontSize: 17, opacity: 0.6, marginBottom: 4 }}>AUTHORS: {paper.authors.join(" · ")}</div>
            <div className="vt" style={{ fontSize: 14, opacity: 0.4 }}>{paper.university} / {paper.lab}</div>
          </WindowCard>
          <WindowCard title="ABSTRACT.txt" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.82 }}>{paper.abstract}</p>
          </WindowCard>
          <WindowCard title="FULL_PAPER.content" style={{ marginBottom: 20 }}>
            {[["1. Introduction", "This research addresses a fundamental challenge in decentralized systems: balancing cryptographic security guarantees with practical computational efficiency. Our approach builds on prior work while introducing novel constructions that achieve significant performance improvements."], ["2. Methodology", "We employ a multi-phase evaluation framework combining formal verification with empirical benchmarking across a distributed testnet with 128 validator nodes across 4 geographic regions."], ["3. Results", "Our experiments demonstrate a 3.2× improvement in proof generation time and a 67% reduction in on-chain verification costs. Security analysis confirms equivalent cryptographic guarantees."], ["4. Discussion", "The results suggest practical utility for production deployments. Tradeoffs around prover setup time may be addressed through parallel proof generation in follow-on work."], ["5. Conclusion", "We present a novel approach achieving meaningful practical improvements while maintaining strong theoretical guarantees, opening several avenues for future research."]].map(([title, content]) => (
              <div key={title} style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 26, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(31,41,55,0.1)" }}>{title}</h2>
                <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.72 }}>{content}</p>
              </div>
            ))}
          </WindowCard>
          <WindowCard title="COMMUNITY_DISCUSSION.forum">
            {[{ user: "Dr. A. Singh", text: "Excellent methodology. The proof construction in section 4 is particularly novel.", votes: 24 }, { user: "Prof. L. Martinez", text: "Have you considered extending this to optimistic rollup systems? Might be worth a follow-up.", votes: 11 }].map((c, i) => (
              <div key={i} style={{ border: "1px solid rgba(31,41,55,0.15)", padding: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="vt" style={{ fontSize: 16, color: "#E63636" }}>{c.user}</span>
                  <span className="vt" style={{ fontSize: 14, opacity: 0.5 }}>▲ {c.votes}</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.75 }}>{c.text}</p>
              </div>
            ))}
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add to the discussion…" style={{ width: "100%", padding: "10px 12px", fontSize: 13, minHeight: 80, resize: "vertical", marginTop: 8, display: "block" }} />
            <button className="btn btn-primary" style={{ marginTop: 10, fontSize: 16 }}>POST COMMENT</button>
          </WindowCard>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TerminalPanel title="PAPER_STATS.sys">
            <div style={{ marginBottom: 6 }}><span className="term-dim">CITATIONS: </span><span className="term-red">{paper.citations}</span></div>
            <div style={{ marginBottom: 6 }}><span className="term-dim">DOWNLOADS: </span><span className="term-green">{paper.downloads.toLocaleString()}</span></div>
            <div style={{ marginBottom: 6 }}><span className="term-dim">PEER SCORE: </span><span className="term-yellow">{paper.reviewScore}/10</span></div>
            <div><span className="term-dim">VOTES: </span><span className="term-green">{paper.votes}</span></div>
          </TerminalPanel>
          <WindowCard title="DOWNLOADS.sys">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-primary" style={{ width: "100%", fontSize: 16 }}>↓ DOWNLOAD PDF</button>
              <button className="btn btn-secondary" style={{ width: "100%", fontSize: 16 }}>⌥ GITHUB REPO</button>
              <button className="btn btn-secondary" style={{ width: "100%", fontSize: 16 }}>✦ CITE PAPER</button>
            </div>
          </WindowCard>
          <WindowCard title="PEER_REVIEW.score" staticHover>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 64, color: "#E63636", lineHeight: 1 }}>{paper.reviewScore}</div>
              <div className="vt" style={{ fontSize: 13, opacity: 0.5, marginBottom: 12 }}>/ 10.0 · PEER REVIEW SCORE</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{ width: 16, height: 16, background: i < Math.round(paper.reviewScore) ? "#E63636" : "rgba(31,41,55,0.1)", border: "1px solid rgba(31,41,55,0.2)" }} />
                ))}
              </div>
            </div>
          </WindowCard>
        </div>
      </div>
    </div>
  );
};

// ── LEADERBOARD (static — ARS logic in Part 7) ───────────────
const LeaderboardPage = ({ setPage }) => {
  const [tab, setTab] = useState("researchers");
  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom: 36 }}>
        <SectionLabel>RANKINGS</SectionLabel>
        <h1 className="section-title">Leaderboard</h1>
        <p className="section-subtitle">Ranked by citations, peer reviews, downloads, and community votes.</p>
      </div>
      <div style={{ display: "flex", borderBottom: "2px solid #1F2937", marginBottom: 28 }}>
        {[["researchers", "RESEARCHERS"], ["universities", "UNIVERSITIES"], ["labs", "LABS"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: "10px 24px", background: tab === id ? "#1F2937" : "transparent", color: tab === id ? "#FDFBF7" : "#1F2937", border: "none", borderTop: tab === id ? "3px solid #E63636" : "3px solid transparent", fontFamily: "var(--font-vt323), monospace", fontSize: 19, letterSpacing: "0.06em", cursor: "pointer" }}>{label}</button>
        ))}
      </div>
      {tab === "researchers" && (
        <WindowCard title="TOP_RESEARCHERS.rank" staticHover>
          <div style={{ overflowX: "auto", margin: "-20px" }}>
            <table className="retro-table">
              <thead><tr><th>RANK</th><th>RESEARCHER</th><th>LAB</th><th>CITATIONS</th><th>DOWNLOADS</th><th>VOTES</th></tr></thead>
              <tbody>
                {SEED_LEADERBOARD.map(r => (
                  <tr key={r.rank}>
                    <td style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 22, color: r.rank <= 3 ? "#E63636" : "#1F2937" }}>
                      {r.rank === 1 ? <span style={{fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:13,letterSpacing:"0.04em",color:"#E63636"}}>◆ 01</span>
                     : r.rank === 2 ? <span style={{fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:13,letterSpacing:"0.04em",color:"#1F2937"}}>◆ 02</span>
                     : r.rank === 3 ? <span style={{fontFamily:"var(--font-inter), sans-serif",fontWeight:600,fontSize:13,letterSpacing:"0.04em",color:"#1F2937"}}>◆ 03</span>
                     : <span style={{fontFamily:"var(--font-vt323), monospace",fontSize:16,opacity:0.5}}>#{r.rank}</span>}
                    </td>
                    <td><strong>{r.name}</strong><div className="vt" style={{ fontSize: 12, opacity: 0.45 }}>{r.university}</div></td>
                    <td><span className="vt" style={{ fontSize: 14 }}>{r.lab}</span></td>
                    <td><span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: "#E63636" }}>{r.citations}</span></td>
                    <td>{r.downloads.toLocaleString()}</td>
                    <td style={{ color: "var(--success-green)", fontFamily: "var(--font-vt323), monospace", fontSize: 16 }}>{r.votes.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WindowCard>
      )}
      {tab === "labs" && (
        <WindowCard title="TOP_LABS.rank" staticHover>
          <div style={{ overflowX: "auto", margin: "-20px" }}>
            <table className="retro-table">
              <thead><tr><th>RANK</th><th>LAB</th><th>FOCUS</th><th>PAPERS</th><th>STATUS</th></tr></thead>
              <tbody>
                {[...SEED_LABS].sort((a, b) => b.papers - a.papers).map((lab, i) => (
                  <tr key={lab.id} style={{ cursor: "pointer" }} onClick={() => { setSelectedLab?.(lab); setPage("lab-profile"); }}>
                    <td style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: i < 3 ? "#E63636" : "#1F2937" }}>#{i + 1}</td>
                    <td><strong>{lab.name}</strong></td>
                    <td style={{ fontSize: 12, opacity: 0.65 }}>{lab.focus}</td>
                    <td><span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: "#E63636" }}>{lab.papers}</span></td>
                    <td><span className="vt" style={{ fontSize: 14, color: lab.active ? "#22C55E" : "rgba(31,41,55,0.35)" }}>{lab.active ? "● ACTIVE" : "○ INACTIVE"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WindowCard>
      )}
      {tab === "universities" && (
        <WindowCard title="TOP_UNIVERSITIES.rank" staticHover>
          <div style={{ overflowX: "auto", margin: "-20px" }}>
            <table className="retro-table">
              <thead><tr><th>RANK</th><th>UNIVERSITY</th><th>PAPERS</th><th>CITATIONS</th></tr></thead>
              <tbody>
                {[{ r: 1, n: "MIT", p: 34, c: 1240 }, { r: 2, n: "Stanford", p: 28, c: 980 }, { r: 3, n: "Oxford", p: 22, c: 876 }, { r: 4, n: "ETH Zurich", p: 19, c: 654 }, { r: 5, n: "Harvard", p: 15, c: 521 }].map(u => (
                  <tr key={u.r}><td style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: u.r <= 3 ? "#E63636" : "#1F2937" }}>#{u.r}</td><td><strong style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20 }}>{u.n}</strong></td><td>{u.p}</td><td><span style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 20, color: "#E63636" }}>{u.c}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </WindowCard>
      )}
    </div>
  );
};

// ── DASHBOARD (static shell — live data in Parts 2 + 9) ───────
const DashboardPage = ({ setPage }) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); }, []);
  return (
    <div className="page-enter page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
        <div>
          <SectionLabel>RESEARCH COMMAND CENTER</SectionLabel>
          <h1 className="section-title">Dashboard</h1>
          <div className="vt" style={{ fontSize: 15, opacity: 0.45, marginTop: 4 }}>SESSION: public_view · {now.toLocaleDateString()}</div>
        </div>
        <TerminalPanel title="CLOCK.sys" style={{ minWidth: 180 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 40, color: "var(--success-green)" }}>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            <div className="term-dim" style={{ fontSize: 14 }}>{now.toDateString().toUpperCase()}</div>
          </div>
        </TerminalPanel>
      </div>
      <SectionLabel>ECOSYSTEM HEALTH</SectionLabel>
      <div style={{ height: 14 }} />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
        <StatCard label="RESEARCH PAPERS"     value="530"   sub="OPEN ACCESS"        />
        <StatCard label="UNIVERSITIES"         value="18"    sub="IN NETWORK"         />
        <StatCard label="FUNDING DISTRIBUTED"  value="$2.5M" sub="TO RESEARCHERS"     />
        <StatCard label="ACTIVE BOUNTIES"      value="14"    sub="OPEN CHALLENGES"    />
        <StatCard label="TOP LABS"             value="12"    sub="ACTIVE THIS QUARTER"/>
        <StatCard label="RESEARCHERS"          value="340+"  sub="REGISTERED"         />
      </div>
      <SectionLabel>ACTIVE RESEARCH BOUNTIES</SectionLabel>
      <div style={{ height: 14 }} />
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {SEED_BOUNTIES.map(b => (
          <div key={b.id} className="window-card">
            <div className="window-header" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><TrafficLights /><span style={{ fontSize: 13 }}>BOUNTY_{b.id}</span></div>
              <span className="vt" style={{ fontSize: 13, color: "var(--success-green)" }}>● OPEN</span>
            </div>
            <div className="window-body">
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                <span className="tag-accent">{b.topic}</span>
                <span className="tag">{b.sponsor}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 19, lineHeight: 1.2, marginBottom: 10 }}>{b.title}</h3>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 26, color: "#E63636" }}>{b.reward}</div>
                  <div className="vt" style={{ fontSize: 13, opacity: 0.5 }}>{b.applicants} APPLICANTS · DL: {b.deadline}</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setPage("bounties")}>APPLY</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <WindowCard title="LATEST_PUBLICATIONS.feed" staticHover>
          {SEED_PAPERS.slice(0, 4).map((p, i) => (
            <div key={p.id} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < 3 ? "1px solid rgba(31,41,55,0.08)" : "none", cursor: "pointer" }} onClick={() => setPage("paper_" + p.id)}>
              <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <span className="tag-accent" style={{ fontSize: 11 }}>{p.topic}</span>
                <span className="tag" style={{ fontSize: 11 }}>{p.year}</span>
              </div>
              <div style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 18, lineHeight: 1.2, marginBottom: 4 }}>{p.title.slice(0, 60)}…</div>
              <div className="vt" style={{ fontSize: 14, opacity: 0.5 }}>{p.citations} cite · {p.downloads.toLocaleString()} dl</div>
            </div>
          ))}
        </WindowCard>
        <TerminalPanel title="SYSTEM_LOG.sys">
          <div className="term-green" style={{ marginBottom: 4 }}>$ tail -f /var/log/athenax.log</div>
          {[["09:41:22", "Paper PAPER_004 indexed — AI Agents", "term-green"], ["09:38:17", "New researcher joined: IF Labs", ""], ["09:22:05", "Cohort 01 funding disbursed: $83,333", "term-yellow"], ["09:15:44", "Peer review submitted PAPER_003", ""], ["08:59:11", "EigenLayer sponsor confirmed", "term-green"], ["08:47:30", "PAPER_005 reached 300 citations", "term-red"]].map(([t, msg, cls], i) => (
            <div key={i} style={{ marginBottom: 3, opacity: i > 3 ? 0.45 : 1 }}>
              <span className="term-dim">[{t}] </span>
              <span className={cls || ""}>{msg}</span>
            </div>
          ))}
          <div className="term-green" style={{ marginTop: 6 }}><span className="blink">█</span></div>
        </TerminalPanel>
      </div>
    </div>
  );
};

// ── ERROR FALLBACK ────────────────────────────────────────────
const PageError = ({ message = "This page encountered an error.", onBack }) => (
  <div className="page-enter page-container">
    <WindowCard title="PAGE_ERROR.sys" staticHover>
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div className="vt" style={{ fontSize: 22, color: "#E63636", marginBottom: 12 }}>● RENDER_ERROR</div>
        <p style={{ fontSize: 13, opacity: 0.65, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>{message}</p>
        {onBack && <button className="btn btn-primary" onClick={onBack}>← BACK TO HOME</button>}
      </div>
    </WindowCard>
  </div>
);

// ═══════════════════════════════════════════════════════════
// SUBMIT PAPER PAGE
// ═══════════════════════════════════════════════════════════
const TOPICS = ["ZK Proofs","DAO Governance","Tokenomics","AI Agents","Crypto Economics","Digital Nations","DeFi Systems","Layer 2","Security","Protocol Design","Other"];

const SubmitPaperPage = ({ user, setPage, showToast }) => {
  const [step, setStep]     = useState(1); // 1=form, 2=preview
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState({
    title:"", abstract:"", topic:"ZK Proofs", university:"", lab:"",
    coAuthors:"", keywords:"", status:"draft",
  });

  useEffect(() => {
    if (user) setForm(f => ({ ...f, university: user.university||"", lab: user.lab||"" }));
  }, [user]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const iStyle = { width:"100%", padding:"9px 12px", fontFamily:"var(--font-inter), sans-serif", background:"#FDFBF7", border:"2px solid #1F2937", outline:"none", fontSize:13, display:"block", marginTop:4 };
  const lStyle = { fontFamily:"var(--font-vt323), monospace", fontSize:14, letterSpacing:"0.06em", opacity:0.7, display:"block" };

  const validate = () => {
    if (!form.title.trim())    return "Title is required.";
    if (!form.abstract.trim()) return "Abstract is required.";
    if (!form.university.trim()) return "University is required.";
    return null;
  };

  const save = (statusOverride) => {
    const err = validate();
    if (err) { showToast(err, "error"); return; }
    setSaving(true);
    setTimeout(() => {
      const papers = dbRead("ax_submitted_papers", []);
      const paper = {
        id: dbUid("paper"),
        ...form,
        status: statusOverride || form.status,
        authorIds: [user?.id],
        authors: [user?.name || "Anonymous"],
        citations: 0, downloads: 0, reviewScore: 0, votes: 0,
        year: new Date().getFullYear(),
        createdAt: dbNow(),
      };
      dbWrite("ax_submitted_papers", [...papers, paper]);
      setSaving(false);
      showToast(statusOverride === "submitted" ? "Paper submitted for review." : "Draft saved.", "success");
      setPage("profile");
    }, 400);
  };

  if (!user) return (
    <div className="page-enter page-container">
      <WindowCard title="AUTH_REQUIRED.sys" staticHover>
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div className="vt" style={{ fontSize:18, color:"#E63636", marginBottom:12 }}>▣ SIGN IN REQUIRED</div>
          <button className="btn btn-primary" onClick={() => setPage("login")}>SIGN IN TO SUBMIT</button>
        </div>
      </WindowCard>
    </div>
  );

  return (
    <div className="page-enter page-container">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom:20 }} onClick={() => setPage("profile")}>← BACK</button>

      {/* Step tabs */}
      <div style={{ display:"flex", borderBottom:"2px solid #1F2937", marginBottom:28 }}>
        {[["1","PAPER DETAILS"],["2","PREVIEW"]].map(([n,lbl]) => (
          <button key={n} onClick={() => { if(n==="2"&&!validate()) setStep(2); else if(n==="1") setStep(1); }}
            style={{ padding:"10px 28px", background:step===+n?"#1F2937":"transparent", color:step===+n?"#FDFBF7":"#1F2937", border:"none", borderTop:step===+n?"3px solid #E63636":"3px solid transparent", borderRadius:0, fontFamily:"var(--font-inter), sans-serif", fontWeight:600, fontSize:12, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer" }}>
            STEP {n}: {lbl}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24 }}>
          <div>
            <WindowCard title="PAPER_DETAILS.form" style={{ marginBottom:16 }}>
              <div className="form-field">
                <label style={lStyle}>PAPER TITLE *</label>
                <input value={form.title} onChange={set("title")} placeholder="Full title of your research paper" style={iStyle}/>
              </div>
              <div className="form-field">
                <label style={lStyle}>ABSTRACT *</label>
                <textarea value={form.abstract} onChange={set("abstract")} placeholder="Concise summary of the research, methodology, and key findings…" rows={5}
                  style={{ ...iStyle, resize:"vertical", minHeight:110 }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div className="form-field">
                  <label style={lStyle}>RESEARCH TOPIC *</label>
                  <select value={form.topic} onChange={set("topic")} style={{ ...iStyle, cursor:"pointer" }}>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label style={lStyle}>KEYWORDS</label>
                  <input value={form.keywords} onChange={set("keywords")} placeholder="comma separated" style={iStyle}/>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div className="form-field">
                  <label style={lStyle}>UNIVERSITY / INSTITUTION *</label>
                  <input value={form.university} onChange={set("university")} placeholder="MIT, Stanford, Oxford…" style={iStyle}/>
                </div>
                <div className="form-field">
                  <label style={lStyle}>LAB</label>
                  <input value={form.lab} onChange={set("lab")} placeholder="Research lab or group" style={iStyle}/>
                </div>
              </div>
              <div className="form-field">
                <label style={lStyle}>CO-AUTHORS (optional)</label>
                <input value={form.coAuthors} onChange={set("coAuthors")} placeholder="Dr. Jane Smith, Prof. John Doe…" style={iStyle}/>
              </div>
            </WindowCard>

            <WindowCard title="FILE_UPLOAD.sys" staticHover style={{ marginBottom:16 }}>
              <div style={{ border:"2px dashed rgba(31,41,55,0.25)", padding:"28px 20px", textAlign:"center" }}>
                <div className="vt" style={{ fontSize:22, color:"#E63636", marginBottom:8 }}>▤ PAPER FILE</div>
                <p style={{ fontSize:13, opacity:0.55, marginBottom:12 }}>PDF upload — drag and drop or click to select</p>
                <button className="btn btn-ghost btn-sm">SELECT FILE</button>
                <div className="vt" style={{ fontSize:12, opacity:0.3, marginTop:10 }}>MAX 50MB · PDF FORMAT · FILE UPLOAD ACTIVE IN v5.1</div>
              </div>
            </WindowCard>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <TerminalPanel title="SUBMISSION_STATUS.sys">
              <div className="term-dim">STATUS:</div>
              <select value={form.status} onChange={set("status")}
                style={{ background:"#1F2937", color:"#22C55E", border:"1px solid rgba(255,255,255,0.2)", fontFamily:"var(--font-vt323), monospace", fontSize:16, padding:"4px 8px", width:"100%", marginTop:4 }}>
                <option value="draft">DRAFT</option>
                <option value="submitted">SUBMIT FOR REVIEW</option>
              </select>
              <div style={{ marginTop:12, fontSize:13, opacity:0.5 }}>
                {form.status==="draft" ? "Save locally. Submit when ready." : "Will enter peer review queue."}
              </div>
            </TerminalPanel>

            <WindowCard title="SUBMISSION_GUIDE.md" staticHover bodyClass="window-body--sm">
              {[["Title","Clear, descriptive, searchable"],["Abstract","150–300 words. Method + findings."],["Topic","Select the closest research area"],["Keywords","3–6 terms for discoverability"],["Co-authors","Full names, comma separated"]].map(([f,g]) => (
                <div key={f} style={{ paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(31,41,55,0.07)" }}>
                  <div className="vt" style={{ fontSize:14, color:"#E63636" }}>▸ {f}</div>
                  <div style={{ fontSize:12, opacity:0.55 }}>{g}</div>
                </div>
              ))}
            </WindowCard>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button className="btn btn-ghost" style={{ fontSize:16 }} onClick={() => { const e=validate(); if(e){showToast(e,"error");return;} setStep(2); }}>PREVIEW →</button>
              <button className="btn btn-primary" disabled={saving} onClick={() => save("submitted")} style={{ fontSize:18 }}>
                {saving ? "SUBMITTING…" : "SUBMIT FOR REVIEW"}
              </button>
              <button className="btn btn-secondary" disabled={saving} onClick={() => save("draft")} style={{ fontSize:16 }}>
                SAVE AS DRAFT
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:24 }}>
          <div>
            <WindowCard title="PAPER_PREVIEW.pdf" style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
                <span className="tag-accent">{form.topic}</span>
                <span className="tag">{form.university}</span>
                {form.lab && <span className="tag">{form.lab}</span>}
                <span className="tag">{new Date().getFullYear()}</span>
                <span className="tag-yellow">◎ PENDING REVIEW</span>
              </div>
              <h1 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:"clamp(22px,3vw,36px)", lineHeight:1.1, marginBottom:10 }}>
                {form.title || <span style={{ opacity:0.3 }}>UNTITLED PAPER</span>}
              </h1>
              <div className="vt" style={{ fontSize:16, opacity:0.55, marginBottom:14 }}>
                BY: {user.name}{form.coAuthors ? ` · ${form.coAuthors}` : ""}
              </div>
              <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, marginBottom:8 }}>Abstract</h3>
              <p style={{ fontSize:14, lineHeight:1.75, opacity:0.8 }}>{form.abstract || <span style={{ opacity:0.3 }}>No abstract provided.</span>}</p>
              {form.keywords && (
                <div style={{ marginTop:16, display:"flex", gap:6, flexWrap:"wrap" }}>
                  {form.keywords.split(",").map(k => <span key={k} className="tag" style={{ fontSize:11 }}>{k.trim()}</span>)}
                </div>
              )}
            </WindowCard>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <TerminalPanel title="REVIEW_CHECKLIST.sys">
              {[["Title present", !!form.title],["Abstract complete", form.abstract.length>50],["Topic selected", true],["University listed", !!form.university],["Author named", !!user?.name]].map(([item, ok]) => (
                <div key={item} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13 }}>{item}</span>
                  <span className={ok?"term-green":"term-red"}>{ok?"✓":"✗"}</span>
                </div>
              ))}
            </TerminalPanel>
            <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← EDIT</button>
            <button className="btn btn-primary" disabled={saving} onClick={() => save("submitted")} style={{ fontSize:18 }}>
              {saving ? "SUBMITTING…" : "CONFIRM SUBMIT"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// BOUNTY MARKETPLACE PAGE
// ═══════════════════════════════════════════════════════════
const BountyMarketplacePage = ({ user, setPage, showToast }) => {
  const [topicFilter, setTopicFilter] = useState("ALL");
  const [search, setSearch]           = useState("");
  const [selected, setSelected]       = useState(null); // bounty for proposal modal
  const [proposal, setProposal]       = useState({ summary:"", approach:"", timeline:"" });
  const [submitting, setSubmitting]   = useState(false);

  const allBounties = [...SEED_BOUNTIES, ...dbRead("ax_bounties", [])];
  const topics = ["ALL", ...Array.from(new Set(allBounties.map(b => b.topic)))];
  const filtered = allBounties.filter(b => {
    const matchTopic = topicFilter === "ALL" || b.topic === topicFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || (b.sponsor||"").toLowerCase().includes(q);
    return matchTopic && matchSearch;
  });

  const submitProposal = () => {
    if (!user) { showToast("Sign in to submit proposals.", "error"); return; }
    if (!proposal.summary.trim()) { showToast("Proposal summary required.", "error"); return; }
    setSubmitting(true);
    setTimeout(() => {
      const props = dbRead("ax_proposals", []);
      dbWrite("ax_proposals", [...props, {
        id: dbUid("prop"), bountyId: selected.id, userId: user.id,
        userName: user.name, ...proposal, status:"pending", createdAt: dbNow(),
      }]);
      setSubmitting(false);
      setSelected(null);
      setProposal({ summary:"", approach:"", timeline:"" });
      showToast("Proposal submitted successfully.", "success");
    }, 400);
  };

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:32 }}>
        <SectionLabel>RESEARCH BOUNTIES</SectionLabel>
        <h1 className="section-title">Bounty Marketplace</h1>
        <p className="section-subtitle">Open research challenges posted by Web3 protocols. Submit a proposal to claim the reward.</p>
      </div>

      {/* Stats bar */}
      <TerminalPanel title="MARKET_STATUS.sys" style={{ marginBottom:24 }}>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
          <span><span className="term-dim">OPEN BOUNTIES: </span><span className="term-red">{allBounties.length}</span></span>
          <span><span className="term-dim">TOTAL POOL: </span><span className="term-yellow">${allBounties.reduce((s,b)=>s+(+String(b.reward).replace(/[$,K]/g,"")||0),0).toLocaleString()}</span></span>
          <span><span className="term-dim">TOPICS: </span><span className="term-green">{topics.length - 1}</span></span>
          {user?.role==="sponsor" && <button className="btn btn-primary btn-sm" style={{ marginLeft:"auto", fontSize:16 }} onClick={() => setPage("post-bounty")}>+ POST BOUNTY</button>}
        </div>
      </TerminalPanel>

      {/* Filters */}
      <div style={{ display:"flex", gap:10, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bounties…"
          style={{ padding:"8px 12px", fontFamily:"var(--font-inter), sans-serif", background:"#FDFBF7", border:"2px solid #1F2937", outline:"none", fontSize:13, minWidth:220 }}/>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {topics.map(t => (
            <button key={t} onClick={() => setTopicFilter(t)} className="btn btn-sm"
              style={{ background:topicFilter===t?"#1F2937":"transparent", color:topicFilter===t?"#FDFBF7":"#1F2937", boxShadow:topicFilter===t?"4px 4px 0 #1F2937":"none" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bounty list */}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ border:"2px dashed rgba(31,41,55,0.2)", padding:32, textAlign:"center" }}>
            <span className="vt" style={{ fontSize:18, opacity:0.35 }}>NO BOUNTIES MATCH YOUR FILTER</span>
          </div>
        )}
        {filtered.map(b => (
          <div key={b.id} className="window-card">
            <div className="window-header" style={{ justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span style={{ fontSize:13 }}>BOUNTY_{b.id.toUpperCase()}</span></div>
              <span className="vt" style={{ fontSize:13, color:"#22C55E" }}>● OPEN · DL: {b.deadline}</span>
            </div>
            <div className="window-body">
              <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                <span className="tag-accent">{b.topic}</span>
                <span className="tag">◆ {b.sponsor}</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"start" }}>
                <div>
                  <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, lineHeight:1.2, marginBottom:6 }}>{b.title}</h3>
                  {b.description && <p style={{ fontSize:13, lineHeight:1.6, opacity:0.65 }}>{b.description.slice(0,180)}…</p>}
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:32, color:"#E63636", lineHeight:1 }}>{b.reward}</div>
                  <div className="vt" style={{ fontSize:13, opacity:0.5, marginBottom:10 }}>{b.applicants} PROPOSALS</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setSelected(b)}>VIEW + APPLY</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Proposal Modal */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(31,41,55,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e => e.target===e.currentTarget && setSelected(null)}>
          <div style={{ background:"#FDFBF7", border:"3px solid #1F2937", boxShadow:"8px 8px 0 #1F2937", maxWidth:600, width:"100%", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ background:"#1F2937", color:"#FDFBF7", padding:"7px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", fontFamily:"var(--font-vt323), monospace", fontSize:15, letterSpacing:"0.06em" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span>SUBMIT_PROPOSAL — {selected.id.toUpperCase()}</span></div>
              <button onClick={() => setSelected(null)} style={{ background:"none", border:"none", color:"#FDFBF7", cursor:"pointer", fontFamily:"var(--font-inter), sans-serif", fontWeight:600, fontSize:13 }}>✕ CLOSE</button>
            </div>
            <div style={{ padding:24 }}>
              <div style={{ background:"#DBEAFE", border:"1.5px solid #1F2937", padding:14, marginBottom:20, borderRadius:6 }}>
                <div style={{ display:"flex", gap:6, marginBottom:8 }}><span className="tag-accent">{selected.topic}</span><span className="tag">◆ {selected.sponsor}</span></div>
                <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, marginBottom:4 }}>{selected.title}</div>
                <div style={{ display:"flex", gap:16 }}>
                  <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:24, color:"#E63636" }}>{selected.reward}</span>
                  <span className="vt" style={{ fontSize:14, opacity:0.5, alignSelf:"flex-end" }}>DL: {selected.deadline}</span>
                </div>
                {selected.requirements && <p style={{ fontSize:12, marginTop:8, opacity:0.6 }}><strong>Requirements:</strong> {selected.requirements}</p>}
              </div>
              {!user ? (
                <div style={{ textAlign:"center", padding:"20px 0" }}>
                  <div className="vt" style={{ fontSize:17, opacity:0.5, marginBottom:14 }}>SIGN IN TO SUBMIT A PROPOSAL</div>
                  <button className="btn btn-primary" onClick={() => { setSelected(null); setPage("login"); }}>SIGN IN</button>
                </div>
              ) : (
                <>
                  {[["PROPOSAL SUMMARY *","summary","Describe your research approach and qualifications in 2–3 sentences.",true],
                    ["TECHNICAL APPROACH","approach","Outline your methodology and key milestones.",false],
                    ["TIMELINE","timeline","Estimated duration and delivery schedule.",false]].map(([lbl,key,ph,required]) => (
                    <div key={key} style={{ marginBottom:14 }}>
                      <label style={{ fontFamily:"var(--font-vt323), monospace", fontSize:14, opacity:0.7, display:"block", marginBottom:4 }}>{lbl}</label>
                      <textarea value={proposal[key]} onChange={e => setProposal(p => ({...p,[key]:e.target.value}))} placeholder={ph} rows={3}
                        style={{ width:"100%", padding:"9px 12px", fontFamily:"var(--font-inter), sans-serif", background:"#FDFBF7", border:"2px solid #1F2937", outline:"none", fontSize:13, resize:"vertical", display:"block" }}/>
                    </div>
                  ))}
                  <button className="btn btn-primary" disabled={submitting} onClick={submitProposal} style={{ width:"100%", fontSize:19 }}>
                    {submitting ? "SUBMITTING…" : "SUBMIT PROPOSAL"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// POST BOUNTY PAGE
// ═══════════════════════════════════════════════════════════
const PostBountyPage = ({ user, setPage, showToast }) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title:"", description:"", topic:"ZK Proofs", reward:"", deadline:"", requirements:"" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const iStyle = { width:"100%", padding:"9px 12px", fontFamily:"var(--font-inter), sans-serif", background:"#FDFBF7", border:"2px solid #1F2937", outline:"none", fontSize:13, display:"block", marginTop:4 };
  const lStyle = { fontFamily:"var(--font-vt323), monospace", fontSize:14, letterSpacing:"0.06em", opacity:0.7, display:"block" };

  if (!user || user.role !== "sponsor") return (
    <div className="page-enter page-container">
      <WindowCard title="ACCESS_DENIED.sys" staticHover>
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div className="vt" style={{ fontSize:18, color:"#E63636", marginBottom:12 }}>◆ SPONSOR ACCOUNT REQUIRED</div>
          <p style={{ fontSize:13, opacity:0.65, marginBottom:20 }}>Only sponsor accounts can post research bounties.</p>
          <button className="btn btn-primary" onClick={() => setPage("register")}>REGISTER AS SPONSOR</button>
        </div>
      </WindowCard>
    </div>
  );

  const submit = () => {
    if (!form.title.trim())       { showToast("Title required.", "error"); return; }
    if (!form.description.trim()) { showToast("Description required.", "error"); return; }
    if (!form.reward.trim())      { showToast("Reward amount required.", "error"); return; }
    if (!form.deadline)           { showToast("Deadline required.", "error"); return; }
    setSaving(true);
    setTimeout(() => {
      const bounties = dbRead("ax_bounties", []);
      dbWrite("ax_bounties", [...bounties, {
        id: dbUid("B"),
        ...form,
        sponsor: user.organization || user.name,
        sponsorId: user.id,
        applicants: 0, status:"open", createdAt: dbNow(),
      }]);
      setSaving(false);
      showToast("Bounty posted successfully.", "success");
      setPage("bounties");
    }, 400);
  };

  return (
    <div className="page-enter page-container">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom:20 }} onClick={() => setPage("bounties")}>← BACK TO MARKETPLACE</button>
      <div style={{ marginBottom:28 }}>
        <SectionLabel>SPONSOR INTERFACE</SectionLabel>
        <h1 className="section-title">Post a Research Bounty</h1>
        <p className="section-subtitle">Define a research challenge. The best proposal wins the reward.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24 }}>
        <div>
          <WindowCard title="BOUNTY_DETAILS.form" style={{ marginBottom:16 }}>
            <div className="form-field">
              <label style={lStyle}>BOUNTY TITLE *</label>
              <input value={form.title} onChange={set("title")} placeholder="Clear, specific research challenge title" style={iStyle}/>
            </div>
            <div className="form-field">
              <label style={lStyle}>DESCRIPTION *</label>
              <textarea value={form.description} onChange={set("description")} placeholder="Describe the research problem, scope, expected deliverables, and success criteria…" rows={5}
                style={{ ...iStyle, resize:"vertical", minHeight:110 }}/>
            </div>
            <div className="form-field">
              <label style={lStyle}>REQUIREMENTS</label>
              <textarea value={form.requirements} onChange={set("requirements")} placeholder="Required expertise, background, or qualifications…" rows={3}
                style={{ ...iStyle, resize:"vertical" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              <div className="form-field">
                <label style={lStyle}>RESEARCH TOPIC *</label>
                <select value={form.topic} onChange={set("topic")} style={{ ...iStyle, cursor:"pointer" }}>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label style={lStyle}>REWARD AMOUNT *</label>
                <input value={form.reward} onChange={set("reward")} placeholder="$25,000" style={iStyle}/>
              </div>
              <div className="form-field">
                <label style={lStyle}>DEADLINE *</label>
                <input type="date" value={form.deadline} onChange={set("deadline")} style={iStyle}/>
              </div>
            </div>
          </WindowCard>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <WindowCard title="SPONSOR_ID.sys" staticHover>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:36, height:36, background:"#1F2937", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-londrina), cursive", fontSize:18, border:"2px solid #1F2937" }}>
                {user.avatar}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>{user.organization||user.name}</div>
                <div className="vt" style={{ fontSize:13, opacity:0.45 }}>VERIFIED SPONSOR</div>
              </div>
            </div>
            <span className="tag-green" style={{ fontSize:12 }}>◆ SPONSOR VERIFIED</span>
          </WindowCard>

          <WindowCard title="POSTING_GUIDE.md" staticHover bodyClass="window-body--sm">
            {[["Be specific","Clear deliverables = better proposals"],["Set fair reward","Match scope to compensation"],["Realistic deadline","Allow 60–180 days typically"],["List requirements","Saves review time"]].map(([t,d]) => (
              <div key={t} style={{ paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(31,41,55,0.07)" }}>
                <div className="vt" style={{ fontSize:14, color:"#E63636" }}>▸ {t}</div>
                <div style={{ fontSize:12, opacity:0.5 }}>{d}</div>
              </div>
            ))}
          </WindowCard>

          <button className="btn btn-primary" disabled={saving} onClick={submit} style={{ fontSize:19, width:"100%" }}>
            {saving ? "POSTING…" : "POST BOUNTY"}
          </button>
          <button className="btn btn-ghost" onClick={() => setPage("bounties")} style={{ fontSize:16, width:"100%" }}>CANCEL</button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// COHORT APPLICATION PAGE
// ═══════════════════════════════════════════════════════════
const CohortApplicationPage = ({ user, setPage, showToast }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [form, setForm] = useState({
    track:"AI Agents", summary:"", outcomes:"", background:"", commitment:"part-time",
  });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const iStyle = { width:"100%", padding:"9px 12px", fontFamily:"var(--font-inter), sans-serif", background:"#FDFBF7", border:"2px solid #1F2937", outline:"none", fontSize:13, display:"block", marginTop:4 };
  const lStyle = { fontFamily:"var(--font-vt323), monospace", fontSize:14, letterSpacing:"0.06em", opacity:0.7, display:"block" };

  const TRACKS = ["AI Agents","DAO Governance","Crypto Economics","Tokenomics","DeFi Systems","Digital Nations"];

  if (!user) return (
    <div className="page-enter page-container">
      <WindowCard title="AUTH_REQUIRED.sys" staticHover>
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div className="vt" style={{ fontSize:18, color:"#E63636", marginBottom:12 }}>▣ SIGN IN REQUIRED</div>
          <button className="btn btn-primary" onClick={() => setPage("login")}>SIGN IN TO APPLY</button>
        </div>
      </WindowCard>
    </div>
  );

  if (submitted) return (
    <div className="page-enter page-container">
      <WindowCard title="APPLICATION_RECEIVED.sys" staticHover>
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:48, color:"#22C55E", marginBottom:8 }}>◉</div>
          <h2 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:32, marginBottom:10 }}>Application Submitted</h2>
          <p style={{ fontSize:13, opacity:0.65, marginBottom:8 }}>Track: <strong>{form.track}</strong></p>
          <p style={{ fontSize:13, opacity:0.55, marginBottom:24, maxWidth:400, margin:"0 auto 24px" }}>
            Your application has been received. The AthenaX team will review it within 5–10 business days.
          </p>
          <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
            <button className="btn btn-primary" onClick={() => setPage("profile")}>VIEW PROFILE</button>
            <button className="btn btn-ghost" onClick={() => setPage("cohorts")}>BACK TO COHORTS</button>
          </div>
        </div>
      </WindowCard>
    </div>
  );

  const submit = () => {
    if (!form.summary.trim())  { showToast("Proposal summary required.", "error"); return; }
    if (!form.outcomes.trim()) { showToast("Expected outcomes required.", "error"); return; }
    setSubmitting(true);
    setTimeout(() => {
      const apps = dbRead(DB_KEYS.APPLICATIONS, []);
      dbWrite(DB_KEYS.APPLICATIONS, [...apps, {
        id: dbUid("app"), cohortId:"cohort_01", userId:user.id,
        userName:user.name, ...form, status:"pending", createdAt:dbNow(),
      }]);
      setSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="page-enter page-container">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom:20 }} onClick={() => setPage("cohorts")}>← BACK TO COHORTS</button>

      {/* Cohort header */}
      <div style={{ background:"#1F2937", color:"#FDFBF7", border:"3px solid #1F2937", boxShadow:"4px 4px 0 #E63636", padding:"24px 28px", marginBottom:28 }}>
        <div className="vt" style={{ fontSize:13, opacity:0.45, marginBottom:6 }}>APPLICATION FORM · COHORT_01 · STATUS: OPEN</div>
        <h1 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:"clamp(24px,4vw,40px)", lineHeight:1.1 }}>ATHENAX × IF LABS COHORT 01</h1>
        <div className="vt" style={{ fontSize:15, opacity:0.5, marginTop:6 }}>PRIZE POOL: $500,000 · DURATION: 6 MONTHS</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:24 }}>
        <div>
          <WindowCard title="RESEARCH_TRACK.select" style={{ marginBottom:16 }}>
            <label style={lStyle}>SELECT RESEARCH TRACK *</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginTop:8 }}>
              {TRACKS.map(t => (
                <div key={t} onClick={() => setForm(f => ({...f,track:t}))}
                  style={{ cursor:"pointer", border:form.track===t?"2px solid #E63636":"2px solid rgba(31,41,55,0.2)", padding:"10px 14px", background:form.track===t?"rgba(230,54,54,0.06)":"transparent", borderRadius:6, display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:11, height:11, borderRadius:"50%", border:form.track===t?"4px solid #E63636":"2px solid #1F2937", flexShrink:0 }}/>
                  <span style={{ fontFamily:"var(--font-vt323), monospace", fontSize:16, color:form.track===t?"#E63636":"#1F2937" }}>{t}</span>
                </div>
              ))}
            </div>
          </WindowCard>

          <WindowCard title="PROPOSAL_DETAILS.form" style={{ marginBottom:16 }}>
            <div className="form-field">
              <label style={lStyle}>PROPOSAL SUMMARY * <span style={{ opacity:0.4 }}>(150–300 words)</span></label>
              <textarea value={form.summary} onChange={set("summary")} placeholder="Describe your research idea, why it matters for Web3, and your approach…" rows={5}
                style={{ ...iStyle, resize:"vertical", minHeight:110 }}/>
              <div className="vt" style={{ fontSize:12, opacity:0.35, marginTop:4 }}>{form.summary.split(/\s+/).filter(Boolean).length} WORDS</div>
            </div>
            <div className="form-field">
              <label style={lStyle}>EXPECTED OUTCOMES *</label>
              <textarea value={form.outcomes} onChange={set("outcomes")} placeholder="What will you produce? (paper, protocol, dataset, open-source tool…)" rows={3}
                style={{ ...iStyle, resize:"vertical" }}/>
            </div>
            <div className="form-field">
              <label style={lStyle}>RELEVANT BACKGROUND</label>
              <textarea value={form.background} onChange={set("background")} placeholder="Prior research, publications, or projects relevant to this track…" rows={3}
                style={{ ...iStyle, resize:"vertical" }}/>
            </div>
            <div className="form-field">
              <label style={lStyle}>COMMITMENT LEVEL</label>
              <select value={form.commitment} onChange={set("commitment")} style={{ ...iStyle, cursor:"pointer" }}>
                <option value="full-time">Full-time (40h/week)</option>
                <option value="part-time">Part-time (20h/week)</option>
                <option value="research-only">Research-only (flexible)</option>
              </select>
            </div>
          </WindowCard>

          <button className="btn btn-primary" disabled={submitting} onClick={submit} style={{ width:"100%", fontSize:21 }}>
            {submitting ? "SUBMITTING…" : "SUBMIT APPLICATION"}
          </button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {user.role==="researcher" && (
            <WindowCard title="APPLICANT_PROFILE.sys" staticHover>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:36, height:36, background:"#1F2937", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-londrina), cursive", fontSize:18, border:"2px solid #1F2937" }}>{user.avatar}</div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{user.name}</div>
                  <div className="vt" style={{ fontSize:13, opacity:0.4 }}>{user.university||"INDEPENDENT"}</div>
                </div>
              </div>
              <span className="tag-green" style={{ fontSize:11 }}>▣ RESEARCHER</span>
            </WindowCard>
          )}
          <WindowCard title="SELECTION_CRITERIA.md" staticHover bodyClass="window-body--sm">
            <div className="vt" style={{ fontSize:13, color:"#E63636", marginBottom:10 }}>REVIEWED ON:</div>
            {[["Research quality","40%"],["Feasibility","25%"],["Impact potential","20%"],["Researcher background","15%"]].map(([c,w]) => (
              <div key={c} style={{ display:"flex", justifyContent:"space-between", paddingBottom:7, marginBottom:7, borderBottom:"1px solid rgba(31,41,55,0.07)" }}>
                <span style={{ fontSize:12 }}>{c}</span>
                <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:16, color:"#E63636" }}>{w}</span>
              </div>
            ))}
          </WindowCard>
          <WindowCard title="COHORT_BENEFITS.md" staticHover bodyClass="window-body--sm">
            {["$5K–$50K stipend","Lab mentor access","Protocol introductions","ARS reputation boost","Open publication support"].map(b => (
              <div key={b} className="vt" style={{ fontSize:15, marginBottom:6, paddingBottom:6, borderBottom:"1px solid rgba(31,41,55,0.07)" }}>▸ {b}</div>
            ))}
          </WindowCard>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ADMIN PANEL PAGE
// ═══════════════════════════════════════════════════════════
const AdminPanelPage = ({ user, setPage, showToast }) => {
  const [tab, setTab] = useState("papers");

  if (!user || user.role !== "admin") return (
    <div className="page-enter page-container">
      <WindowCard title="ACCESS_DENIED.sys" staticHover>
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <div className="vt" style={{ fontSize:18, color:"#E63636", marginBottom:12 }}>◼ ADMIN ACCESS REQUIRED</div>
          <p style={{ fontSize:13, opacity:0.65, marginBottom:20 }}>This panel is restricted to AthenaX administrators.</p>
          <button className="btn btn-ghost" onClick={() => setPage("home")}>← HOME</button>
        </div>
      </WindowCard>
    </div>
  );

  // Live data
  const submittedPapers = dbRead("ax_submitted_papers", []).filter(p => p.status==="submitted");
  const applications    = dbRead(DB_KEYS.APPLICATIONS, []);
  const allUsers        = dbRead(DB_KEYS.USERS, []);
  const allBounties     = [...SEED_BOUNTIES, ...dbRead("ax_bounties", [])];
  const proposals       = dbRead("ax_proposals", []);

  const updatePaper = (id, status) => {
    const papers = dbRead("ax_submitted_papers", []).map(p => p.id===id ? {...p, status, reviewedAt:dbNow()} : p);
    dbWrite("ax_submitted_papers", papers);
    showToast(`Paper ${status}.`, status==="published"?"success":"info");
  };

  const updateApp = (id, status) => {
    const apps = dbRead(DB_KEYS.APPLICATIONS, []).map(a => a.id===id ? {...a, status, reviewedAt:dbNow()} : a);
    dbWrite(DB_KEYS.APPLICATIONS, apps);
    showToast(`Application ${status}.`, status==="accepted"?"success":"info");
  };

  const statusTag = (s) => {
    const map = { published:"tag-green", accepted:"tag-green", rejected:"tag-accent", pending:"tag-yellow", submitted:"tag-yellow", draft:"tag" };
    return <span className={map[s]||"tag"} style={{ fontSize:11 }}>{(s||"unknown").toUpperCase()}</span>;
  };

  const TABS = [["papers",`PAPERS (${submittedPapers.length})`],["applications",`APPLICATIONS (${applications.length})`],["users",`USERS (${allUsers.length})`],["bounties",`BOUNTIES (${allBounties.length})`]];

  return (
    <div className="page-enter page-container">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:12 }}>
        <div>
          <SectionLabel>SYSTEM ADMINISTRATION</SectionLabel>
          <h1 className="section-title">Admin Panel</h1>
        </div>
        <TerminalPanel title="ADMIN_SESSION.sys" style={{ minWidth:200 }}>
          <div className="term-green">● ADMIN ACTIVE</div>
          <div className="term-dim" style={{ fontSize:13 }}>{user.name}</div>
        </TerminalPanel>
      </div>

      {/* Stats */}
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:24 }}>
        {[["PENDING PAPERS",submittedPapers.length,"#E63636"],["APPLICATIONS",applications.filter(a=>a.status==="pending").length,"#F5A623"],["TOTAL USERS",allUsers.length,"#1F2937"],["OPEN BOUNTIES",allBounties.filter(b=>b.status==="open").length,"#22C55E"]].map(([label,val,color]) => (
          <StatCard key={label} label={label} value={String(val)} sub="" style={{ minWidth:140 }}/>
        ))}
      </div>

      {/* Tab nav */}
      <div style={{ display:"flex", borderBottom:"2px solid #1F2937", marginBottom:20 }}>
        {TABS.map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding:"9px 20px", background:tab===id?"#1F2937":"transparent", color:tab===id?"#FDFBF7":"#1F2937", border:"none", borderTop:tab===id?"3px solid #E63636":"3px solid transparent", borderRadius:0, fontFamily:"var(--font-vt323), monospace", fontSize:16, letterSpacing:"0.06em", cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Papers tab */}
      {tab==="papers" && (
        <WindowCard title="PAPER_REVIEW_QUEUE.sys" staticHover>
          {submittedPapers.length===0 ? (
            <div className="vt" style={{ fontSize:17, opacity:0.35, textAlign:"center", padding:"24px 0" }}>◉ NO PAPERS AWAITING REVIEW</div>
          ) : (
            <div style={{ overflowX:"auto", margin:"-20px" }}>
              <table className="retro-table">
                <thead><tr><th>TITLE</th><th>AUTHOR</th><th>TOPIC</th><th>SUBMITTED</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {submittedPapers.map(p => (
                    <tr key={p.id}>
                      <td style={{ maxWidth:220 }}><div style={{ fontWeight:600, fontSize:12 }}>{p.title.slice(0,60)}{p.title.length>60?"…":""}</div></td>
                      <td>{(p.authors||[]).join(", ")}</td>
                      <td><span className="tag-accent" style={{ fontSize:11 }}>{p.topic}</span></td>
                      <td className="vt" style={{ fontSize:13, opacity:0.5 }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td>{statusTag(p.status)}</td>
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          <button className="btn btn-sm" style={{ background:"#22C55E", color:"#1F2937", fontSize:14 }} onClick={() => updatePaper(p.id,"published")}>APPROVE</button>
                          <button className="btn btn-sm" style={{ background:"#E63636", color:"#FDFBF7", fontSize:14 }} onClick={() => updatePaper(p.id,"rejected")}>REJECT</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </WindowCard>
      )}

      {/* Applications tab */}
      {tab==="applications" && (
        <WindowCard title="COHORT_APPLICATIONS.queue" staticHover>
          {applications.length===0 ? (
            <div className="vt" style={{ fontSize:17, opacity:0.35, textAlign:"center", padding:"24px 0" }}>◉ NO APPLICATIONS SUBMITTED</div>
          ) : (
            <div style={{ overflowX:"auto", margin:"-20px" }}>
              <table className="retro-table">
                <thead><tr><th>APPLICANT</th><th>COHORT</th><th>TRACK</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
                <tbody>
                  {applications.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight:600, fontSize:13 }}>{a.userName||a.userId}</td>
                      <td className="vt" style={{ fontSize:13 }}>{a.cohortId}</td>
                      <td><span className="tag-accent" style={{ fontSize:11 }}>{a.track}</span></td>
                      <td className="vt" style={{ fontSize:13, opacity:0.5 }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td>{statusTag(a.status)}</td>
                      <td>
                        {a.status==="pending" && (
                          <div style={{ display:"flex", gap:6 }}>
                            <button className="btn btn-sm" style={{ background:"#22C55E", color:"#1F2937", fontSize:14 }} onClick={() => updateApp(a.id,"accepted")}>ACCEPT</button>
                            <button className="btn btn-sm" style={{ background:"#E63636", color:"#FDFBF7", fontSize:14 }} onClick={() => updateApp(a.id,"rejected")}>REJECT</button>
                          </div>
                        )}
                        {a.status!=="pending" && <span className="vt" style={{ fontSize:13, opacity:0.4 }}>REVIEWED</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </WindowCard>
      )}

      {/* Users tab */}
      {tab==="users" && (
        <WindowCard title="USER_REGISTRY.sys" staticHover>
          <div style={{ overflowX:"auto", margin:"-20px" }}>
            <table className="retro-table">
              <thead><tr><th>NAME</th><th>EMAIL</th><th>ROLE</th><th>JOINED</th></tr></thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:24, height:24, background:"#1F2937", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-londrina), cursive", fontSize:12, border:"1px solid #1F2937", flexShrink:0 }}>{u.avatar||"?"}</div>
                        <span style={{ fontWeight:600, fontSize:13 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize:12, opacity:0.65 }}>{u.email}</td>
                    <td><span className={u.role==="admin"?"tag-accent":u.role==="researcher"?"tag-green":"tag-yellow"} style={{ fontSize:11 }}>{u.role?.toUpperCase()}</span></td>
                    <td className="vt" style={{ fontSize:13, opacity:0.5 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WindowCard>
      )}

      {/* Bounties tab */}
      {tab==="bounties" && (
        <WindowCard title="BOUNTY_REGISTRY.sys" staticHover>
          <div style={{ overflowX:"auto", margin:"-20px" }}>
            <table className="retro-table">
              <thead><tr><th>TITLE</th><th>SPONSOR</th><th>TOPIC</th><th>REWARD</th><th>PROPOSALS</th><th>STATUS</th></tr></thead>
              <tbody>
                {allBounties.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight:600, fontSize:12, maxWidth:200 }}>{b.title.slice(0,50)}{b.title.length>50?"…":""}</td>
                    <td style={{ fontSize:13 }}>◆ {b.sponsor}</td>
                    <td><span className="tag-accent" style={{ fontSize:11 }}>{b.topic}</span></td>
                    <td style={{ fontFamily:"var(--font-londrina), cursive", fontSize:18, color:"#E63636" }}>{b.reward}</td>
                    <td className="vt" style={{ fontSize:14 }}>{proposals.filter(p=>p.bountyId===b.id).length || b.applicants || 0}</td>
                    <td><span className={b.status==="open"?"tag-green":"tag"} style={{ fontSize:11 }}>{(b.status||"open").toUpperCase()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WindowCard>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// RESEARCH TERMINAL PAGE
// ═══════════════════════════════════════════════════════════
const ResearchTerminalPage = ({ user, setPage }) => {
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState(null);
  const [history,  setHistory]  = useState([
    { type:"system", text:"ATHENAX RESEARCH TERMINAL v5.0 — READY" },
    { type:"system", text:"Type a search query or use commands: /top, /trending, /stats, /help" },
  ]);
  const [topicFocus, setTopicFocus] = useState(null);
  const inputRef = useRef(null);

  const allPapers = [...SEED_PAPERS, ...dbRead("ax_submitted_papers",[]).filter(p=>p.status==="published")];

  const topicCounts = allPapers.reduce((acc, p) => { acc[p.topic]=(acc[p.topic]||0)+1; return acc; }, {});
  const trending = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]);

  const addHistory = (lines) => setHistory(h => [...h, ...lines]);

  const runQuery = (q) => {
    const cmd = q.trim().toLowerCase();
    if (!cmd) return;
    setQuery("");
    addHistory([{ type:"input", text:`$ ${q}` }]);

    if (cmd === "/help") {
      addHistory([
        { type:"output", text:"AVAILABLE COMMANDS:" },
        { type:"output", text:"  /top           — Top papers by citations" },
        { type:"output", text:"  /trending       — Trending research topics" },
        { type:"output", text:"  /stats          — Network statistics" },
        { type:"output", text:"  [search term]   — Search papers, authors, topics" },
      ]);
      return;
    }

    if (cmd === "/stats") {
      addHistory([
        { type:"output", text:`NETWORK STATS:` },
        { type:"stat",   label:"Total papers",       val:allPapers.length },
        { type:"stat",   label:"Total citations",    val:allPapers.reduce((s,p)=>s+(p.citations||0),0) },
        { type:"stat",   label:"Total downloads",    val:allPapers.reduce((s,p)=>s+(p.downloads||0),0).toLocaleString() },
        { type:"stat",   label:"Unique topics",      val:Object.keys(topicCounts).length },
        { type:"stat",   label:"Top topic",          val:trending[0]?.[0]||"—" },
      ]);
      return;
    }

    if (cmd === "/trending") {
      addHistory([
        { type:"output", text:"TRENDING TOPICS (by paper count):" },
        ...trending.map(([t,c], i) => ({ type:"rank", rank:i+1, label:t, val:`${c} paper${c>1?"s":""}` })),
      ]);
      return;
    }

    if (cmd === "/top") {
      const top = [...allPapers].sort((a,b) => (b.citations||0)-(a.citations||0)).slice(0,5);
      addHistory([
        { type:"output", text:"TOP PAPERS BY CITATIONS:" },
        ...top.map((p,i) => ({ type:"paper", rank:i+1, paper:p })),
      ]);
      setResults(top);
      return;
    }

    // Free search
    const q2 = cmd;
    const found = allPapers.filter(p =>
      p.title.toLowerCase().includes(q2) ||
      (p.abstract||"").toLowerCase().includes(q2) ||
      (p.topic||"").toLowerCase().includes(q2) ||
      (p.authors||[]).join(" ").toLowerCase().includes(q2)
    );
    addHistory([
      { type:"output", text:`QUERY: "${q}" — Found ${found.length} result${found.length!==1?"s":""}` },
      ...found.map((p,i) => ({ type:"paper", rank:i+1, paper:p })),
      ...(found.length===0 ? [{ type:"dim", text:"No matching papers. Try /top or /trending." }] : []),
    ]);
    setResults(found.length > 0 ? found : null);
  };

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:24 }}>
        <SectionLabel>RESEARCH INTELLIGENCE</SectionLabel>
        <h1 className="section-title">Research Terminal</h1>
        <p className="section-subtitle">Search the archive. Analyse citations. Surface trends.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:20 }}>
        {/* Main terminal */}
        <div>
          <TerminalPanel title="ATHENAX_TERMINAL.sys" headerRight="v5.0 · READY">
            {/* Output history */}
            <div style={{ minHeight:320, maxHeight:420, overflowY:"auto", marginBottom:16, display:"flex", flexDirection:"column", gap:3 }}>
              {history.map((line, i) => {
                if (line.type==="system")  return <div key={i} style={{ opacity:0.45, fontSize:14 }}>{line.text}</div>;
                if (line.type==="input")   return <div key={i} className="term-green">{line.text}</div>;
                if (line.type==="output")  return <div key={i} className="term-yellow">{line.text}</div>;
                if (line.type==="dim")     return <div key={i} style={{ opacity:0.35 }}>{line.text}</div>;
                if (line.type==="stat")    return <div key={i}><span style={{ opacity:0.5, minWidth:180, display:"inline-block" }}>{line.label}:</span><span className="term-red"> {line.val}</span></div>;
                if (line.type==="rank")    return <div key={i}><span className="term-red" style={{ minWidth:28, display:"inline-block" }}>#{line.rank}</span><span className="term-green">{line.label} </span><span style={{ opacity:0.5 }}>({line.val})</span></div>;
                if (line.type==="paper")   return (
                  <div key={i} onClick={() => setPage("paper_"+line.paper.id)}
                    style={{ padding:"6px 8px", border:"1px solid rgba(255,255,255,0.08)", marginTop:2, cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span className="term-red" style={{ minWidth:28, display:"inline-block" }}>#{line.rank}</span>
                    <span style={{ color:"#FDFBF7" }}>{line.paper.title.slice(0,70)}{line.paper.title.length>70?"…":""}</span>
                    <span style={{ opacity:0.4, marginLeft:12, fontSize:13 }}>{line.paper.citations||0} cite</span>
                  </div>
                );
                return null;
              })}
            </div>
            {/* Input */}
            <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.15)", paddingTop:10 }}>
              <span className="term-green" style={{ flexShrink:0, marginRight:8 }}>$</span>
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key==="Enter" && runQuery(query)}
                placeholder="search papers, authors, topics… or try /top /trending /stats"
                style={{ flex:1, background:"transparent", border:"none", outline:"none", fontFamily:"var(--font-vt323), monospace", fontSize:17, color:"#FDFBF7", caretColor:"#22C55E" }}/>
              <button onClick={() => runQuery(query)} className="btn btn-sm" style={{ background:"#E63636", color:"#FDFBF7", border:"none", fontSize:15, padding:"4px 12px", flexShrink:0 }}>RUN</button>
            </div>
          </TerminalPanel>

          {/* Quick commands */}
          <div style={{ display:"flex", gap:6, marginTop:10, flexWrap:"wrap" }}>
            {[["/top","Top Papers"],["/trending","Trending Topics"],["/stats","Network Stats"],["ZK Proofs","Search ZK"],["DAO","Search DAO"]].map(([cmd,label]) => (
              <button key={cmd} onClick={() => runQuery(cmd)} className="btn btn-ghost btn-sm" style={{ fontSize:14 }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Sidebar panels */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <WindowCard title="TOPIC_DISTRIBUTION.chart" staticHover>
            {trending.map(([topic, count], i) => {
              const max = trending[0]?.[1] || 1;
              return (
                <div key={topic} style={{ marginBottom:10, cursor:"pointer" }} onClick={() => runQuery(topic)}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                    <span style={{ fontSize:12, fontWeight:500 }}>{topic}</span>
                    <span className="vt" style={{ fontSize:13, color:"#E63636" }}>{count}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${(count/max)*100}%` }}/>
                  </div>
                </div>
              );
            })}
          </WindowCard>

          <WindowCard title="CITATION_LEADERS.rank" staticHover>
            {[...allPapers].sort((a,b)=>(b.citations||0)-(a.citations||0)).slice(0,5).map((p,i) => (
              <div key={p.id} onClick={() => setPage("paper_"+p.id)}
                style={{ paddingBottom:8, marginBottom:8, borderBottom:"1px solid rgba(31,41,55,0.08)", cursor:"pointer" }}>
                <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                  <span className="vt" style={{ fontSize:16, color:"#E63636", flexShrink:0 }}>#{i+1}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, lineHeight:1.3, marginBottom:2 }}>{p.title.slice(0,50)}…</div>
                    <span className="vt" style={{ fontSize:13, opacity:0.5 }}>{p.citations} CITE · {p.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </WindowCard>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════
// TALENT MARKETPLACE PAGE
// ═══════════════════════════════════════════════════════════
const TALENT_RESEARCHERS = [
  { id:"r1", name:"Dr. Yuki Tanaka",          role:"ZK Proof Systems",       university:"MIT",       lab:"IF Labs",        ars:9.1, available:true,  tags:["ZK","Layer 2","Cryptography"] },
  { id:"r2", name:"Dankrad Feist",            role:"Protocol Engineering",   university:"ETH Zurich",lab:"EF Research",    ars:9.7, available:false, tags:["Ethereum","PoS","Data Availability"] },
  { id:"r3", name:"Dr. James McCarthy",       role:"AI Agents & Multi-chain",university:"MIT",       lab:"MIT DCI",        ars:8.9, available:true,  tags:["AI Agents","Cross-chain","DeFi"] },
  { id:"r4", name:"Prof. Vili Lehdonvirta",   role:"DAO Governance",         university:"Oxford",    lab:"OII",            ars:8.4, available:true,  tags:["DAOs","Digital Nations","Governance"] },
  { id:"r5", name:"Dr. Felix Chen",           role:"DeFi Protocol Design",   university:"Stanford",  lab:"Stanford Blockchain", ars:7.6, available:true, tags:["DeFi","Tokenomics","AMMs"] },
];
const PROTOCOL_ROLES = [
  { id:"pr1", org:"Ethereum Foundation", role:"Cryptography Researcher",     type:"Full-time",     comp:"$180–240K + ETH",  req:"PhD cryptography, ZK experience",    deadline:"2025-06-30", topic:"ZK Proofs"      },
  { id:"pr2", org:"Arbitrum",            role:"L2 Protocol Engineer",        type:"Full-time",     comp:"$160–200K + ARB",  req:"Distributed systems, Solidity",       deadline:"2025-05-31", topic:"Layer 2"        },
  { id:"pr3", org:"EigenLayer",          role:"Restaking Research Lead",     type:"Full-time",     comp:"$200K + EIGEN",    req:"Game theory, protocol security",      deadline:"2025-07-15", topic:"Security"       },
  { id:"pr4", org:"Uniswap Foundation",  role:"DeFi Research Analyst",       type:"Part-time",     comp:"$80–120K + UNI",   req:"AMM design, tokenomics background",   deadline:"2025-05-15", topic:"DeFi Systems"   },
  { id:"pr5", org:"Mantle",              role:"Modular Architecture Lead",   type:"Full-time",     comp:"$150–190K + MNT",  req:"L2 scaling, data availability",       deadline:"2025-08-01", topic:"Layer 2"        },
  { id:"pr6", org:"Coinbase",            role:"Base L2 Researcher",          type:"Full-time",     comp:"$170–220K + equity",req:"EVM, rollup architecture",            deadline:"2025-06-15", topic:"Layer 2"        },
];
const FELLOWSHIPS = [
  { id:"f1", org:"Ethereum Foundation", name:"ESP Research Fellowship",        stipend:"$60K/yr",  duration:"12 months", topic:"Open",          slots:8  },
  { id:"f2", org:"AthenaX × IF Labs",   name:"Cohort 01 Research Fellowship",  stipend:"$5–50K",   duration:"6 months",  topic:"Multi-track",   slots:20 },
  { id:"f3", org:"Protocol Labs",       name:"Filecoin Research Grant",         stipend:"$40K",     duration:"6 months",  topic:"Storage/DeFi",  slots:5  },
  { id:"f4", org:"a16z crypto",         name:"a16z Crypto Research Track",     stipend:"$80K/yr",  duration:"12 months", topic:"Crypto Economics",slots:4 },
];

const TalentMarketplacePage = ({ user, setPage, showToast }) => {
  const [activeSection, setActiveSection] = useState("researchers");
  const [applying, setApplying]           = useState(null);
  const [appNote,  setAppNote]            = useState("");

  const submitApp = () => {
    if (!user) { showToast("Sign in to apply.", "error"); return; }
    if (!appNote.trim()) { showToast("Add a short note.", "error"); return; }
    const apps = dbRead("ax_talent_apps", []);
    dbWrite("ax_talent_apps", [...apps, { id:dbUid("ta"), roleId:applying.id, userId:user.id, note:appNote, createdAt:dbNow() }]);
    setApplying(null); setAppNote("");
    showToast("Application submitted.", "success");
  };

  const SECTIONS = [["researchers","▣ RESEARCHERS"],["roles","◆ OPEN ROLES"],["fellowships","◉ FELLOWSHIPS"]];

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:32 }}>
        <SectionLabel>TALENT INFRASTRUCTURE</SectionLabel>
        <h1 className="section-title">Talent Marketplace</h1>
        <p className="section-subtitle">Connect credentialed researchers with protocols, startups, and fellowship programs.</p>
      </div>

      <TerminalPanel title="MARKET_STATUS.sys" style={{ marginBottom:24 }}>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
          {[["RESEARCHERS",TALENT_RESEARCHERS.filter(r=>r.available).length+" AVAILABLE"],["OPEN ROLES",PROTOCOL_ROLES.length+" LISTINGS"],["FELLOWSHIPS",FELLOWSHIPS.length+" PROGRAMS"],["AVG ARS",((TALENT_RESEARCHERS.reduce((s,r)=>s+r.ars,0)/TALENT_RESEARCHERS.length).toFixed(1))]].map(([k,v])=>(
            <span key={k}><span className="term-dim">{k}: </span><span className="term-red">{v}</span></span>
          ))}
        </div>
      </TerminalPanel>

      {/* Section tabs */}
      <div style={{ display:"flex", borderBottom:"2px solid #1F2937", marginBottom:24 }}>
        {SECTIONS.map(([id,lbl])=>(
          <button key={id} onClick={()=>setActiveSection(id)}
            style={{ padding:"9px 22px", background:activeSection===id?"#1F2937":"transparent", color:activeSection===id?"#FDFBF7":"#1F2937", border:"none", borderTop:activeSection===id?"3px solid #E63636":"3px solid transparent", fontFamily:"var(--font-vt323), monospace", fontSize:17, letterSpacing:"0.06em", cursor:"pointer" }}>
            {lbl}
          </button>
        ))}
      </div>

      {/* Featured researchers */}
      {activeSection==="researchers" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {TALENT_RESEARCHERS.map(r=>(
              <WindowCard key={r.id} title={`RES_${r.id.toUpperCase()}.profile`}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ width:44, height:44, background:"#1F2937", color:"#FDFBF7", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-londrina), cursive", fontSize:22, border:"2px solid #1F2937", flexShrink:0 }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:20, lineHeight:1.1 }}>{r.name}</div>
                    <div className="vt" style={{ fontSize:13, opacity:0.5 }}>{r.university} · {r.lab}</div>
                  </div>
                </div>
                <div style={{ marginBottom:10 }}>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>{r.role}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {r.tags.map(t=><span key={t} className="tag" style={{ fontSize:11 }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, color:"#E63636" }}>ARS {r.ars}</span>
                  <span className={r.available?"tag-green":"tag"} style={{ fontSize:11 }}>{r.available?"◉ AVAILABLE":"○ ENGAGED"}</span>
                </div>
                {r.available && (
                  <button className="btn btn-primary btn-sm" style={{ width:"100%", marginTop:10, fontSize:15 }}
                    onClick={()=>setApplying({id:r.id, title:`Contact ${r.name}`, type:"researcher"})}>
                    REQUEST INTRODUCTION
                  </button>
                )}
              </WindowCard>
            ))}
          </div>
        </div>
      )}

      {/* Open roles */}
      {activeSection==="roles" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {PROTOCOL_ROLES.map(role=>(
            <div key={role.id} className="window-card">
              <div className="window-header" style={{ justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span className="vt" style={{ fontSize:13 }}>ROLE_{role.id.toUpperCase()}</span></div>
                <span className="vt" style={{ fontSize:13, opacity:0.5 }}>DL: {role.deadline}</span>
              </div>
              <div className="window-body">
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"start" }}>
                  <div>
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                      <span className="tag-accent">{role.topic}</span>
                      <span className="tag">◆ {role.org}</span>
                      <span className="tag-yellow">{role.type}</span>
                    </div>
                    <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, marginBottom:6 }}>{role.role}</h3>
                    <div className="vt" style={{ fontSize:14, opacity:0.55 }}>REQ: {role.req}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:20, color:"#E63636", lineHeight:1.2 }}>{role.comp}</div>
                    <button className="btn btn-primary btn-sm" style={{ marginTop:10, fontSize:15 }}
                      onClick={()=>setApplying({id:role.id, title:role.role, org:role.org, type:"role"})}>
                      APPLY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fellowships */}
      {activeSection==="fellowships" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:16 }}>
          {FELLOWSHIPS.map(f=>(
            <WindowCard key={f.id} title={`FELLOWSHIP_${f.id.toUpperCase()}.sys`}>
              <div className="vt" style={{ fontSize:13, color:"#E63636", marginBottom:6 }}>◆ {f.org}</div>
              <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, lineHeight:1.2, marginBottom:10 }}>{f.name}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:14 }}>
                {[["STIPEND",f.stipend],["DURATION",f.duration],["TOPIC",f.topic],["SLOTS",f.slots+" open"]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", paddingBottom:5, borderBottom:"1px solid rgba(31,41,55,0.08)" }}>
                    <span className="vt" style={{ fontSize:13, opacity:0.5 }}>{k}</span>
                    <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:17, color:"#E63636" }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary btn-sm" style={{ width:"100%", fontSize:15 }}
                onClick={()=>setApplying({id:f.id, title:f.name, org:f.org, type:"fellowship"})}>
                APPLY FOR FELLOWSHIP
              </button>
            </WindowCard>
          ))}
        </div>
      )}

      {/* Apply modal */}
      {applying && (
        <div style={{ position:"fixed", inset:0, background:"rgba(31,41,55,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
          onClick={e=>e.target===e.currentTarget&&setApplying(null)}>
          <div style={{ background:"#FDFBF7", border:"3px solid #1F2937", boxShadow:"8px 8px 0 #1F2937", maxWidth:500, width:"100%" }}>
            <div style={{ background:"#1F2937", color:"#FDFBF7", padding:"7px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", fontFamily:"var(--font-vt323), monospace", fontSize:15 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span>APPLY — {applying.title.toUpperCase().slice(0,30)}</span></div>
              <button onClick={()=>setApplying(null)} style={{ background:"none", border:"none", color:"#FDFBF7", cursor:"pointer", fontFamily:"var(--font-inter), sans-serif", fontWeight:600, fontSize:14 }}>✕</button>
            </div>
            <div style={{ padding:24 }}>
              {!user ? (
                <div style={{ textAlign:"center", padding:"16px 0" }}>
                  <div className="vt" style={{ fontSize:16, opacity:0.5, marginBottom:14 }}>SIGN IN TO APPLY</div>
                  <button className="btn btn-primary" onClick={()=>{setApplying(null);setPage("login");}}>SIGN IN</button>
                </div>
              ) : (
                <>
                  <div style={{ background:"var(--accent-blue)", border:"2px solid #1F2937", padding:12, marginBottom:16, fontFamily:"var(--font-vt323), monospace", fontSize:14, borderRadius:6 }}>
                    {applying.org && <div style={{ opacity:0.5, marginBottom:2 }}>◆ {applying.org}</div>}
                    <div style={{ fontSize:17 }}>{applying.title}</div>
                  </div>
                  <label style={{ fontFamily:"var(--font-vt323), monospace", fontSize:14, opacity:0.7, display:"block", marginBottom:4 }}>COVER NOTE *</label>
                  <textarea value={appNote} onChange={e=>setAppNote(e.target.value)} rows={4} placeholder="Brief introduction and why you're a strong fit…"
                    style={{ width:"100%", padding:"9px 12px", fontFamily:"var(--font-inter), sans-serif", background:"#FDFBF7", border:"2px solid #1F2937", outline:"none", fontSize:13, resize:"vertical", display:"block", marginBottom:16 }}/>
                  <button className="btn btn-primary" style={{ width:"100%", fontSize:19 }} onClick={submitApp}>SUBMIT APPLICATION</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// RESEARCH REPORTS PAGE
// ═══════════════════════════════════════════════════════════
const REPORTS = [
  { id:"rp1", type:"WHITEPAPER",       title:"AthenaX Protocol: Decentralised Research Infrastructure for Web3",          authors:"AthenaX Core Team",          date:"2024-Q4", pages:48, downloads:3240, abstract:"The foundational whitepaper outlining AthenaX's architecture, incentive design, ARS scoring, and long-term research network vision." },
  { id:"rp2", type:"ECOSYSTEM REPORT", title:"State of Web3 Research 2024: Funding, Output, and Protocol Adoption",        authors:"AthenaX Research Team",      date:"2024-Q4", pages:92, downloads:5810, abstract:"A comprehensive analysis of academic output in Web3, covering 400+ papers, $80M+ in research funding, and adoption metrics across 12 major protocols." },
  { id:"rp3", type:"WHITEPAPER",       title:"ARS: A Reputation Scoring System for Decentralised Academic Research",       authors:"Dr. Yuki Tanaka, AthenaX",   date:"2024-Q3", pages:32, downloads:2190, abstract:"Formal specification of the AthenaX Reputation Score (ARS), including mathematical foundations, anti-gaming mechanisms, and calibration methodology." },
  { id:"rp4", type:"QUARTERLY BRIEF",  title:"Q4 2024 Research Digest: ZK Proofs, DAO Governance, and AI Agents",         authors:"AthenaX Research Team",      date:"2024-Q4", pages:24, downloads:4420, abstract:"Quarterly synthesis of the most impactful published research across AthenaX's six primary research tracks, with citation analysis and trend forecasting." },
  { id:"rp5", type:"QUARTERLY BRIEF",  title:"Q3 2024 Research Digest: Layer 2 Scaling and Cross-chain Interoperability", authors:"AthenaX Research Team",      date:"2024-Q3", pages:22, downloads:3150, abstract:"Focused analysis of Layer 2 research output in Q3 2024, including rollup benchmarks, data availability solutions, and sequencer decentralisation progress." },
  { id:"rp6", type:"ECOSYSTEM REPORT", title:"Talent Report 2024: Where Web3 Researchers Are, and Where Protocols Need Them",authors:"AthenaX Talent Team",      date:"2024-Q4", pages:36, downloads:2870, abstract:"Mapping of researcher supply and protocol demand across Web3's key research areas, with salary benchmarks and fellowship impact data." },
];

const ResearchReportsPage = ({ setPage }) => {
  const [typeFilter, setTypeFilter] = useState("ALL");
  const types = ["ALL",...Array.from(new Set(REPORTS.map(r=>r.type)))];
  const filtered = typeFilter==="ALL" ? REPORTS : REPORTS.filter(r=>r.type===typeFilter);

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:32 }}>
        <SectionLabel>OFFICIAL PUBLICATIONS</SectionLabel>
        <h1 className="section-title">AthenaX Research Reports</h1>
        <p className="section-subtitle">Whitepapers, ecosystem analyses, and quarterly research digests from the AthenaX team.</p>
      </div>

      <TerminalPanel title="ARCHIVE_INDEX.sys" style={{ marginBottom:24 }}>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
          {[["DOCUMENTS",REPORTS.length],["TOTAL DOWNLOADS",REPORTS.reduce((s,r)=>s+r.downloads,0).toLocaleString()],["WHITEPAPERS",REPORTS.filter(r=>r.type==="WHITEPAPER").length],["QUARTERLY BRIEFS",REPORTS.filter(r=>r.type==="QUARTERLY BRIEF").length]].map(([k,v])=>(
            <span key={k}><span className="term-dim">{k}: </span><span className="term-red">{v}</span></span>
          ))}
        </div>
      </TerminalPanel>

      {/* Type filter */}
      <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
        {types.map(t=>(
          <button key={t} onClick={()=>setTypeFilter(t)} className="btn btn-sm"
            style={{ background:typeFilter===t?"#1F2937":"transparent", color:typeFilter===t?"#FDFBF7":"#1F2937", boxShadow:typeFilter===t?"4px 4px 0 #1F2937":"none" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(r=>(
          <div key={r.id} className="window-card">
            <div className="window-header" style={{ justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span className="vt" style={{ fontSize:13 }}>DOC_{r.id.toUpperCase()}</span></div>
              <span className="vt" style={{ fontSize:13, opacity:0.5 }}>{r.date} · {r.pages}pp</span>
            </div>
            <div className="window-body">
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"start" }}>
                <div>
                  <div style={{ display:"flex", gap:6, marginBottom:8 }}>
                    <span className="tag-accent" style={{ fontSize:11 }}>{r.type}</span>
                  </div>
                  <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, lineHeight:1.2, marginBottom:8 }}>{r.title}</h3>
                  <div className="vt" style={{ fontSize:14, opacity:0.5, marginBottom:8 }}>BY: {r.authors}</div>
                  <p style={{ fontSize:13, lineHeight:1.65, opacity:0.7 }}>{r.abstract}</p>
                </div>
                <div style={{ flexShrink:0, textAlign:"right" }}>
                  <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:20, color:"#E63636", marginBottom:4 }}>{r.downloads.toLocaleString()}</div>
                  <div className="vt" style={{ fontSize:12, opacity:0.4, marginBottom:14 }}>DOWNLOADS</div>
                  <button className="btn btn-primary btn-sm" style={{ fontSize:15, display:"block", width:"100%", marginBottom:6 }}>▤ READ PDF</button>
                  <button className="btn btn-secondary btn-sm" style={{ fontSize:14, display:"block", width:"100%" }}>↓ DOWNLOAD</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ATHENAX LIVE PAGE
// ═══════════════════════════════════════════════════════════
const LIVE_UPCOMING = [
  { id:"lv1", title:"ZK Proof Systems: From Theory to Production",       host:"Dr. Yuki Tanaka",          date:"2025-02-14", time:"18:00 UTC", type:"LIVE STREAM",    attendees:312, topic:"ZK Proofs"      },
  { id:"lv2", title:"DAO Governance Failures: Lessons from 2024",        host:"Prof. Vili Lehdonvirta",   date:"2025-02-18", time:"17:00 UTC", type:"ROUNDTABLE",     attendees:186, topic:"DAO Governance"  },
  { id:"lv3", title:"AI Agents in DeFi: Risk Models and Coordination",   host:"Dr. James McCarthy",       date:"2025-02-21", time:"19:00 UTC", type:"LIVE STREAM",    attendees:445, topic:"AI Agents"       },
  { id:"lv4", title:"Cohort 01 — Mid-point Research Presentations",      host:"AthenaX × IF Labs",        date:"2025-02-28", time:"16:00 UTC", type:"COHORT DEMO",    attendees:520, topic:"Multi-track"     },
];
const LIVE_RECORDED = [
  { id:"rc1", title:"EigenLayer: Restaking Security Models Explained",      host:"Dankrad Feist",          date:"2024-12-10", views:4820, duration:"52 min", topic:"Security"       },
  { id:"rc2", title:"Tokenomics Deep Dive: Supply Mechanics and Inflation", host:"Dr. Felix Chen",         date:"2024-12-03", views:3210, duration:"44 min", topic:"Tokenomics"     },
  { id:"rc3", title:"State of Web3 Research 2024 — Annual Review",         host:"AthenaX Research Team",  date:"2024-11-28", views:7640, duration:"78 min", topic:"Ecosystem"      },
  { id:"rc4", title:"Cross-chain MEV: Measurement and Mitigation",         host:"Dr. James McCarthy",     date:"2024-11-15", views:2980, duration:"38 min", topic:"DeFi Systems"   },
  { id:"rc5", title:"Digital Nations: Building Governance from First Principles",host:"Prof. Vili Lehdonvirta",date:"2024-11-05",views:1870,duration:"61 min",topic:"Digital Nations"},
];

const AthenaXLivePage = ({ user, setPage, showToast }) => {
  const [tab, setTab] = useState("upcoming");

  const register = (ev) => {
    if (!user) { showToast("Sign in to register for events.", "error"); return; }
    showToast(`Registered for: ${ev.title.slice(0,40)}…`, "success");
  };

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:32 }}>
        <SectionLabel>LIVE RESEARCH MEDIA</SectionLabel>
        <h1 className="section-title">AthenaX Live</h1>
        <p className="section-subtitle">Live research streams, recorded talks, and protocol design sessions from the AthenaX network.</p>
      </div>

      {/* Next event banner */}
      <div style={{ background:"#1F2937", color:"#FDFBF7", border:"3px solid #1F2937", boxShadow:"4px 4px 0 #E63636", padding:"20px 28px", marginBottom:28, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
        <div>
          <div className="vt" style={{ fontSize:13, color:"#E63636", marginBottom:4 }}>● NEXT LIVE · {LIVE_UPCOMING[0].date} · {LIVE_UPCOMING[0].time}</div>
          <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:"clamp(18px,3vw,28px)", lineHeight:1.2 }}>{LIVE_UPCOMING[0].title}</div>
          <div className="vt" style={{ fontSize:14, opacity:0.5, marginTop:4 }}>HOST: {LIVE_UPCOMING[0].host} · {LIVE_UPCOMING[0].attendees} REGISTERED</div>
        </div>
        <button className="btn btn-primary" style={{ fontSize:18, flexShrink:0 }} onClick={()=>register(LIVE_UPCOMING[0])}>REGISTER ◎</button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", borderBottom:"2px solid #1F2937", marginBottom:24 }}>
        {[["upcoming","▸ UPCOMING"],["recorded","▤ RECORDED"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ padding:"9px 24px", background:tab===id?"#1F2937":"transparent", color:tab===id?"#FDFBF7":"#1F2937", border:"none", borderTop:tab===id?"3px solid #E63636":"3px solid transparent", borderRadius:0, fontFamily:"var(--font-inter), sans-serif", fontWeight:600, fontSize:12, letterSpacing:"0.06em", textTransform:"uppercase", cursor:"pointer" }}>
            {lbl}
          </button>
        ))}
      </div>

      {tab==="upcoming" && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {LIVE_UPCOMING.map(ev=>(
            <div key={ev.id} className="window-card">
              <div className="window-header" style={{ justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span className="vt" style={{ fontSize:13 }}>EVENT_{ev.id.toUpperCase()} · {ev.date} {ev.time}</span></div>
                <span className="vt" style={{ fontSize:13, color:"#E63636" }}>● {ev.type}</span>
              </div>
              <div className="window-body">
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:16, alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex", gap:6, marginBottom:8 }}><span className="tag-accent">{ev.topic}</span></div>
                    <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, lineHeight:1.2, marginBottom:4 }}>{ev.title}</h3>
                    <div className="vt" style={{ fontSize:14, opacity:0.5 }}>HOST: {ev.host} · {ev.attendees} REGISTERED</div>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ fontSize:15, flexShrink:0 }} onClick={()=>register(ev)}>REGISTER</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="recorded" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
          {LIVE_RECORDED.map(v=>(
            <WindowCard key={v.id} title={`REC_${v.id.toUpperCase()}.mp4`}>
              {/* Thumbnail placeholder */}
              <div style={{ background:"#1F2937", height:120, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, border:"1px solid rgba(255,255,255,0.08)" }}>
                <span className="vt" style={{ fontSize:32, color:"rgba(230,54,54,0.6)" }}>▸</span>
              </div>
              <div style={{ display:"flex", gap:5, marginBottom:8 }}><span className="tag-accent" style={{ fontSize:11 }}>{v.topic}</span></div>
              <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:18, lineHeight:1.2, marginBottom:6 }}>{v.title}</h3>
              <div className="vt" style={{ fontSize:13, opacity:0.45, marginBottom:10 }}>{v.host} · {v.date} · {v.duration}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:18, color:"#E63636" }}>{v.views.toLocaleString()} views</span>
                <button className="btn btn-primary btn-sm" style={{ fontSize:15 }}>▸ WATCH</button>
              </div>
            </WindowCard>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ROUNDTABLE DISCUSSIONS PAGE
// ═══════════════════════════════════════════════════════════
const ROUNDTABLES = [
  { id:"rt1", title:"Is DAO Governance Fundamentally Broken?",                    participants:["Prof. Vili Lehdonvirta","Dr. Clara Jensen","Kain Warwick"],       date:"2024-12-15", duration:"94 min",  views:6210, topic:"DAO Governance",   format:"DEBATE",     summary:"A structured academic debate examining whether token-weighted voting is structurally incompatible with effective governance at scale." },
  { id:"rt2", title:"ZK Proofs: Academic Rigour vs Production Reality",            participants:["Dr. Yuki Tanaka","Dankrad Feist","Justin Drake"],                 date:"2024-11-20", duration:"72 min",  views:5480, topic:"ZK Proofs",        format:"ROUNDTABLE", summary:"Leading ZK researchers debate the gap between academic proof systems and what actually ships in production rollups today." },
  { id:"rt3", title:"Protocol Incentive Design: Where Game Theory Breaks Down",    participants:["Dr. Felix Chen","Dr. James McCarthy","Prof. Tim Roughgarden"],   date:"2024-11-08", duration:"88 min",  views:4190, topic:"Crypto Economics",  format:"PANEL",      summary:"A technical panel exploring failure modes in protocol incentive mechanisms, drawing on examples from DeFi liquidations and validator behaviour." },
  { id:"rt4", title:"Digital Nations and the Future of Sovereignty",               participants:["Prof. Vili Lehdonvirta","Balaji Srinivasan","Dr. Markus Ante"],   date:"2024-10-25", duration:"106 min", views:8320, topic:"Digital Nations",   format:"DEBATE",     summary:"High-stakes debate on whether network states represent genuine political innovation or techno-libertarian fantasy." },
  { id:"rt5", title:"AI Agents in Web3: Opportunity or Systemic Risk?",            participants:["Dr. James McCarthy","Elena Rodriguez","Illia Polosukhin"],       date:"2024-10-12", duration:"68 min",  views:3870, topic:"AI Agents",         format:"ROUNDTABLE", summary:"Examining the dual-use nature of autonomous AI agents operating on-chain, from MEV bots to protocol governance participants." },
  { id:"rt6", title:"The Research Credentialing Problem in Crypto",                participants:["AthenaX Panel","Vitalik Buterin","Prof. Neha Narula"],            date:"2024-09-28", duration:"55 min",  views:11240,topic:"Ecosystem",          format:"PANEL",      summary:"Why Web3 lacks credible research infrastructure and what it would take to build rigorous academic standards in a permissionless ecosystem." },
];

const RoundtablesPage = ({ setPage }) => {
  const [topicFilter, setTopicFilter] = useState("ALL");
  const topics = ["ALL",...Array.from(new Set(ROUNDTABLES.map(r=>r.topic)))];
  const filtered = topicFilter==="ALL" ? ROUNDTABLES : ROUNDTABLES.filter(r=>r.topic===topicFilter);
  const formatColor = { DEBATE:"#E63636", ROUNDTABLE:"#F5A623", PANEL:"#22C55E" };

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:32 }}>
        <SectionLabel>ACADEMIC DISCOURSE</SectionLabel>
        <h1 className="section-title">Roundtable Discussions</h1>
        <p className="section-subtitle">Recorded debates, panels, and protocol design discussions from leading Web3 researchers.</p>
      </div>

      <TerminalPanel title="DISCUSSION_ARCHIVE.sys" style={{ marginBottom:24 }}>
        <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
          {[["SESSIONS",ROUNDTABLES.length],["TOTAL VIEWS",ROUNDTABLES.reduce((s,r)=>s+r.views,0).toLocaleString()],["FORMATS","3 (DEBATE·PANEL·ROUNDTABLE)"],["TOPICS",topics.length-1]].map(([k,v])=>(
            <span key={k}><span className="term-dim">{k}: </span><span className="term-red">{v}</span></span>
          ))}
        </div>
      </TerminalPanel>

      <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
        {topics.map(t=>(
          <button key={t} onClick={()=>setTopicFilter(t)} className="btn btn-sm"
            style={{ background:topicFilter===t?"#1F2937":"transparent", color:topicFilter===t?"#FDFBF7":"#1F2937", boxShadow:topicFilter===t?"4px 4px 0 #1F2937":"none" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {filtered.map(rt=>(
          <div key={rt.id} className="window-card">
            <div className="window-header" style={{ justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}><TrafficLights/><span className="vt" style={{ fontSize:13 }}>DISC_{rt.id.toUpperCase()} · {rt.date}</span></div>
              <span className="vt" style={{ fontSize:13, color:formatColor[rt.format]||"#1F2937" }}>◈ {rt.format}</span>
            </div>
            <div className="window-body">
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"start" }}>
                <div>
                  <div style={{ display:"flex", gap:6, marginBottom:8 }}><span className="tag-accent">{rt.topic}</span><span className="tag">{rt.duration}</span></div>
                  <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, lineHeight:1.2, marginBottom:8 }}>{rt.title}</h3>
                  <p style={{ fontSize:13, lineHeight:1.65, opacity:0.65, marginBottom:10 }}>{rt.summary}</p>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {rt.participants.map(p=><span key={p} className="tag" style={{ fontSize:11 }}>▣ {p}</span>)}
                  </div>
                </div>
                <div style={{ flexShrink:0, textAlign:"right" }}>
                  <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, color:"#E63636" }}>{rt.views.toLocaleString()}</div>
                  <div className="vt" style={{ fontSize:12, opacity:0.4, marginBottom:14 }}>VIEWS</div>
                  <button className="btn btn-primary btn-sm" style={{ fontSize:15, display:"block", width:"100%", marginBottom:6 }}>▸ WATCH</button>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize:13, display:"block", width:"100%" }}>TRANSCRIPT</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// RESEARCH DIGEST NEWSLETTER PAGE
// ═══════════════════════════════════════════════════════════
const DIGEST_ISSUES = [
  { id:"d1", issue:"#042", date:"2025-01-27", title:"ZK Rollups Hit Production Maturity",         papers:6, downloads:2840, featured:"ZK-SNARKs in Layer 2 Rollup Systems" },
  { id:"d2", issue:"#041", date:"2025-01-20", title:"DAO Governance Undergoes Reckoning",          papers:5, downloads:2210, featured:"DAO Governance Mechanisms: Voting Theory" },
  { id:"d3", issue:"#040", date:"2025-01-13", title:"AI Agents Begin Colonising DeFi Protocols",  papers:7, downloads:3190, featured:"AI Agent Coordination in Multi-Chain Environments" },
  { id:"d4", issue:"#039", date:"2025-01-06", title:"2024 in Web3 Research: The Annual Review",   papers:12,downloads:6420, featured:"State of Web3 Research 2024" },
  { id:"d5", issue:"#038", date:"2024-12-23", title:"Restaking Economics: Signal or Noise?",      papers:4, downloads:1870, featured:"Crypto Economic Security: Game Theoretic Models" },
];
const TIERS = [
  { id:"free",  name:"FREE",        price:"$0/mo",    color:"rgba(31,41,55,0.06)", border:"rgba(31,41,55,0.2)",  features:["Weekly digest email","Top 3 papers","Topic filter","Archive access (last 4 weeks)"] },
  { id:"pro",   name:"RESEARCHER",  price:"$29/mo",   color:"rgba(230,54,54,0.05)",border:"#E63636",              features:["Everything in Free","Full paper archive","Citation alerts","Early access to AthenaX reports","Researcher leaderboard digest"] },
  { id:"proto", name:"PROTOCOL",    price:"$199/mo",  color:"#DBEAFE", border:"#1F2937",              features:["Everything in Researcher","Custom topic monitoring","Bounty match alerts","Sponsor digest","API access to digest data"] },
];

const ResearchDigestPage = ({ user, showToast }) => {
  const [email,    setEmail]    = useState(user?.email||"");
  const [tier,     setTier]     = useState("free");
  const [subbed,   setSubbed]   = useState(false);
  const [topics,   setTopics]   = useState(["ZK Proofs","DAO Governance"]);

  const subscribe = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { showToast("Valid email required.", "error"); return; }
    const subs = dbRead("ax_digest_subs", []);
    const exists = subs.find(s=>s.email===email);
    if (exists) { showToast("Already subscribed.", "info"); return; }
    dbWrite("ax_digest_subs", [...subs, { id:dbUid("sub"), email, tier, topics, createdAt:dbNow() }]);
    setSubbed(true);
    showToast("Subscribed to the Research Digest!", "success");
  };

  const toggleTopic = (t) => setTopics(prev => prev.includes(t) ? prev.filter(x=>x!==t) : [...prev,t]);

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:32 }}>
        <SectionLabel>WEEKLY INTELLIGENCE</SectionLabel>
        <h1 className="section-title">Research Digest</h1>
        <p className="section-subtitle">The definitive weekly briefing on Web3 academic research — curated, cited, and delivered.</p>
      </div>

      {/* Hero subscribe box */}
      {!subbed ? (
        <div style={{ background:"#1F2937", color:"#FDFBF7", border:"3px solid #1F2937", boxShadow:"6px 6px 0 #E63636", padding:"32px 36px", marginBottom:36 }}>
          <div className="vt" style={{ fontSize:13, color:"#E63636", marginBottom:8, letterSpacing:"0.08em" }}>▤ WEEKLY · EVERY MONDAY 07:00 UTC</div>
          <h2 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:"clamp(24px,4vw,40px)", marginBottom:8, lineHeight:1.1 }}>Never Miss Important Web3 Research</h2>
          <p style={{ fontSize:14, opacity:0.6, marginBottom:24, maxWidth:560 }}>Each week: the 5 most important papers, rising researchers to watch, trending topics, and open bounties.</p>

          {/* Tier selector */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
            {TIERS.map(t=>(
              <div key={t.id} onClick={()=>setTier(t.id)}
                style={{ cursor:"pointer", border:`2px solid ${tier===t.id?"#E63636":"rgba(255,255,255,0.15)"}`, padding:"12px 14px", background:tier===t.id?"rgba(230,54,54,0.12)":"rgba(255,255,255,0.04)", transition:"all 0.1s" }}>
                <div className="vt" style={{ fontSize:13, color:tier===t.id?"#E63636":"rgba(255,255,255,0.5)", marginBottom:3 }}>{t.name}</div>
                <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, color:"#FDFBF7" }}>{t.price}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" onKeyDown={e=>e.key==="Enter"&&subscribe()}
              style={{ flex:1, minWidth:220, padding:"11px 14px", fontFamily:"var(--font-inter), sans-serif", background:"rgba(255,255,255,0.07)", border:"2px solid rgba(255,255,255,0.2)", outline:"none", fontSize:14, color:"#FDFBF7" }}/>
            <button className="btn btn-primary" style={{ fontSize:19, flexShrink:0, padding:"11px 28px" }} onClick={subscribe}>SUBSCRIBE →</button>
          </div>
        </div>
      ) : (
        <div style={{ background:"rgba(39,201,63,0.06)", border:"2px solid #22C55E", padding:"20px 28px", marginBottom:36, display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:40, color:"#22C55E" }}>◉</span>
          <div>
            <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:24, marginBottom:3 }}>Subscribed — first issue lands Monday</div>
            <div className="vt" style={{ fontSize:14, opacity:0.55 }}>TIER: {tier.toUpperCase()} · {email}</div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:24 }}>
        {/* Past issues */}
        <div>
          <div style={{ fontFamily:"var(--font-vt323), monospace", fontSize:14, letterSpacing:"0.08em", opacity:0.45, marginBottom:14 }}>RECENT ISSUES</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {DIGEST_ISSUES.map(d=>(
              <WindowCard key={d.id} title={`DIGEST_${d.issue} — ${d.date}`} staticHover>
                <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, alignItems:"center" }}>
                  <div>
                    <h3 style={{ fontFamily:"var(--font-londrina), cursive", fontSize:20, lineHeight:1.2, marginBottom:5 }}>{d.title}</h3>
                    <div className="vt" style={{ fontSize:13, opacity:0.45 }}>FEATURED: {d.featured.slice(0,50)}…</div>
                    <div className="vt" style={{ fontSize:13, opacity:0.35, marginTop:3 }}>{d.papers} PAPERS · {d.downloads.toLocaleString()} READERS</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ fontSize:14, flexShrink:0 }}>READ →</button>
                </div>
              </WindowCard>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Topic selector */}
          <WindowCard title="TOPIC_PREFERENCES.sys">
            <div className="vt" style={{ fontSize:13, opacity:0.5, marginBottom:10 }}>SELECT YOUR RESEARCH INTERESTS:</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {TOPICS.filter(t=>t!=="Other").map(t=>(
                <div key={t} onClick={()=>toggleTopic(t)}
                  style={{ cursor:"pointer", border:topics.includes(t)?"2px solid #E63636":"1.5px solid rgba(31,41,55,0.2)", padding:"7px 12px", background:topics.includes(t)?"rgba(230,54,54,0.06)":"transparent", borderRadius:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:13 }}>{t}</span>
                  {topics.includes(t) && <span className="vt" style={{ fontSize:14, color:"#E63636" }}>✓</span>}
                </div>
              ))}
            </div>
          </WindowCard>

          {/* Tier comparison */}
          <WindowCard title="TIER_COMPARISON.sys" staticHover>
            {TIERS.map(t=>(
              <div key={t.id} style={{ marginBottom:14, paddingBottom:14, borderBottom:"1px solid rgba(31,41,55,0.08)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span className="vt" style={{ fontSize:16 }}>{t.name}</span>
                  <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:18, color:"#E63636" }}>{t.price}</span>
                </div>
                {t.features.map(f=><div key={f} style={{ fontSize:12, opacity:0.6, marginBottom:2 }}>▸ {f}</div>)}
              </div>
            ))}
          </WindowCard>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════
// RESEARCH GRAPH PAGE — force-directed canvas graph
// ═══════════════════════════════════════════════════════════

// ── Build graph data from seed ───────────────────────────────
const buildGraphData = () => {
  const nodes = [];
  const edges = [];
  const push = (n) => { if (!nodes.find(x => x.id === n.id)) nodes.push(n); };

  // Unique topics
  const topics = [...new Set(SEED_PAPERS.map(p => p.topic))];
  topics.forEach(t => push({ id:`topic_${t}`, type:"topic", label:t, meta:{} }));

  // Universities
  const unis = [...new Set([...SEED_PAPERS.map(p => p.university), ...SEED_RESEARCHERS.map(r => r.university)])];
  unis.forEach(u => push({ id:`uni_${u}`, type:"university", label:u, meta:{} }));

  // Labs
  SEED_LABS.forEach(l => {
    push({ id:l.id, type:"lab", label:l.name, meta:l });
    // lab → university
    l.partners.forEach(u => edges.push({ source:l.id, target:`uni_${u}`, rel:"affiliated" }));
    // lab → topic
    l.tags.forEach(t => { if (topics.includes(t)) edges.push({ source:l.id, target:`topic_${t}`, rel:"researches" }); });
  });

  // Sponsors / protocols
  SEED_SPONSORS.forEach(s => {
    const id = `sponsor_${s.name}`;
    push({ id, type:"protocol", label:s.ticker||s.name, meta:s });
  });

  // Researchers
  SEED_RESEARCHERS.forEach(r => {
    push({ id:r.id, type:"researcher", label:r.name.split(" ").pop(), meta:r });
    // researcher → lab
    const lab = SEED_LABS.find(l => l.name === r.lab || l.name.includes(r.lab) || r.lab.includes(l.name));
    if (lab) edges.push({ source:r.id, target:lab.id, rel:"works_at" });
    // researcher → university
    edges.push({ source:r.id, target:`uni_${r.university}`, rel:"affiliated" });
  });

  // Papers
  SEED_PAPERS.forEach(p => {
    const pid = `paper_${p.id}`;
    push({ id:pid, type:"paper", label:p.title.split(":")[0].slice(0,22), meta:p });
    // paper → topic
    edges.push({ source:pid, target:`topic_${p.topic}`, rel:"topic" });
    // paper → lab
    const lab = SEED_LABS.find(l => l.name === p.lab);
    if (lab) edges.push({ source:pid, target:lab.id, rel:"published_by" });
    // paper → researcher (author)
    p.authorIds?.forEach(uid => {
      const r = SEED_RESEARCHERS.find(x => x.userId === uid);
      if (r) edges.push({ source:r.id, target:pid, rel:"authored" });
    });
    // paper → sponsor (match by topic)
    const bounty = SEED_BOUNTIES.find(b => b.topic === p.topic);
    if (bounty) {
      const sid = `sponsor_${bounty.sponsor}`;
      if (nodes.find(n => n.id === sid)) edges.push({ source:pid, target:sid, rel:"funded_by" });
    }
  });

  return { nodes, edges };
};

// Node visual config
const NODE_CONFIG = {
  researcher: { color:"#E63636", radius:14, stroke:"#1F2937" },
  paper:      { color:"#1F2937", radius:11, stroke:"#E63636" },
  lab:        { color:"#F5A623", radius:16, stroke:"#1F2937" },
  protocol:   { color:"#22C55E", radius:13, stroke:"#1F2937" },
  topic:      { color:"rgba(31,41,55,0.18)", radius:18, stroke:"rgba(31,41,55,0.35)" },
  university: { color:"#FDFBF7",  radius:15, stroke:"#1F2937" },
};
const EDGE_CONFIG = {
  authored:    { color:"rgba(230,54,54,0.5)",   dash:false },
  published_by:{ color:"rgba(245,166,35,0.5)",  dash:false },
  topic:       { color:"rgba(31,41,55,0.2)",    dash:true  },
  affiliated:  { color:"rgba(31,41,55,0.15)",   dash:true  },
  researches:  { color:"rgba(245,166,35,0.25)", dash:true  },
  funded_by:   { color:"rgba(39,201,63,0.45)",  dash:false },
  works_at:    { color:"rgba(230,54,54,0.3)",   dash:false },
};

// ── Force simulation (vanilla JS, no d3) ────────────────────
const runForce = (nodes, edges, W, H, iterations=280) => {
  // Assign initial positions in a circle
  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    const r = Math.min(W, H) * 0.32;
    n.x = W/2 + r * Math.cos(angle) + (Math.random()-0.5)*40;
    n.y = H/2 + r * Math.sin(angle) + (Math.random()-0.5)*40;
    n.vx = 0; n.vy = 0;
  });

  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  for (let iter = 0; iter < iterations; iter++) {
    const cool = 1 - iter/iterations;

    // Repulsion between all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i+1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const force = 3200 / (dist*dist);
        const fx = (dx/dist)*force, fy = (dy/dist)*force;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      }
    }

    // Attraction along edges
    edges.forEach(e => {
      const a = nodeMap[e.source], b = nodeMap[e.target];
      if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const ideal = 110;
      const force = (dist - ideal) * 0.03;
      const fx = (dx/dist)*force, fy = (dy/dist)*force;
      a.vx += fx; a.vy += fy;
      b.vx -= fx; b.vy -= fy;
    });

    // Center gravity
    nodes.forEach(n => {
      n.vx += (W/2 - n.x) * 0.004;
      n.vy += (H/2 - n.y) * 0.004;
    });

    // Apply velocity + dampen + clamp to canvas
    nodes.forEach(n => {
      const speed = cool * 0.85;
      n.x += n.vx * speed;
      n.y += n.vy * speed;
      n.vx *= 0.7; n.vy *= 0.7;
      const pad = 30;
      n.x = Math.max(pad, Math.min(W-pad, n.x));
      n.y = Math.max(pad, Math.min(H-pad, n.y));
    });
  }
  return nodes;
};

const ResearchGraphPage = ({ setPage }) => {
  const canvasRef  = useRef(null);
  const stateRef   = useRef({ nodes:[], edges:[], scale:1, ox:0, oy:0, drag:null, pan:null });
  const [selected, setSelected]   = useState(null);
  const [highlight,setHighlight]  = useState(null); // set of node ids
  const [cmd,      setCmd]        = useState("");
  const [cmdLog,   setCmdLog]     = useState([
    "RESEARCH_GRAPH v5.0 — READY",
    "Commands: /top /trending /topic [name] /researcher [name] /reset",
  ]);
  const [graphReady, setGraphReady] = useState(false);

  // Build once
  useEffect(() => {
    const { nodes, edges } = buildGraphData();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth || 740, H = canvas.offsetHeight || 520;
    canvas.width  = W;
    canvas.height = H;
    const positioned = runForce([...nodes.map(n=>({...n}))], edges, W, H);
    stateRef.current = { nodes:positioned, edges, scale:1, ox:0, oy:0, drag:null, pan:null };
    setGraphReady(true);
    draw();
  }, []);

  // ── Draw ─────────────────────────────────────────────────
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { nodes, edges, scale, ox, oy } = stateRef.current;
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0,0,W,H);
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);

    // BG grid
    ctx.strokeStyle = "rgba(31,41,55,0.04)";
    ctx.lineWidth = 1;
    for (let x=0; x<W/scale+Math.abs(ox/scale); x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H/scale+Math.abs(oy/scale)); ctx.stroke(); }
    for (let y=0; y<H/scale+Math.abs(oy/scale); y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W/scale+Math.abs(ox/scale),y); ctx.stroke(); }

    // Edges
    const nodeMap = {};
    nodes.forEach(n => nodeMap[n.id] = n);

    edges.forEach(e => {
      const a = nodeMap[e.source], b = nodeMap[e.target];
      if (!a || !b) return;
      const isHit = highlight && (highlight.has(a.id) && highlight.has(b.id));
      const cfg = EDGE_CONFIG[e.rel] || EDGE_CONFIG.topic;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = isHit ? "rgba(230,54,54,0.7)" : (highlight ? "rgba(31,41,55,0.05)" : cfg.color);
      ctx.lineWidth   = isHit ? 2 : 1;
      if (cfg.dash) ctx.setLineDash([3,5]); else ctx.setLineDash([]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Nodes
    nodes.forEach(n => {
      const cfg  = NODE_CONFIG[n.type] || NODE_CONFIG.topic;
      const isHL = highlight ? highlight.has(n.id) : false;
      const isSel= selected?.id === n.id;
      const dim  = highlight && !isHL;

      // Halo for selected/highlighted
      if (isSel || isHL) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, cfg.radius + 7, 0, Math.PI*2);
        ctx.fillStyle = isSel ? "rgba(230,54,54,0.2)" : "rgba(230,54,54,0.1)";
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, cfg.radius, 0, Math.PI*2);
      ctx.fillStyle   = dim ? "rgba(200,200,200,0.25)" : cfg.color;
      ctx.fill();
      ctx.strokeStyle = dim ? "rgba(31,41,55,0.1)" : cfg.stroke;
      ctx.lineWidth   = isSel ? 3 : 1.5;
      ctx.stroke();

      // Label
      ctx.font = `${isSel||isHL ? "bold " : ""}10px var(--font-inter), sans-serif`;
      ctx.fillStyle = dim ? "rgba(31,41,55,0.2)" : (n.type==="paper"||n.type==="topic" ? "#1F2937" : "#1F2937");
      ctx.textAlign = "center";
      ctx.fillText(n.label.slice(0,16), n.x, n.y + cfg.radius + 12);
    });

    ctx.restore();
  };

  useEffect(() => { draw(); }, [selected, highlight, graphReady]);

  // ── Hit test ─────────────────────────────────────────────
  const hitNode = (cx, cy) => {
    const { nodes, scale, ox, oy } = stateRef.current;
    const wx = (cx - ox) / scale, wy = (cy - oy) / scale;
    for (let i = nodes.length-1; i >= 0; i--) {
      const n = nodes[i];
      const cfg = NODE_CONFIG[n.type] || NODE_CONFIG.topic;
      const dx = wx - n.x, dy = wy - n.y;
      if (dx*dx + dy*dy <= (cfg.radius+4)*(cfg.radius+4)) return n;
    }
    return null;
  };

  // Connected node ids for a given node
  const getConnected = (nodeId) => {
    const { edges } = stateRef.current;
    const ids = new Set([nodeId]);
    edges.forEach(e => {
      if (e.source === nodeId) ids.add(e.target);
      if (e.target === nodeId) ids.add(e.source);
    });
    return ids;
  };

  // ── Mouse events ─────────────────────────────────────────
  const onMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const hit = hitNode(cx, cy);
    if (hit) {
      stateRef.current.drag = { node:hit, startX:cx, startY:cy };
    } else {
      stateRef.current.pan = { startX:cx, startY:cy, ox0:stateRef.current.ox, oy0:stateRef.current.oy };
    }
  };
  const onMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const s = stateRef.current;
    if (s.drag) {
      s.drag.node.x += (cx - s.drag.startX) / s.scale;
      s.drag.node.y += (cy - s.drag.startY) / s.scale;
      s.drag.startX = cx; s.drag.startY = cy;
      draw(); return;
    }
    if (s.pan) {
      s.ox = s.pan.ox0 + (cx - s.pan.startX);
      s.oy = s.pan.oy0 + (cy - s.pan.startY);
      draw(); return;
    }
    // Cursor
    const hit = hitNode(cx, cy);
    canvasRef.current.style.cursor = hit ? "pointer" : "grab";
  };
  const onMouseUp = (e) => {
    const s = stateRef.current;
    if (s.drag) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      // If barely moved → click
      if (Math.abs(cx - s.drag.startX) < 3 && Math.abs(cy - s.drag.startY) < 3) {
        const hit = s.drag.node;
        setSelected(hit);
        setHighlight(getConnected(hit.id));
      }
    } else if (s.pan) {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
      if (Math.abs(cx - s.pan.startX) < 3 && Math.abs(cy - s.pan.startY) < 3) {
        setSelected(null); setHighlight(null);
      }
    }
    s.drag = null; s.pan = null;
  };
  const onWheel = (e) => {
    e.preventDefault();
    const s = stateRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left, cy = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.35, Math.min(3, s.scale * delta));
    s.ox = cx - (cx - s.ox) * (newScale / s.scale);
    s.oy = cy - (cy - s.oy) * (newScale / s.scale);
    s.scale = newScale;
    draw();
  };

  // ── Navigate on double click ─────────────────────────────
  const onDblClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const hit  = hitNode(e.clientX - rect.left, e.clientY - rect.top);
    if (!hit) return;
    if (hit.type === "paper") setPage(`paper_${hit.meta.id}`);
    if (hit.type === "lab")   { /* setSelectedLab handled in App — open labs page */ setPage("labs"); }
    if (hit.type === "researcher") setPage("profile");
  };

  // ── Terminal commands ────────────────────────────────────
  const runCmd = (raw) => {
    const c = raw.trim(); if (!c) return;
    setCmd("");
    const log = (lines) => setCmdLog(prev => [...prev.slice(-30), ...lines]);
    const { nodes } = stateRef.current;

    if (c === "/reset") {
      setHighlight(null); setSelected(null);
      log(["$ /reset", "→ All highlights cleared."]);
      return;
    }
    if (c === "/top") {
      const top = [...SEED_PAPERS].sort((a,b)=>(b.citations||0)-(a.citations||0)).slice(0,3);
      const ids = new Set(top.map(p=>`paper_${p.id}`));
      setHighlight(ids); setSelected(null);
      log(["$ /top", ...top.map((p,i)=>`  #${i+1} ${p.title.slice(0,50)} (${p.citations} cite)`)]);
      return;
    }
    if (c === "/trending") {
      const tmap = {};
      SEED_PAPERS.forEach(p => tmap[p.topic] = (tmap[p.topic]||0)+1);
      const top = Object.entries(tmap).sort((a,b)=>b[1]-a[1]);
      const ids = new Set(top.slice(0,3).map(([t])=>`topic_${t}`));
      setHighlight(ids); setSelected(null);
      log(["$ /trending", ...top.map(([t,n])=>`  ${t}: ${n} papers`)]);
      return;
    }
    if (c.startsWith("/topic ")) {
      const q = c.slice(7).trim().toLowerCase();
      const matches = nodes.filter(n => n.type==="topic" && n.label.toLowerCase().includes(q));
      if (!matches.length) { log([`$ ${c}`, "  → No matching topic."]); return; }
      const ids = new Set();
      matches.forEach(m => { ids.add(m.id); getConnected(m.id).forEach(x => ids.add(x)); });
      setHighlight(ids); setSelected(matches[0]);
      log([`$ ${c}`, `  → Highlighting ${ids.size} connected nodes`]);
      return;
    }
    if (c.startsWith("/researcher ")) {
      const q = c.slice(12).trim().toLowerCase();
      const matches = nodes.filter(n => n.type==="researcher" && n.meta?.name?.toLowerCase().includes(q));
      if (!matches.length) { log([`$ ${c}`, "  → No matching researcher."]); return; }
      const ids = new Set();
      matches.forEach(m => { ids.add(m.id); getConnected(m.id).forEach(x => ids.add(x)); });
      setHighlight(ids); setSelected(matches[0]);
      log([`$ ${c}`, `  → ${matches[0].meta.name}: ${ids.size} connected nodes`]);
      return;
    }
    log([`$ ${c}`, "  → Unknown command. Try /top /trending /topic [t] /researcher [r] /reset"]);
  };

  // Selected node detail
  const renderDetail = () => {
    if (!selected) return (
      <div className="vt" style={{ fontSize:15, opacity:0.35, textAlign:"center", padding:"16px 0" }}>
        CLICK ANY NODE TO INSPECT
      </div>
    );
    const m = selected.meta || {};
    const cfg = NODE_CONFIG[selected.type] || NODE_CONFIG.topic;
    const connCount = highlight ? highlight.size - 1 : 0;
    const typeLabel = selected.type.toUpperCase();
    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:cfg.color, border:`2px solid ${cfg.stroke}`, flexShrink:0 }}/>
          <span className="vt" style={{ fontSize:14, color:"#E63636" }}>{typeLabel}</span>
          <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:22, lineHeight:1 }}>{selected.label}</span>
        </div>
        {selected.type==="paper" && <>
          <div style={{ fontSize:12, fontWeight:600, marginBottom:4, lineHeight:1.4 }}>{m.title}</div>
          <div className="vt" style={{ fontSize:13, opacity:0.5, marginBottom:6 }}>BY: {(m.authors||[]).join(", ")} · {m.year}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
            <span className="tag-accent" style={{ fontSize:11 }}>{m.topic}</span>
            <span className="tag" style={{ fontSize:11 }}>{m.citations} CITE</span>
          </div>
          <button className="btn btn-primary btn-sm" style={{ fontSize:14 }} onClick={() => setPage(`paper_${m.id}`)}>OPEN PAPER →</button>
        </>}
        {selected.type==="researcher" && <>
          <div className="vt" style={{ fontSize:13, opacity:0.5, marginBottom:6 }}>{m.university} · {m.lab}</div>
          <div style={{ display:"flex", gap:6, marginBottom:8 }}>
            <span className="tag" style={{ fontSize:11 }}>{m.citations} CITE</span>
            <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:16, color:"#E63636" }}>ARS {calcARS(m)}</span>
          </div>
        </>}
        {selected.type==="lab" && <>
          <div style={{ fontSize:12, opacity:0.65, marginBottom:6 }}>{m.focus}</div>
          <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{(m.tags||[]).map(t=><span key={t} className="tag" style={{ fontSize:11 }}>{t}</span>)}</div>
        </>}
        {selected.type==="topic" && <div style={{ fontSize:12, opacity:0.55 }}>Research topic cluster</div>}
        {selected.type==="protocol" && <>
          <div className="vt" style={{ fontSize:13, opacity:0.5, marginBottom:4 }}>{m.category}</div>
          <div style={{ fontFamily:"var(--font-londrina), cursive", fontSize:20, color:"#22C55E" }}>{m.amount}</div>
        </>}
        {selected.type==="university" && <div style={{ fontSize:12, opacity:0.55 }}>Academic institution</div>}
        {connCount > 0 && <div className="vt" style={{ fontSize:13, opacity:0.45, marginTop:8 }}>◈ {connCount} connected nodes</div>}
        <div className="vt" style={{ fontSize:12, opacity:0.3, marginTop:6 }}>DBL-CLICK TO NAVIGATE</div>
      </div>
    );
  };

  return (
    <div className="page-enter page-container">
      <div style={{ marginBottom:24 }}>
        <SectionLabel>KNOWLEDGE INFRASTRUCTURE</SectionLabel>
        <h1 className="section-title">Research Graph</h1>
        <p className="section-subtitle">Force-directed map of researchers, papers, labs, protocols, and topics across the AthenaX network.</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 256px", gap:20, alignItems:"start" }}>
        {/* Main graph panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <TerminalPanel title="RESEARCH_GRAPH.sys" headerRight={`${stateRef.current.nodes?.length||0} NODES · ${stateRef.current.edges?.length||0} EDGES`}>
            {/* Graph canvas */}
            <div style={{ position:"relative", width:"100%", height:520, background:"#0d1117", border:"1px solid rgba(255,255,255,0.08)", marginBottom:12 }}>
              <canvas
                ref={canvasRef}
                style={{ width:"100%", height:"100%", display:"block", cursor:"grab" }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onWheel={onWheel}
                onDoubleClick={onDblClick}
              />
              {/* Zoom hint */}
              <div style={{ position:"absolute", bottom:8, right:10, fontFamily:"var(--font-vt323), monospace", fontSize:12, color:"rgba(255,255,255,0.2)" }}>
                SCROLL TO ZOOM · DRAG TO PAN · DBL-CLICK TO NAVIGATE
              </div>
              {!graphReady && (
                <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span className="vt" style={{ fontSize:18, color:"rgba(230,54,54,0.6)" }}>◎ COMPUTING LAYOUT…</span>
                </div>
              )}
            </div>

            {/* Terminal command bar */}
            <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:8 }}>
              <span className="term-green" style={{ flexShrink:0, marginRight:8 }}>$</span>
              <input value={cmd} onChange={e=>setCmd(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&runCmd(cmd)}
                placeholder="/top   /trending   /topic ZK Proofs   /researcher Tanaka   /reset"
                style={{ flex:1, background:"transparent", border:"none", outline:"none", fontFamily:"var(--font-vt323), monospace", fontSize:16, color:"#FDFBF7", caretColor:"#22C55E" }}/>
              <button onClick={()=>runCmd(cmd)} style={{ background:"#E63636", border:"none", color:"#FDFBF7", fontFamily:"var(--font-vt323), monospace", fontSize:15, padding:"3px 12px", cursor:"pointer", flexShrink:0 }}>RUN</button>
            </div>
            {/* Command log */}
            <div style={{ marginTop:8, maxHeight:72, overflowY:"auto", fontSize:12 }}>
              {cmdLog.slice(-6).map((l,i) => (
                <div key={i} style={{ color: l.startsWith("$") ? "#22C55E" : l.startsWith("  →") ? "#F5A623" : "rgba(255,255,255,0.35)", marginBottom:1 }}>{l}</div>
              ))}
            </div>
          </TerminalPanel>

          {/* Quick command pills */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[["/top","Top Papers"],["/trending","Trending Topics"],["/topic ZK Proofs","ZK Cluster"],["/topic DAO Governance","DAO Cluster"],["/researcher Feist","Dankrad Feist"],["/reset","Reset"]].map(([c,lbl])=>(
              <button key={c} onClick={()=>runCmd(c)} className="btn btn-ghost btn-sm" style={{ fontSize:13 }}>{lbl}</button>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Legend */}
          <WindowCard title="GRAPH_LEGEND.md" staticHover>
            <div className="vt" style={{ fontSize:13, opacity:0.45, marginBottom:10 }}>NODE TYPES:</div>
            {Object.entries(NODE_CONFIG).map(([type, cfg]) => (
              <div key={type} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:14, height:14, borderRadius:"50%", background:cfg.color, border:`2px solid ${cfg.stroke}`, flexShrink:0 }}/>
                <span style={{ fontSize:12, textTransform:"capitalize" }}>{type}</span>
              </div>
            ))}
            <div style={{ borderTop:"1px solid rgba(31,41,55,0.1)", marginTop:12, paddingTop:10 }}>
              <div className="vt" style={{ fontSize:13, opacity:0.45, marginBottom:8 }}>EDGE TYPES:</div>
              {[["authored","Researcher → Paper"],["published_by","Paper → Lab"],["topic","Paper → Topic"],["funded_by","Paper → Protocol"],["works_at","Researcher → Lab"],["affiliated","Lab → University"]].map(([rel,desc])=>{
                const ec = EDGE_CONFIG[rel];
                return (
                  <div key={rel} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                    <div style={{ width:20, height:2, background:ec.color, flexShrink:0, borderTop:ec.dash?"1px dashed rgba(31,41,55,0.4)":"none" }}/>
                    <span style={{ fontSize:11, opacity:0.65 }}>{desc}</span>
                  </div>
                );
              })}
            </div>
          </WindowCard>

          {/* Node detail */}
          <WindowCard title="NODE_DETAILS.sys">
            {renderDetail()}
          </WindowCard>

          {/* Stats */}
          <WindowCard title="GRAPH_STATS.sys" staticHover>
            {[["Researchers",SEED_RESEARCHERS.length],["Papers",SEED_PAPERS.length],["Labs",SEED_LABS.length],["Topics",[...new Set(SEED_PAPERS.map(p=>p.topic))].length],["Protocols",SEED_SPONSORS.length]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(31,41,55,0.07)" }}>
                <span className="vt" style={{ fontSize:14, opacity:0.5 }}>{k}</span>
                <span style={{ fontFamily:"var(--font-londrina), cursive", fontSize:18, color:"#E63636" }}>{v}</span>
              </div>
            ))}
          </WindowCard>
        </div>
      </div>
    </div>
  );
};


// ── PLACEHOLDER (for pages added in later parts) ──────────────
const PlaceholderPage = ({ title, description, setPage }) => (
  <div className="page-enter page-container">
    <WindowCard title={`${title.toUpperCase().replace(/ /g, "_")}.sys`} staticHover>
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div className="vt" style={{ fontSize: 20, color: "#F5A623", marginBottom: 12 }}>◎ PENDING IMPLEMENTATION</div>
        <h2 style={{ fontFamily: "var(--font-londrina), cursive", fontSize: 32, marginBottom: 12 }}>{title}</h2>
        <p style={{ fontSize: 13, opacity: 0.65, marginBottom: 24 }}>{description}</p>
        <button className="btn btn-ghost" onClick={() => setPage("home")}>← BACK TO HOME</button>
      </div>
    </WindowCard>
  </div>
);


// ═══════════════════════════════════════════════════════════
// APP — PART 3: FULL AUTH WIRING
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage]               = useState("home");
  const [selectedLab, setSelectedLab] = useState(null);
  const [user, setUser]               = useState(null);
  const [toasts, setToasts]           = useState([]);
  const [showLogin,    setShowLogin]   = useState(false);
  const [showRegister, setShowRegister]= useState(false);

  // Init DB + restore session on mount
  useEffect(() => {
    initDB();
    const session = authSvc.getSession();
    if (session) setUser(session);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [page]);

  const showToast = (text, type = "info") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts(t => [...t, { id, text, type }]);
  };

  const handleLogout = () => {
    authSvc.logout();
    setUser(null);
    setPage("home");
    showToast("Signed out.", "info");
  };

  const navigate = (target) => {
    if (target === "login")    { setShowLogin(true);    return; }
    if (target === "register") { setShowRegister(true); return; }
    setPage(target);
  };

  const renderPage = () => {
    try {
      if (page.startsWith("paper_")) return <PaperPage paperId={page.slice(6)} setPage={navigate} />;
      switch (page) {
        case "home":           return <HomePage setPage={navigate} />;
        case "how-it-works":   return <HowItWorksPage setPage={navigate} />;
        case "funding":        return <FundingPage setPage={navigate} />;
        case "builders":       return <BuildersPage setPage={navigate} />;
        case "labs":           return <LabsPage setPage={navigate} setSelectedLab={setSelectedLab} />;
        case "archive":        return <ArchivePage setPage={navigate} />;
        case "dashboard":      return <DashboardPage setPage={navigate} />;
        case "lab-profile":    return <LabProfilePage lab={selectedLab} setPage={navigate} />;
        case "network":        return <NetworkPage setPage={navigate} />;
        case "universities":   return <UniversitiesPage setPage={navigate} />;
        case "cohorts":        return <CohortsPage setPage={navigate} />;
        case "leaderboard":    return <LeaderboardPage setPage={navigate} />;
        case "sponsors":       return <SponsorsPage setPage={navigate} />;
        case "business-model": return <BusinessModelPage setPage={navigate} />;
        case "profile":        return <ProfilePage user={user} setPage={navigate} showToast={showToast} onUserUpdate={setUser} />;
        case "talent":         return <TalentMarketplacePage user={user} setPage={navigate} showToast={showToast} />;
        case "reports":        return <ResearchReportsPage setPage={navigate} />;
        case "live":           return <AthenaXLivePage user={user} setPage={navigate} showToast={showToast} />;
        case "roundtables":    return <RoundtablesPage setPage={navigate} />;
        case "digest":         return <ResearchDigestPage user={user} showToast={showToast} />;
        case "submit-paper":   return <SubmitPaperPage user={user} setPage={navigate} showToast={showToast} />;
        case "bounties":       return <BountyMarketplacePage user={user} setPage={navigate} showToast={showToast} />;
        case "post-bounty":    return <PostBountyPage user={user} setPage={navigate} showToast={showToast} />;
        case "apply-cohort":   return <CohortApplicationPage user={user} setPage={navigate} showToast={showToast} />;
        case "admin":          return <AdminPanelPage user={user} setPage={navigate} showToast={showToast} />;
        case "terminal":       return <ResearchTerminalPage user={user} setPage={navigate} />;
        case "research-graph": return <ResearchGraphPage setPage={navigate} />;
        default:               return <HomePage setPage={navigate} />;
      }
    } catch (err) {
      console.error("AthenaX render error:", err);
      return <PageError message="Rendering error." onBack={() => setPage("home")} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <Navbar
          current={page}
          setPage={navigate}
          user={user}
          onAuthClick={(mode) => {
            if (mode === "logout")   { handleLogout(); return; }
            if (mode === "login")    { setShowLogin(true); return; }
            if (mode === "register") { setShowRegister(true); return; }
          }}
        />

        <main style={{ flex:1 }}>{renderPage()}</main>
        <Footer setPage={navigate} />
      </div>

      {/* Auth modals */}
      {showLogin    && <LoginModal    onClose={()=>setShowLogin(false)}    onSuccess={setUser} showToast={showToast} />}
      {showRegister && <RegisterModal onClose={()=>setShowRegister(false)} onSuccess={setUser} showToast={showToast} />}

      {/* Toast stack */}
      <div style={{ position:"fixed", bottom:24, right:24, display:"flex", flexDirection:"column", gap:10, zIndex:300 }}>
        {toasts.map(t => <Toast key={t.id} msg={t} onClose={()=>setToasts(ts=>ts.filter(x=>x.id!==t.id))} />)}
      </div>
    </>
  );
}
