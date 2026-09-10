"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import WindowCard from "@/components/ui/WindowCard";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrafficLights } from "@/components/ui/Dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { usePagedProducts, useUpdateProductStatus, pendingSubcategory } from "@/features/products";
import { usePapers, useUpdatePaperVerificationStatus } from "@/features/papers";
import { SEED_BOUNTIES, SEED_LAUNCHES, SEED_PAPERS, SEED_RESEARCHERS, SEED_SPONSORS, SEED_STARTUPS } from "@/data/seed";
import { PaperVerificationStatus, ProductStatus } from "@/enums";
import { cn } from "@/utils/lib";
import { ProductBadge } from "@/components/ui/ProductBadge";
import Pagination from "@/components/ui/Pagination";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type AdminTab = "launches" | "papers" | "cohorts" | "bounties" | "platform";

const LAUNCH_PAGE_SIZE = 20;

type QueueRowProps = {
  name: string;
  meta: string;
  logo?: string | null;
  chips?: string[];
  pendingSubName?: string | null;
  onApprove: () => void;
  onReject?: () => void;
  reviewHref?: string;
  onReview?: () => void;
};

function QueueRow({ name, meta, logo, chips = [], pendingSubName, onApprove, onReject, reviewHref, onReview }: QueueRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[#D8D4CC] py-3 last:border-b-0">
      <Avatar className="size-9 rounded border border-[#D8D4CC]">
        <AvatarImage src={logo ?? undefined} alt={name} className="object-contain" />
        <AvatarFallback className="rounded text-[13px] font-semibold bg-white">{name[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex gap-4">
          {reviewHref ? (
            <Link href={reviewHref} className="mb-1 text-[15px] font-semibold text-ink hover:text-danger">
              {name}
            </Link>
          ) : (
            <div className="mb-1 text-[15px] font-semibold text-ink">{name}</div>
          )}
          {(chips.length > 0 || pendingSubName) && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <ProductBadge key={chip} label={chip} />
              ))}
              {pendingSubName && (
                <p className="inline-flex h-5 items-center rounded-full border-[1.5px] border-[#D4A017]/40 bg-[#FEF3C7] px-2.5 font-['Space_Mono',monospace] text-[10px] font-semibold uppercase tracking-[0.04em] text-[#92400E] border-dotted">
                  ⚠ {pendingSubName.toUpperCase()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mb-2 font-['Space_Mono',monospace] text-[12px] text-muted">{meta}</div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button size="sm" onClick={onApprove}>
          ✓ Approve
        </Button>
        {onReject && (
          <Button variant="ghost" size="sm" onClick={onReject}>
            ✗ Reject
          </Button>
        )}
        {reviewHref ? (
          <Link href={reviewHref} className="btn btn-outline btn-sm">
            Review →
          </Link>
        ) : onReview ? (
          <Button variant="outline" size="sm" onClick={onReview}>
            Review →
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function Page() {
  const { user, showToast, handleAuthClick } = useGlobal();
  const [tab, setTab] = useState<AdminTab>("launches");
  const [launchStatusFilter, setLaunchStatusFilter] = useState<ProductStatus>(ProductStatus.PENDING);
  const [launchPage, setLaunchPage] = useQueryState("page", parseAsInteger.withDefault(1).withOptions({ scroll: false, shallow: true }));
  const [reviewItem, setReviewItem] = useState<{
    title: string;
    description?: string;
    meta?: { label: string; value: string }[];
    details?: { label: string; value: string }[];
    chips?: string[];
  } | null>(null);

  const { data: pendingProductsData, isLoading: loadingPending, isFetching: fetchingPending, refetch: refetchPending } = usePagedProducts("pending", { page: launchPage, pageSize: LAUNCH_PAGE_SIZE });
  const pendingProducts = pendingProductsData?.items ?? [];
  const pendingProductsTotal = pendingProductsData?.total ?? 0;
  const {
    data: rejectedProductsData,
    isLoading: loadingRejected,
    isFetching: fetchingRejected,
    refetch: refetchRejected,
  } = usePagedProducts(ProductStatus.REJECTED, { page: launchPage, pageSize: LAUNCH_PAGE_SIZE }, { enabled: launchStatusFilter === ProductStatus.REJECTED });
  const rejectedProducts = rejectedProductsData?.items ?? [];
  const rejectedProductsTotal = rejectedProductsData?.total ?? 0;
  const launchProductsTotal = launchStatusFilter === ProductStatus.REJECTED ? rejectedProductsTotal : pendingProductsTotal;
  const launchTotalPages = Math.ceil(launchProductsTotal / LAUNCH_PAGE_SIZE);
  const { data: pendingPapers = [], isLoading: loadingPapers } = usePapers(50, 0, PaperVerificationStatus.PENDING);
  const { mutate: updateVerification } = useUpdatePaperVerificationStatus();
  const { mutate: updateProductStatus } = useUpdateProductStatus();

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/admin</div>
        <h1 className="mb-3 text-5xl">Admin</h1>
        <WindowCard label="ACCESS_DENIED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Admin access required. Sign in as an admin account.</p>
          <div className="flex flex-wrap gap-2.5">
            <Button onClick={() => handleAuthClick("login")}>Sign In to Continue</Button>
            <Link className="btn btn-outline" href="/dashboard">
              Back to Dashboard
            </Link>
          </div>
        </WindowCard>
      </div>
    );
  }

  const pendingBounties = SEED_BOUNTIES.slice(0, 1).map((bounty) => ({ ...bounty, status: "pending_review" }));
  const pendingCohorts = [
    { id: "ca_1", name: "Dr. Sana Mirza", product: "NeuroBench", track: "AI Safety", ars: 7.2, submitted: "2025-03-13" },
    { id: "ca_2", name: "Team QuantumNet", product: "ProofNet", track: "Crypto", ars: 6.8, submitted: "2025-03-12" },
  ];

  const tabs: { id: AdminTab; label: string; count: number }[] = [
    { id: "launches", label: "Launch Queue", count: pendingProductsTotal },
    { id: "papers", label: "Paper Queue", count: pendingPapers.length },
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
  }) => setReviewItem(item);

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/admin</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Link href="/dashboard" className="font-sans text-xs text-muted no-underline hover:text-ink">
            ← Dashboard
          </Link>
          <h1 className="mb-0 text-5xl">Admin</h1>
        </div>
        <span className="font-sans text-xs text-muted">Welcome back, {user.name.split(" ")[0]}</span>
      </div>
      <p className="mb-0 text-[17px] text-muted">Moderation queue, platform operations, and system health.</p>
      <hr className="divider" />

      <div className="mb-7 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {[
          { label: "Pending Launches", value: pendingProductsTotal, tone: "text-[#E8323C]" },
          { label: "Pending Papers", value: pendingPapers.length, tone: "text-[#E8323C]" },
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
          <Button
            key={id}
            size="sm"
            variant={tab === id ? "ghost" : "outline"}
            className={tab === id ? "bg-yellow" : undefined}
            onClick={() => { setTab(id); if (id === "launches") setLaunchPage(1); }}
          >
            {label}
            {count > 0 && <span className="ml-1 font-['Space_Mono',monospace] text-[10px] font-bold text-[#E8323C]">({count})</span>}
          </Button>
        ))}
      </div>

      {tab === "launches" && (
        <WindowCard label="LAUNCH_MODERATION.SYS">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
              {launchStatusFilter === ProductStatus.REJECTED ? "REJECTED LAUNCH SUBMISSIONS" : "PENDING LAUNCH SUBMISSIONS"}
            </span>
            <select
              value={launchStatusFilter}
              onChange={(e) => {
                setLaunchStatusFilter(e.target.value as ProductStatus);
                setLaunchPage(1);
              }}
              className="rounded border border-[#D8D4CC] bg-white px-2 py-1 font-['Space_Mono',monospace] text-[11px] text-ink"
            >
              <option value={ProductStatus.PENDING}>Pending</option>
              <option value={ProductStatus.REJECTED}>Rejected</option>
            </select>
          </div>
          {launchStatusFilter === ProductStatus.REJECTED ? (
            loadingRejected || fetchingRejected ? (
              <p className="text-sm text-muted">Loading…</p>
            ) : rejectedProducts.length === 0 ? (
              <p className="text-sm text-muted">No rejected launches.</p>
            ) : (
              <>
                {rejectedProducts.map((product) => (
                  <QueueRow
                    key={product.id}
                    name={product.name}
                    logo={product.logo}
                    meta={`${product.stage ?? "—"} · Founded ${product.founded ?? "—"} · Submitted ${new Date(product.createdAt).toLocaleDateString("en-CA")}`}
                    chips={(product.categories ?? []).map((category) => category.name)}
                    onApprove={() =>
                      updateProductStatus(
                        { id: product.id, status: ProductStatus.APPROVED },
                        { onSuccess: () => { showToast(`Approved: ${product.name}`, "success"); refetchRejected(); }, onError: () => showToast("Action failed.", "error") }
                      )
                    }
                    reviewHref={`/launch/${product.slug}`}
                  />
                ))}
                <Pagination page={launchPage} totalPages={launchTotalPages} onPageChange={setLaunchPage} className="mt-4 border-t border-[#D8D4CC] pt-3" />
              </>
            )
          ) : loadingPending || fetchingPending ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : pendingProducts.length === 0 ? (
            <p className="text-sm text-muted">No pending launches.</p>
          ) : (
            <>
              {pendingProducts.map((product) => {
                const pendingSub = pendingSubcategory(product.categories ?? []);
                return (
                <QueueRow
                  key={product.id}
                  name={product.name}
                  logo={product.logo}
                  meta={`${product.stage ?? "—"} · Founded ${product.founded ?? "—"} · Submitted ${new Date(product.createdAt).toLocaleDateString("en-CA")}`}
                  chips={(product.categories ?? []).map((category) => category.name)}
                  pendingSubName={pendingSub?.name}
                  onApprove={() =>
                    updateProductStatus(
                      { id: product.id, status: ProductStatus.APPROVED },
                      { onSuccess: () => { showToast(`Approved: ${product.name}`, "success"); refetchPending(); }, onError: () => showToast("Action failed.", "error") }
                    )
                  }
                  onReject={() =>
                    updateProductStatus(
                      { id: product.id, status: ProductStatus.REJECTED },
                      { onSuccess: () => { showToast(`Rejected: ${product.name}`, "info"); refetchPending(); }, onError: () => showToast("Action failed.", "error") }
                    )
                  }
                  reviewHref={`/launch/${product.slug}`}
                />
                );
              })}
              <Pagination page={launchPage} totalPages={launchTotalPages} onPageChange={setLaunchPage} className="mt-4 border-t border-[#D8D4CC] pt-3" />
            </>
          )}
        </WindowCard>
      )}

      {tab === "papers" && (
        <WindowCard label="PAPER_REVIEW_QUEUE.SYS">
          <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">PENDING RESEARCH SUBMISSIONS</div>
          {loadingPapers ? (
            <p className="text-[13px] text-muted">Loading…</p>
          ) : pendingPapers.length === 0 ? (
            <p className="text-[13px] text-muted">No papers pending review.</p>
          ) : (
            pendingPapers.map((paper) => (
              <QueueRow
                key={paper.id}
                name={paper.title.length > 60 ? paper.title.slice(0, 60) + "…" : paper.title}
                meta={`${paper.sourceType} · ${paper.categories.length} categories · Submitted ${new Date(paper.createdAt).toLocaleDateString("en-CA")}`}
                chips={paper.categories.map((c) => c.name)}
                onApprove={() =>
                  updateVerification(
                    { id: paper.id, verificationStatus: PaperVerificationStatus.APPROVED },
                    { onSuccess: () => showToast(`Approved: ${paper.title.slice(0, 40)}`, "success") }
                  )
                }
                onReject={() =>
                  updateVerification(
                    { id: paper.id, verificationStatus: PaperVerificationStatus.REJECTED },
                    { onSuccess: () => showToast(`Rejected: ${paper.title.slice(0, 40)}`, "info") }
                  )
                }
                reviewHref={`/paper/${paper.slug}`}
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

      <Dialog open={!!reviewItem} onOpenChange={(open) => !open && setReviewItem(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="window-titlebar" style={{ border: "none", padding: 0, background: "none", flex: 1 }}>
              <DialogTrafficLights />
              <DialogTitle className="titlebar-label ml-2">REVIEW_QUEUE_ITEM.SYS</DialogTitle>
            </div>
            <DialogClose className="modal-close">×</DialogClose>
          </DialogHeader>
          <DialogBody>
            <div className="mb-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="mb-0 text-[22px]">{reviewItem?.title}</h2>
                {(reviewItem?.chips ?? []).map((chip) => (
                  <span key={chip} className="topic-pill">
                    {chip}
                  </span>
                ))}
              </div>

              {reviewItem?.description && <p className="mb-4 text-[13px] leading-[1.6] text-muted">{reviewItem.description}</p>}

              {(reviewItem?.meta ?? []).length > 0 && (
                <>
                  <div className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {(reviewItem?.meta ?? []).slice(0, 3).map((item) => (
                      <div key={item.label} className="stat-card">
                        <div className="stat-label">{item.label}</div>
                        <div className="stat-value text-[15px]">{item.value}</div>
                      </div>
                    ))}
                  </div>

                  {(reviewItem?.meta ?? []).slice(3).length > 0 && (
                    <div>
                      {(reviewItem?.meta ?? []).slice(3).map((item) => (
                        <div key={item.label} className="mb-1.5 flex items-center justify-between border-b border-[#D8D4CC] py-1.5">
                          <span className="text-[12px] font-semibold text-muted">{item.label}</span>
                          <span className="font-['Space_Mono',monospace] text-[11px]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(reviewItem?.details ?? []).map((item) => (
                    <div key={item.label} className="mb-1.5 flex items-center justify-between border-b border-[#D8D4CC] py-1.5">
                      <span className="text-[12px] font-semibold text-muted">{item.label}</span>
                      <span className="font-['Space_Mono',monospace] text-[11px]">{item.value}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="flex gap-2 border-t border-[#D8D4CC] pt-3">
              <Button
                className="flex-1 justify-center"
                onClick={() => {
                  handleApprove(reviewItem?.title ?? "");
                  setReviewItem(null);
                }}
              >
                ✓ Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 justify-center"
                onClick={() => {
                  handleReject(reviewItem?.title ?? "");
                  setReviewItem(null);
                }}
              >
                ✗ Reject
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>

      <div className="mb-5 mt-10 grid grid-cols-1 gap-3.5 md:grid-cols-3 border-t border-[#D8D4CC] pt-5">
        <WindowCard label="ARTICLES.SYS">
          <div className="mb-1 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">EDITORIAL CONTENT</div>
          <p className="mb-3 text-[13px] text-muted">Create, edit, and manage articles, white papers, and recaps.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/articles/editor" className={buttonVariants({ size: "sm" })}>
              + Create New
            </Link>
            <Link href="/admin/articles" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Manage →
            </Link>
          </div>
        </WindowCard>

        <WindowCard label="BROADCASTS.SYS">
          <div className="mb-1 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">BROADCAST CONTENT</div>
          <p className="mb-3 text-[13px] text-muted">Create, edit, and manage whitepapers, livestreams, and roundtables.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/broadcasts/editor" className={buttonVariants({ size: "sm" })}>
              + Create New
            </Link>
            <Link href="/admin/broadcasts" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Manage →
            </Link>
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
