"use client";

// ═══════════════════════════════════════════════════════════
// PAPER PAGE

import Link from "next/link";
import { useRouter } from "next/navigation";
import WindowCard from "@/components/ui/WindowCard";
import ArsBreakdown from "@/components/ui/ArsBreakdown";
import { MediaIcon } from "@/components/Icons";
import { useState } from "react";
import { useVotePaper, useUpdatePaperVerificationStatus } from "@/hooks/queries/usePaper";
import { PaperVerificationStatus } from "@/enums";
import type { PaperOut } from "@/types/paper";

// ── Mock data used when real data is unavailable ─────────────
const MOCK_PRODUCTS = [
  { id: 1, name: "NeuralDraft", initial: "N", sector: "AI Writing", stage: "Seed", funding: "$1.2M", votes: 214 },
  { id: 2, name: "ResearchOS", initial: "R", sector: "Productivity", stage: "Pre-Seed", funding: "$400K", votes: 98 },
  { id: 3, name: "VectorVault", initial: "V", sector: "Infrastructure", stage: "Series A", funding: "$4.5M", votes: 331 },
];

const MOCK_RELATED = [
  { id: 1, slug: "#", title: "Attention Is All You Need", year: 2017, topic: "Transformers", lab: "Google Brain", citations: 92400 },
  { id: 2, slug: "#", title: "BERT: Pre-training of Deep Bidirectional Transformers", year: 2018, topic: "NLP", lab: "Google AI", citations: 74100 },
  { id: 3, slug: "#", title: "Language Models are Few-Shot Learners", year: 2020, topic: "LLMs", lab: "OpenAI", citations: 41200 },
  { id: 4, slug: "#", title: "Scaling Laws for Neural Language Models", year: 2020, topic: "LLMs", lab: "OpenAI", citations: 8300 },
];
// ─────────────────────────────────────────────────────────────

