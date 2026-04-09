"use client";

// ═══════════════════════════════════════════════════════════
// PAPER PAGE

import Link from "next/link";
import { useRouter } from "next/navigation";
import WindowCard from "@/components/ui/WindowCard";
import ArsBreakdown from "@/components/ui/ArsBreakdown";
import { MediaIcon } from "@/components/Icons";
import { useState } from "react";
import { useVotePaper, useUpdatePaperVerificationStatus, useRelatedPapers } from "@/hooks/queries/usePaper";
import { PaperVerificationStatus } from "@/enums";
import type { PaperOut } from "@/types/paper";

// ── Mock data used when real data is unavailable ─────────────
const MOCK_PRODUCTS = [
  { id: 1, name: "NeuralDraft", initial: "N", sector: "AI Writing", stage: "Seed", funding: "$1.2M", votes: 214 },
  { id: 2, name: "ResearchOS", initial: "R", sector: "Productivity", stage: "Pre-Seed", funding: "$400K", votes: 98 },
  { id: 3, name: "VectorVault", initial: "V", sector: "Infrastructure", stage: "Series A", funding: "$4.5M", votes: 331 },
];

// ─────────────────────────────────────────────────────────────

const PaperPage = ({ paper, user, showToast }: { paper: PaperOut; user: any; showToast: Function }) => {
  const router = useRouter();
  const { mutate: vote, isPending: voting } = useVotePaper();
  const { mutate: updateVerification, isPending: verifying } = useUpdatePaperVerificationStatus();
  const { data: relatedPapers = [] } = useRelatedPapers(paper.id);
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
    if (!user) {
      showToast("Sign in to vote.", "error");
      return;
    }
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
        <div className="sticky top-17 z-40 flex items-center gap-3 border-b border-[#D4A017]/30 bg-[#FFFBEB] px-5 py-3">
          <span className="font-['Space_Mono',monospace] text-[10px] font-bold tracking-widest text-[#B45309]">PENDING_REVIEW.SYS</span>
          <span className="h-3 w-px bg-[#D4A017]/40" />
          <p className="flex-1 text-[13px] font-medium text-[#92400E]">
            This paper is awaiting editorial review. It will become publicly visible once approved.
          </p>
        </div>
      )}

      {/* ── Admin review action bar ───────────────────────────── */}
      {isPending && isAdmin && (
        <div className="sticky top-17 z-40 flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] bg-paper px-5 py-3">
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
        <div className="flex items-center gap-3 text-sm">
          <Link href="/archive" className="link-arrow">
            ← Back to Archive
          </Link>
          <div className="path-badge">/root/paper/{paper.slug}</div>
        </div>
        <h1 className="text-[36px] mb-4 tracking-[-0.02em]">{paper.title}</h1>

        <div className="mb-7 flex flex-wrap gap-2.5">
          {paper.categories.map((c) => (
            <span key={c.id} className="topic-pill">
              {c.name}
            </span>
          ))}
          <span className="ftag">{paper.sourceType === "link" ? "External" : "Hosted"}</span>
          {publishedYear && <span className="ftag">{publishedYear}</span>}
        </div>

        {/* Row 1: Abstract + Metrics + ARS */}
        <div className="grid-2 gap-5.5">
          <WindowCard label="ABSTRACT.TXT">
            <p className="text-[15px] leading-[1.7] text-[#1C1C27]">{paper.abstract ?? "No abstract provided."}</p>
            {paper.sourceType === "link" && paper.externalUrl && (
              <>
                <hr className="divider-sm" />
                <a href={paper.externalUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm inline-flex">
                  Read Paper →
                </a>
              </>
            )}
            {paper.sourceType === "editor" && paper.content && (
              <>
                <hr className="divider-sm" />
                <div className="whitespace-pre-wrap text-[14px] leading-[1.8] text-[#1C1C27]">{paper.content}</div>
              </>
            )}
            <hr className="divider-sm" />
            <button className={voted ? "btn btn-ghost btn-sm bg-success" : "btn btn-outline btn-sm"} onClick={handleVote} disabled={voting}>
              {voted ? "▼ Unvote" : "▲ Upvote"} &nbsp;·&nbsp; {voteCount.toLocaleString()}
            </button>
          </WindowCard>

          <div>
            <WindowCard label="METRICS.SYS" className="mb-5">
              <div className="grid-2 gap-3">
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
                  <div className="stat-value text-[#E8323C]">{reviewScore}</div>
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
        <div className="mt-7">
          <WindowCard label="PRODUCTS_BUILT_ON_THIS.SYS" bodyClass="window-body window-body-blue">
            <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
              {MOCK_PRODUCTS.length} PRODUCTS LAUNCHED FROM THIS RESEARCH &nbsp;·&nbsp; MOCK DATA
            </div>
            {MOCK_PRODUCTS.map((p) => (
              <div key={p.id} className="archive-row cursor-pointer">
                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded border-[1.5px] border-[#1C1C27] bg-paper text-[14px] font-bold">
                  {p.initial}
                </div>
                <div className="ml-2.5 flex-1">
                  <div className="archive-title text-[14px]">{p.name}</div>
                  <div className="archive-meta">
                    {p.sector} · {p.stage} · {p.funding} · ▲ {p.votes}
                  </div>
                </div>
                <span className="text-[14px] text-muted">→</span>
              </div>
            ))}
          </WindowCard>
        </div>

        {relatedPapers.length > 0 && (
          <div className="mt-7">
            <WindowCard label="RELATED_RESEARCH.SYS" bodyClass="window-body window-body-blue">
              <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
                PAPERS ON SAME TOPIC OR FROM SAME LAB
              </div>
              {relatedPapers.map((r) => (
                <div key={r.id} className="archive-row">
                  <MediaIcon type="Essay" />
                  <div className="flex-1">
                    <Link href={`/paper/${r.slug}`} className="archive-title no-underline">
                      {r.title}
                    </Link>
                    <div className="archive-meta">
                      {r.publishedAt ? new Date(r.publishedAt).getFullYear() : null}
                      {r.categories.length > 0 && <> // {r.categories.map((c) => c.name).join(", ")}</>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-['Space_Mono',monospace] font-bold text-danger text-xs">{r.voteCount.toLocaleString()}</div>
                    <div className="text-[10px] text-muted">votes</div>
                  </div>
                </div>
              ))}
            </WindowCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperPage;
