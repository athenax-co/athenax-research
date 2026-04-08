"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import Modal from "@/components/ui/Modal";
import { useGlobal } from "@/components/GlobalProvider";
import { useProducts } from "@/hooks/queries/useProduct";
import { usePapers, useUpdatePaperStatus } from "@/hooks/queries/usePaper";
import { SEED_BOUNTIES, SEED_LAUNCHES, SEED_PAPERS, SEED_RESEARCHERS, SEED_SPONSORS, SEED_STARTUPS } from "@/data/seed";
import { PaperStatus } from "@/enums";
import { cn } from "@/utils/lib";

type AdminTab = "launches" | "papers" | "cohorts" | "bounties" | "platform";

type QueueRowProps = {
  name: string;
  meta: string;
  chips?: string[];
  reviewTitle?: string;
  reviewDescription?: string;
  reviewMeta?: { label: string; value: string }[];
  onApprove: () => void;
  onReject: () => void;
  onReview: () => void;
};

function QueueRow({ name, meta, chips = [], onApprove, onReject, onReview }: QueueRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-[15px] font-semibold text-ink">{name}</div>
        <div className="mb-2 font-['Space_Mono',monospace] text-[12px] text-muted">{meta}</div>
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <span key={chip} className="topic-pill text-[10px]">
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={onApprove}>
          ✓ Approve
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onReject}>
          ✗ Reject
        </button>
        <button className="btn btn-outline btn-sm" onClick={onReview}>
          Review →
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const { user, showToast } = useGlobal();
  const [tab, setTab] = useState<AdminTab>("launches");
  const [reviewItem, setReviewItem] = useState<{
    title: string;
    description?: string;
    meta?: { label: string; value: string }[];
    details?: { label: string; value: string }[];
    chips?: string[];
    itemId?: number;
    itemType?: "paper";
  } | null>(null);

  const { data: pendingProducts = [], isLoading: loadingPending } = useProducts("pending");
  const { data: draftPapers = [], isLoading: loadingPapers } = usePapers(PaperStatus.DRAFT);
  const { mutate: updatePaperStatus } = useUpdatePaperStatus();

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/admin</div>
        <h1 className="mb-3 text-5xl">Admin</h1>
        <WindowCard label="ACCESS_DENIED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Admin access required. Sign in as an admin account.</p>
          <Link className="btn btn-primary" href="/dashboard">
            Back to Dashboard
          </Link>
        </WindowCard>
      </div>
    );
  }

  const pendingBounties = SEED_BOUNTIES.slice(0, 1).map((bounty) => ({ ...bounty, status: "pending_review" }));
  const pendingCohorts = [
    { id: "ca_1", name: "Dr. Sana Mirza", product: "NeuroBench", track: "AI Safety", ars: 7.2, submitted: "2025-03-13" },
    { id: "ca_2", name: "Team QuantumNet", product: "ProofNet", track: "Crypto & DeFi", ars: 6.8, submitted: "2025-03-12" },
  ];

  const tabs: { id: AdminTab; label: string; count: number }[] = [
    { id: "launches", label: "Launch Queue", count: pendingProducts.length },
    { id: "papers", label: "Paper Queue", count: draftPapers.length },
    { id: "cohorts", label: "Cohort Apps", count: pendingCohorts.length },
    { id: "bounties", label: "Bounty Review", count: pendingBounties.length },
    { id: "platform", label: "Platform Stats", count: 0 },
  ];

  const handleApprove = (name: string) => showToast(`Approved: ${name}`, "success");
  const handleReject = (name: string) => showToast(`Rejected: ${name}`, "info");
  const openReview = (item: {
    title: string;
    description?: string;
    meta?: { label: string; value: string }[];
    details?: { label: string; value: string }[];
    chips?: string[];
    itemId?: number;
    itemType?: "paper";
  }) => setReviewItem(item);

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/admin</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Link href="/dashboard" className="font-mono text-xs text-muted no-underline hover:underline">
            ← Dashboard
          </Link>
          <h1 className="mb-0 text-5xl">Admin</h1>
        </div>
        <span className="font-mono text-xs text-muted">Welcome back, {user.name.split(" ")[0]}</span>
      </div>
      <p className="mb-0 text-[17px] text-muted">Moderation queue, platform operations, and system health.</p>
      <hr className="divider" />

      <div className="mb-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {[
          { label: "Pending Launches", value: pendingProducts.length, tone: "text-[#E8323C]" },
          { label: "Pending Papers", value: draftPapers.length, tone: "text-[#E8323C]" },
          { label: "Cohort Apps", value: pendingCohorts.length, tone: "text-[#E8323C]" },
          { label: "Open Bounties", value: SEED_BOUNTIES.length, tone: "text-[#15803D]" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className={cn("stat-value text-[22px]", s.tone)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            className={cn("btn btn-sm", tab === id ? "btn-ghost bg-yellow" : "btn-outline")}
            onClick={() => setTab(id)}
          >
            {label}
            {count > 0 && <span className="ml-1 font-['Space_Mono',monospace] text-[10px] font-bold text-[#E8323C]">({count})</span>}
          </button>
        ))}
      </div>

      {tab === "launches" && (
        <WindowCard label="LAUNCH_MODERATION.SYS">
          <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">PENDING LAUNCH SUBMISSIONS</div>
          {loadingPending ? (
            <p className="text-[13px] text-muted">Loading…</p>
          ) : pendingProducts.length === 0 ? (
            <p className="text-[13px] text-muted">No pending launches.</p>
          ) : (
            pendingProducts.map((product) => (
              <QueueRow
                key={product.id}
                name={product.name}
                meta={`${product.stage} · Funding $${product.funding.toLocaleString()} · Founded ${product.founded} · Submitted ${new Date(product.createdAt).toLocaleDateString("en-CA")}`}
                chips={(product.categories ?? []).map((category) => category.name)}
                onApprove={() => handleApprove(product.name)}
                onReject={() => handleReject(product.name)}
                onReview={() =>
                  openReview({
                    title: product.name,
                    description: product.description,
                    chips: (product.categories ?? []).map((category) => category.name),
                    meta: [
                      { label: "Stage", value: product.stage },
                      { label: "Funding", value: `$${product.funding.toLocaleString()}` },
                      { label: "Founded", value: String(product.founded) },
                    ],
                    details: [
                      { label: "GitHub", value: product.github || "Not provided" },
                      { label: "Demo", value: product.demo || "Not provided" },
                      { label: "Quality Badge", value: product.qualityBadge || "None" },
                      { label: "Submitted", value: new Date(product.createdAt).toLocaleDateString("en-GB") },
                    ],
                  })
                }
              />
            ))
          )}
        </WindowCard>
      )}

      {tab === "papers" && (
        <WindowCard label="PAPER_REVIEW_QUEUE.SYS">
          <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">PENDING RESEARCH SUBMISSIONS</div>
          {loadingPapers ? (
            <p className="text-[13px] text-muted">Loading…</p>
          ) : draftPapers.length === 0 ? (
            <p className="text-[13px] text-muted">No papers pending review.</p>
          ) : (
            draftPapers.map((paper) => (
              <QueueRow
                key={paper.id}
                name={paper.title.length > 60 ? paper.title.slice(0, 60) + "…" : paper.title}
                meta={`${paper.sourceType} · ${paper.categories.length} categories · Submitted ${new Date(paper.createdAt).toLocaleDateString("en-CA")}`}
                chips={paper.categories.map((c) => c.name)}
                onApprove={() => {
                  updatePaperStatus(
                    { id: paper.id, status: PaperStatus.PUBLISHED },
                    { onSuccess: () => showToast(`Published: ${paper.title.slice(0, 30)}`, "success") }
                  );
                }}
                onReject={() => {
                  updatePaperStatus(
                    { id: paper.id, status: PaperStatus.ARCHIVED },
                    { onSuccess: () => showToast(`Archived: ${paper.title.slice(0, 30)}`, "info") }
                  );
                }}
                onReview={() =>
                  openReview({
                    title: paper.title,
                    description: paper.abstract ?? undefined,
                    chips: paper.categories.map((c) => c.name),
                    meta: [
                      { label: "Source", value: paper.sourceType },
                      { label: "Votes", value: String(paper.voteCount) },
                      { label: "Submitted", value: new Date(paper.createdAt).toLocaleDateString("en-GB") },
                    ],
                    details: [
                      { label: "External URL", value: paper.externalUrl ?? "None" },
                      { label: "Status", value: paper.status },
                    ],
                    itemId: paper.id,
                    itemType: "paper",
                  })
                }
              />
            ))
          )}
        </WindowCard>
      )}

      {tab === "cohorts" && (
        <WindowCard label="COHORT_APPLICATION_REVIEW.SYS">
          <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">PENDING COHORT APPLICATIONS</div>
          {pendingCohorts.map((cohort) => (
            <QueueRow
              key={cohort.id}
              name={`${cohort.name} — ${cohort.product}`}
              meta={`Track: ${cohort.track} · ARS ${cohort.ars} · Submitted ${cohort.submitted}`}
              chips={[cohort.track, `ARS ${cohort.ars}`]}
              onApprove={() => handleApprove(cohort.product)}
              onReject={() => handleReject(cohort.product)}
              onReview={() =>
                openReview({
                  title: `${cohort.name} — ${cohort.product}`,
                  chips: [cohort.track, `ARS ${cohort.ars}`],
                  meta: [
                    { label: "Track", value: cohort.track },
                    { label: "Product", value: cohort.product },
                    { label: "Submitted", value: cohort.submitted },
                  ],
                  details: [{ label: "Applicant", value: cohort.name }],
                })
              }
            />
          ))}
        </WindowCard>
      )}

      {tab === "bounties" && (
        <WindowCard label="BOUNTY_REVIEW_QUEUE.SYS">
          <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">PENDING BOUNTY SUBMISSIONS</div>
          {pendingBounties.map((bounty) => (
            <QueueRow
              key={bounty.id}
              name={`${bounty.title.slice(0, 60)}…`}
              meta={`${bounty.sponsor} · ${bounty.reward} · ${bounty.topic}`}
              chips={[bounty.topic, bounty.reward]}
              onApprove={() => handleApprove(bounty.title.slice(0, 30))}
              onReject={() => handleReject(bounty.title.slice(0, 30))}
              onReview={() =>
                openReview({
                  title: bounty.title,
                  chips: [bounty.topic, bounty.reward],
                  meta: [
                    { label: "Sponsor", value: bounty.sponsor },
                    { label: "Reward", value: bounty.reward },
                    { label: "Deadline", value: bounty.deadline },
                  ],
                  details: [{ label: "Topic", value: bounty.topic }],
                })
              }
            />
          ))}
        </WindowCard>
      )}

      {tab === "platform" && (
        <div className="grid gap-5.5 md:grid-cols-2">
          <WindowCard label="PLATFORM_METRICS.SYS">
            {[
              { label: "Total Researchers", value: SEED_RESEARCHERS.length },
              { label: "Indexed Papers", value: SEED_PAPERS.length },
              { label: "Live Launches", value: SEED_LAUNCHES.length },
              { label: "Active Sponsors", value: SEED_SPONSORS.length },
              { label: "Open Bounties", value: SEED_BOUNTIES.length },
              { label: "Companies Listed", value: SEED_STARTUPS.length },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between border-b border-[#D8D4CC] py-2 text-[13px] last:border-b-0">
                <span className="text-muted">{metric.label}</span>
                <span className="font-['Space_Mono',monospace] font-bold">{metric.value}</span>
              </div>
            ))}
          </WindowCard>

          <WindowCard label="REVENUE_TRACKING.SYS" bodyClass="window-body window-body-yellow">
            {[
              { label: "Launch packages (est.)", value: "$42K" },
              { label: "Terminal subs (est.)", value: "$140K/mo" },
              { label: "Talent placement (est.)", value: "$180K" },
              { label: "Bounty fees (10%)", value: "$21K" },
              { label: "Sponsored programs", value: "$280K" },
            ].map((metric) => (
              <div key={metric.label} className="flex items-center justify-between border-b border-[#D8D4CC] py-2 text-[13px] last:border-b-0">
                <span className="text-muted">{metric.label}</span>
                <span className="font-['Space_Mono',monospace] font-bold text-[#15803D]">{metric.value}</span>
              </div>
            ))}
          </WindowCard>
        </div>
      )}

      {reviewItem && (
        <Modal title="REVIEW_QUEUE_ITEM.SYS" onClose={() => setReviewItem(null)}>
          <div className="mb-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <h2 className="mb-0 text-[22px]">{reviewItem.title}</h2>
              {(reviewItem.chips ?? []).map((chip) => (
                <span key={chip} className="topic-pill">
                  {chip}
                </span>
              ))}
            </div>

            {reviewItem.description && <p className="mb-4 text-[13px] leading-[1.6] text-muted">{reviewItem.description}</p>}

            {(reviewItem.meta ?? []).length > 0 && (
              <>
                <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {(reviewItem.meta ?? []).slice(0, 3).map((item) => (
                    <div key={item.label} className="stat-card">
                      <div className="stat-label">{item.label}</div>
                      <div className="stat-value text-[15px]">{item.value}</div>
                    </div>
                  ))}
                </div>

                {(reviewItem.meta ?? []).slice(3).length > 0 && (
                  <div>
                    {(reviewItem.meta ?? []).slice(3).map((item) => (
                      <div key={item.label} className="mb-1.5 flex items-center justify-between border-b border-[#D8D4CC] py-1.5">
                        <span className="text-[12px] font-semibold text-muted">{item.label}</span>
                        <span className="font-['Space_Mono',monospace] text-[11px]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(reviewItem.details ?? []).map((item) => (
                  <div key={item.label} className="mb-1.5 flex items-center justify-between border-b border-[#D8D4CC] py-1.5">
                    <span className="text-[12px] font-semibold text-muted">{item.label}</span>
                    <span className="font-['Space_Mono',monospace] text-[11px]">{item.value}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex gap-2 border-t border-[#D8D4CC] pt-3">
            <button
              className="btn btn-primary flex-1 justify-center"
              onClick={() => {
                if (reviewItem.itemType === "paper" && reviewItem.itemId != null) {
                  updatePaperStatus(
                    { id: reviewItem.itemId, status: PaperStatus.PUBLISHED },
                    { onSuccess: () => showToast(`Published: ${reviewItem.title.slice(0, 30)}`, "success") }
                  );
                } else {
                  handleApprove(reviewItem.title);
                }
                setReviewItem(null);
              }}
            >
              ✓ Approve
            </button>
            <button
              className="btn btn-outline flex-1 justify-center"
              onClick={() => {
                if (reviewItem.itemType === "paper" && reviewItem.itemId != null) {
                  updatePaperStatus(
                    { id: reviewItem.itemId, status: PaperStatus.ARCHIVED },
                    { onSuccess: () => showToast(`Archived: ${reviewItem.title.slice(0, 30)}`, "info") }
                  );
                } else {
                  handleReject(reviewItem.title);
                }
                setReviewItem(null);
              }}
            >
              ✗ Reject
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