const PaperPage = ({ paper, user, showToast }: { paper: PaperOut; user: any; showToast: Function }) => {
  const router = useRouter();
  const { mutate: vote, isPending: voting } = useVotePaper();
  const { mutate: updateVerification, isPending: verifying } = useUpdatePaperVerificationStatus();
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(paper.voteCount);

  const isPending = paper.verificationStatus === PaperVerificationStatus.PENDING;
  const isResearcher = (user?.role as string) === "researcher";
  const isAdmin = (user?.role as string) === "admin";

  const handleVerify = (status: PaperVerificationStatus) => {
    updateVerification(
      { id: paper.id, verificationStatus: status },
      {
        onSuccess: () => {
          showToast(
            status === PaperVerificationStatus.APPROVED ? "Paper approved." : "Paper rejected.",
            status === PaperVerificationStatus.APPROVED ? "success" : "info"
          );
          if (isAdmin) router.push("/admin?tab=papers");
        },
        onError: () => showToast("Action failed. Please try again.", "error"),
      }
    );
  };

  const publishedYear = paper.publishedAt ? new Date(paper.publishedAt).getFullYear() : null;

  // Mock metric values — replace with real fields when API provides them
  const citations = 0;
  const downloads = 0;
  const peerReviews = 0;
  const reviewScore = "—";

  const handleVote = () => {
    if (!user) { showToast("Sign in to vote.", "error"); return; }
    const next = !voted;
    setVoted(next);
    setVoteCount((v) => v + (next ? 1 : -1));
    vote(
      { id: paper.id, voted: next },
      {
        onError: () => {
          setVoted(!next);
          setVoteCount((v) => v + (next ? -1 : 1));
          showToast("Vote failed. Please try again.", "error");
        },
      }
    );
  };

  return (
    <div>
      {/* ── Researcher pending alert ─────────────────────────── */}
      {isPending && isResearcher && (
        <div className="flex items-center gap-3 border-b border-[#D4A017]/30 bg-[#FFFBEB] px-5 py-3">
          <span className="font-['Space_Mono',monospace] text-[10px] font-bold tracking-widest text-[#B45309]">PENDING_REVIEW.SYS</span>
          <span className="h-3 w-px bg-[#D4A017]/40" />
          <p className="flex-1 text-[13px] font-medium text-[#92400E]">
            This paper is awaiting editorial review. It will become publicly visible once approved.
          </p>
        </div>
      )}

      {/* ── Admin review action bar ───────────────────────────── */}
      {isPending && isAdmin && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] bg-paper px-5 py-3">
          <span className="font-['Space_Mono',monospace] text-[10px] font-bold tracking-widest text-[#E8323C]">PAPER_REVIEW_QUEUE.SYS</span>
          <span className="h-3 w-px bg-[#D8D4CC]" />
          <p className="flex-1 text-[13px] font-semibold text-ink">This paper is pending review — approve or reject below.</p>
          <div className="flex shrink-0 gap-2">
            <Link href="/admin?tab=papers" className="btn btn-ghost btn-sm">
              ← Queue
            </Link>
            <button className="btn btn-primary btn-sm" onClick={() => handleVerify(PaperVerificationStatus.APPROVED)} disabled={verifying}>
              {verifying ? <span className="spinner" /> : "✓ Approve"}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => handleVerify(PaperVerificationStatus.REJECTED)} disabled={verifying}>
              {verifying ? <span className="spinner" /> : "✗ Reject"}
            </button>
          </div>
        </div>
      )}

      <div className="page-wrap section">
        <Link href="/archive" className="link-arrow" style={{ marginBottom: 20 }}>
          ← Back to Archive
        </Link>
        <div className="path-badge">/root/paper/{paper.slug}</div>
        <h1 style={{ fontSize: 36, marginBottom: 16, letterSpacing: "-0.02em" }}>{paper.title}</h1>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {paper.categories.map((c) => (
            <span key={c.id} className="topic-pill">
              {c.name}
            </span>
          ))}
          <span className="ftag">{paper.sourceType === "link" ? "External" : "Hosted"}</span>
          {publishedYear && <span className="ftag">{publishedYear}</span>}
        </div>

        {/* Row 1: Abstract + Metrics + ARS */}
        <div className="grid-2" style={{ gap: 22 }}>
          <WindowCard label="ABSTRACT.TXT">
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#1C1C27" }}>{paper.abstract ?? "No abstract provided."}</p>
            {paper.sourceType === "link" && paper.externalUrl && (
              <>
                <hr className="divider-sm" />
                <a
                  href={paper.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ display: "inline-flex" }}
                >
                  Read Paper →
                </a>
              </>
            )}
            {paper.sourceType === "editor" && paper.content && (
              <>
                <hr className="divider-sm" />
                <div style={{ fontSize: 14, lineHeight: 1.8, color: "#1C1C27", whiteSpace: "pre-wrap" }}>{paper.content}</div>
              </>
            )}
            <hr className="divider-sm" />
            <button
              className={voted ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              onClick={handleVote}
              disabled={voting}
              style={voted ? { background: "#D4EDDA" } : {}}
            >
              {voted ? "✓ Voted" : "▲ Upvote"} &nbsp;·&nbsp; {voteCount.toLocaleString()}
            </button>
          </WindowCard>

          <div>
            <WindowCard label="METRICS.SYS" style={{ marginBottom: 20 }}>
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="stat-card">
                  <div className="stat-label">Citations</div>
                  <div className="stat-value">{citations || "—"}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Downloads</div>
                  <div className="stat-value">{downloads > 0 ? downloads.toLocaleString() : "—"}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Peer Reviews</div>
                  <div className="stat-value">{peerReviews || "—"}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Review Score</div>
                  <div className="stat-value" style={{ color: "#E8323C" }}>
                    {reviewScore}
                  </div>
                </div>
              </div>
            </WindowCard>

            <WindowCard label="ARS_SCORE.SYS" bodyClass="window-body window-body-yellow">
              <ArsBreakdown
                r={{
                  citations,
                  peerReviews,
                  downloads,
                  votes: voteCount,
                  sponsorEndorsements: 0,
                  bountyCompletions: 0,
                }}
              />
            </WindowCard>
          </div>
        </div>

        {/* Products built on this paper — mock until real data exists */}
        <div style={{ marginTop: 28 }}>
          <WindowCard label="PRODUCTS_BUILT_ON_THIS.SYS" bodyClass="window-body window-body-blue">
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
              {MOCK_PRODUCTS.length} PRODUCTS LAUNCHED FROM THIS RESEARCH &nbsp;·&nbsp; MOCK DATA
            </div>
            {MOCK_PRODUCTS.map((p) => (
              <div key={p.id} className="archive-row" style={{ cursor: "pointer" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: "1.5px solid #1C1C27",
                    background: "#F9F5DC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {p.initial}
                </div>
                <div style={{ flex: 1, marginLeft: 10 }}>
                  <div className="archive-title" style={{ fontSize: 14 }}>
                    {p.name}
                  </div>
                  <div className="archive-meta">
                    {p.sector} · {p.stage} · {p.funding} · ▲ {p.votes}
                  </div>
                </div>
                <span style={{ color: "#6B6B7A", fontSize: 14 }}>→</span>
              </div>
            ))}
          </WindowCard>
        </div>

        {/* Related research — mock until real data exists */}
        <div style={{ marginTop: 28 }}>
          <WindowCard label="RELATED_RESEARCH.SYS" bodyClass="window-body window-body-blue">
            <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 14 }}>
              PAPERS ON SAME TOPIC OR FROM SAME LAB &nbsp;·&nbsp; MOCK DATA
            </div>
            {MOCK_RELATED.map((r) => (
              <div key={r.id} className="archive-row">
                <MediaIcon type="Essay" />
                <div style={{ flex: 1 }}>
                  <Link href={`/paper/${r.slug}`} className="archive-title" style={{ textDecoration: "none" }}>
                    {r.title}
                  </Link>
                  <div className="archive-meta">
                    {r.year} // {r.topic} // {r.lab}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700, color: "#E8323C" }}>
                    {r.citations.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: "#6B6B7A" }}>cites</div>
                </div>
              </div>
            ))}
          </WindowCard>
        </div>
      </div>
    </div>
  );
};

export default PaperPage;
