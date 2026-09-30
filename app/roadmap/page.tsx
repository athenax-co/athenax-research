"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

type Phase = {
  num: string;
  code: string;
  status: string;
  dot: string;
  year: string;
  isLive?: boolean;
  essence: string;
  unlocks: readonly string[];
};

const PHASES: Phase[] = [
  {
    num: "00", code: "Genesis", status: "OPERATIONAL", dot: "#4CAF50", year: "2027", isLive: true,
    essence: "Research-backed products become visible. Founders submit. Builders connect.",
    unlocks: ["Launch feed", "Research archive", "Founder submission", "Community signal"],
  },
  {
    num: "01", code: "Network", status: "EMERGING", dot: "#E0A030", year: "Q2 2027",
    essence: "Researchers become first-class. Products carry the credentials of those behind them.",
    unlocks: ["Researcher identity", "Founder graph", "Personalised feeds", "Curation depth"],
  },
  {
    num: "02", code: "Terminal", status: "DEPLOYING", dot: "#E0A030", year: "Q3 2027",
    essence: "The ecosystem anticipates itself. Reputation and movement across labs become observable.",
    unlocks: ["Research Terminal", "Reputation system", "Founder radar", "Institutional graph"],
  },
  {
    num: "03", code: "Economy", status: "SEQUENCED", dot: "#B5B0A6", year: "Q4 2027",
    essence: "Capital follows the work shaping the future. Research becomes fundable, researchers become founders.",
    unlocks: ["Bounty marketplace", "Builder cohorts", "Placement layer", "Sponsored programs"],
  },
  {
    num: "04", code: "Autonomy", status: "HORIZON", dot: "#B5B0A6", year: "2028+",
    essence: "AI-native research summarisation, autonomous agents, and on-chain governance compose a self-organising economy.",
    unlocks: ["AI research layer", "DAO governance", "Autonomous agents", "Open infrastructure"],
  },
];

export default function RoadmapPage() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= PHASES.length || idx === active) return;
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(active + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const phase = PHASES[active];
  const progress = ((active + 1) / PHASES.length) * 100;

  return (
    <div>
      <div className="page-wrap pt-18 pb-20">

        <div className="path-badge">/root/roadmap</div>
        <h1 className="text-5xl mb-2">The Roadmap</h1>
        <p className="text-[17px] text-muted mb-0">Five phases from launch to autonomy.</p>
        <hr className="divider" />

        {/* ── Main phase display ── */}
        <div className="ax-phase-grid mb-16">

          {/* Giant numeral */}
          <div className="text-left overflow-hidden relative">
            <div
              key={`num-${active}`}
              className={`ax-numeral ${phase.isLive ? "live" : ""} ${direction >= 0 ? "ax-anim-fwd" : "ax-anim-bwd"}`}
            >
              {phase.num}
            </div>
          </div>

          {/* Right-hand content */}
          <div key={`txt-${active}`} className="ax-anim-text">
            <div className="ax-phase-pill">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: phase.dot,
                  boxShadow: phase.isLive ? "0 0 0 0 rgba(76,175,80,0.6)" : "none",
                  animation: phase.isLive ? "ax-dot-pulse 2.4s ease-in-out infinite" : "none",
                }}
              />
              <span className="font-bold">{phase.status}</span>
              <span className="opacity-[0.55]">·</span>
              <span className="opacity-[0.7]">{phase.year}</span>
            </div>

            <div className="text-[clamp(38px,4.6vw,60px)] leading-none font-semibold tracking-[-0.025em] mb-4.5">
              {phase.code}<span className="text-danger">.</span>
            </div>

            <p className="text-base leading-[1.55] text-ink max-w-107.5 mb-6 opacity-[0.82]">
              {phase.essence}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {phase.unlocks.map((u) => (
                <span key={u} className="ftag">
                  {u}
                </span>
              ))}
            </div>

            {phase.isLive && (
              <Link href="/launch" className={buttonVariants({ variant: "outline", size: "sm" })}>
                See it live →
              </Link>
            )}
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="mb-24">
          <div className="ax-rail mb-7">
            <div className="ax-rail-fill" style={{ width: `${progress}%` }} />
          </div>

          <div
            className="grid gap-4 items-start"
            style={{ gridTemplateColumns: `repeat(${PHASES.length}, 1fr)` }}
          >
            {PHASES.map((p, i) => (
              <button
                key={p.num}
                onClick={() => goTo(i)}
                className={`ax-step-row ${i === active ? "active" : ""}`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className={`ax-step-dot ${i === active ? "active" : ""} ${i === active && p.isLive ? "live" : ""}`} />
                  <span
                    className="mono text-[11px] font-bold tracking-[-0.01em] transition-colors duration-400"
                    style={{ color: i === active ? (p.isLive ? "var(--color-danger)" : "var(--color-ink)") : "var(--color-muted)" }}
                  >
                    {p.num}
                  </span>
                </div>
                <div
                  className="text-[13px] font-medium tracking-[-0.005em]"
                  style={{ color: i === active ? "var(--color-ink)" : "var(--color-muted)" }}
                >
                  {p.code}
                </div>
                <div className="mono text-[9px] text-muted tracking-widest uppercase mt-0.75">
                  {p.year}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center mt-8 gap-4.5">
            <button className="ax-nav-btn" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous phase">
              ←
            </button>
            <button className="ax-nav-btn" onClick={() => goTo(active + 1)} disabled={active === PHASES.length - 1} aria-label="Next phase">
              →
            </button>
          </div>
        </div>

        {/* ── Bottom CTA ── */}
        <hr className="divider mt-0 mb-12" />

        <div className="max-w-155">
          <div className="mono text-[11px] text-ink tracking-[0.18em] uppercase mb-4.5 inline-flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-[#4CAF50]"
              style={{ animation: "ax-dot-pulse 2.4s ease-in-out infinite" }}
            />
            <span className="font-bold">Phase 00 is live</span>
          </div>

          <h2 className="text-[clamp(32px,4.4vw,52px)] leading-[1.05] mb-4.5 tracking-[-0.025em] font-semibold">
            Where new products <span className="text-danger">begin.</span>
          </h2>

          <p className="text-[17px] leading-[1.6] text-muted max-w-140 mb-7">
            Genesis is operational. Explore the first wave of research-backed
            frontier tech — or submit your own.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link href="/launch" className={buttonVariants()}>
              Enter the launch feed →
            </Link>
            <Link href="/archive" className={buttonVariants({ variant: "outline" })}>
              Browse the archive
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
