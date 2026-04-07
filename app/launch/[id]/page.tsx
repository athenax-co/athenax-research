"use client";

import { use, useState } from "react";
import Link from "next/link";
import { SEED_LAUNCHES, SEED_PAPERS } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta, { toSlug } from "@/components/SEOMeta";
import { IconMore, IconPaperSmall, IconShare, IconTrash } from "@/components/Icons";
import { useGlobal } from "@/components/GlobalProvider";
import {
  useProductBySlug,
  useVoteProduct,
  useInterestProduct,
  useComments,
  useCreateComment,
  useDeleteComment,
} from "@/hooks/queries/useProduct";
import type { ProductDetailOut, ProductComment } from "@/types/product";
import { formatSubmittedDateTime } from "@/utils/lib";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { user, showToast } = useGlobal();
  const { id } = use(params);

  const seedLaunch = SEED_LAUNCHES.find((l) => l.id === id);
  const isApiProduct = !seedLaunch;

  // Always call hooks (React rules) — gated via enabled
  const { data: apiProduct, isLoading: apiLoading } = useProductBySlug(isApiProduct ? id : "");
  const { mutate: vote, isPending: voting } = useVoteProduct();
  const { mutate: interest, isPending: registeringInterest } = useInterestProduct();
  const apiProductId = apiProduct?.id ?? 0;
  const { data: comments = [] } = useComments(apiProductId);
  const { mutate: createComment, isPending: posting } = useCreateComment(apiProductId);
const { mutate: deleteComment, isPending: deletingComment } = useDeleteComment(apiProductId);

  // Seed-only vote state
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(seedLaunch?.votes ?? 0);
  const shareLaunch = async (name: string, slug: string) => {
    const shareUrl = `${window.location.origin}/launch/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `Check out ${name} on AthenaX`,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showToast("Link copied!", "success");
        return;
      }

      showToast("Sharing is not supported on this device.", "info");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      showToast("Could not share right now. Please try again.", "error");
    }
  };

  // ─── Seed product rendering (unchanged) ──────────────────────────────────────

  if (seedLaunch) {
    const launch = seedLaunch;
    const linkedPapers = SEED_PAPERS.filter((p) => launch.papers.includes(p.title));

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

    return (
      <div>
        <div className="page-wrap section">
          <SEOMeta
            title={`${launch.name} — ${launch.category} | AthenaX Launch`}
            description={`${launch.name} launched on AthenaX. Built by ARS-scored researchers. ${launch.desc.slice(0, 120)}`}
            type="product"
          />
          <Link className="link-arrow" href="/launch" style={{ marginBottom: 20 }}>
            ← Back to Launch
          </Link>
          <div className="path-badge ml-0 sm:ml-3">/root/launch/{toSlug(launch.name)}</div>

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-5">
            <div className="flex items-start gap-3 sm:flex-1">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#1C1C27] bg-paper text-xl font-bold sm:h-16 sm:w-16 sm:text-2xl">
                {launch.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="mb-2 text-[34px] leading-none sm:text-[36px]">{launch.name}</h1>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="topic-pill">{launch.category}</span>
                  <span className="ftag" style={{ background: launch.stage === "Seed" ? "#D4EDDA" : "#EAF0F6" }}>
                    {launch.stage}
                  </span>
                  <span className="ftag bg-paper font-bold text-[#15803D]">{launch.funding}</span>
                </div>
                <p className="text-sm leading-[1.6] text-muted sm:text-base">{launch.desc}</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:flex-col sm:text-center">
              <button
                className={`${voted ? "btn btn-ghost" : "btn btn-outline"} flex-1 flex-col justify-center px-4 py-2 sm:min-h-20.5 sm:flex-none sm:px-5.5 sm:py-3.5`}
                style={{ ...(voted ? { background: "#D4EDDA" } : {}) }}
                onClick={handleVote}
              >
                <div className="text-[22px] leading-none">▲</div>
                <div className="mt-1 font-['Space_Mono',monospace] text-sm font-bold text-[#E8323C]">{voteCount.toLocaleString()}</div>
              </button>
              <button
                className="btn btn-ghost flex-1 justify-center px-4 py-2 text-xs sm:min-h-20.5 sm:flex-none sm:px-5.5 sm:py-3.5"
                onClick={() => shareLaunch(launch.name, toSlug(launch.name))}
              >
                ⬡ Share
              </button>
            </div>
          </div>

          <hr className="divider" />

          <div className="grid-2 gap-5.5">
            <div>
              <WindowCard label="RESEARCH_LINEAGE.SYS" className="mb-5.5">
                <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">THIS PRODUCT IS BUILT ON</div>
                {linkedPapers.length > 0 ? (
                  linkedPapers.map((p) => (
                    <Link href={`/paper/${p.id}`} key={p.id} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
                      <IconPaperSmall />
                      <div className="ml-2 flex-1">
                        <div className="archive-title text-[13px]">{p.title}</div>
                        <div className="archive-meta">
                          {p.year} · {p.topic} · {p.citations} cites
                        </div>
                      </div>
                      <span className="text-sm text-muted">→</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-[13px] text-muted">Research lineage indexed. {launch.papers.join(", ")}</p>
                )}
              </WindowCard>

              <WindowCard label="ECOSYSTEM.SYS" bodyClass="window-body window-body-blue" className="mb-5.5">
                <div className="mb-3">
                  <div className="mb-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">RESEARCH AREAS</div>
                  <div className="flex flex-wrap gap-1.5">
                    {launch.tags.map((t) => (
                      <Link
                        key={t}
                        href={`/terminal?q=${encodeURIComponent(`topic: ${t}`)}`}
                        className="topic-pill cursor-pointer border-none font-['Space_Grotesk',sans-serif] no-underline"
                      >
                        {t}
                      </Link>
                    ))}
                  </div>
                </div>
                <hr className="divider-sm" />
                <div>
                  <div className="mb-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">INFRASTRUCTURE SPONSORS</div>
                  <div className="flex flex-wrap gap-1.5">
                    {launch.sponsors.map((s) => (
                      <span key={s} className="ftag bg-white">
                        ✦ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </WindowCard>

              <WindowCard label="LINKS.SYS">
                {[
                  { label: "GitHub Repository", url: launch.github, color: "#1C1C27" },
                  { label: "Live Demo", url: launch.demo, color: "#E8323C" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center justify-between border-b border-b-[#D8D4CC] py-2.5">
                    <span className="text-sm font-semibold">{l.label}</span>
                    <Link
                      href={`https://${l.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-['Space_Mono',monospace] text-xs"
                      style={{ color: l.color }}
                    >
                      ↗ {l.url}
                    </Link>
                  </div>
                ))}
              </WindowCard>
            </div>

            <div>
              <WindowCard label="FOUNDERS.SYS" className="mb-5.5">
                <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">ARS-VERIFIED FOUNDERS</div>
                {launch.founders.map((f) => (
                  <Link href="/docs/researchers" key={f.name} className="lb-row cursor-pointer py-3 text-inherit no-underline">
                    <div className="lb-avatar h-10 w-10 text-[15px]">{f.name.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="lb-name">{f.name}</div>
                      <div className="lb-meta">{f.lab}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-['Space_Mono',monospace] text-sm font-bold text-[#E8323C]">ARS {f.ars}</div>
                    </div>
                  </Link>
                ))}
              </WindowCard>

              <WindowCard label="METRICS.SYS" className="mb-5.5">
                <div className="grid-2 gap-3">
                  {[
                    { label: "Launch Votes", value: voteCount.toLocaleString() },
                    { label: "Funding", value: launch.funding },
                    { label: "Stage", value: launch.stage },
                    { label: "Founded", value: launch.founded },
                  ].map((s) => (
                    <div key={s.label} className="stat-card">
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value text-[18px]">{s.value}</div>
                    </div>
                  ))}
                </div>
              </WindowCard>

              <WindowCard label="ACTIONS.SYS" bodyClass="window-body window-body-yellow">
                <div className="flex flex-col gap-2.5">
                  <button
                    className="btn btn-primary justify-center"
                    onClick={() => {
                      showToast("Investor interest registered. Founders will be notified.", "success");
                    }}
                  >
                    ★ Register Investor Interest
                  </button>
                  <BookmarkButton user={user} launch={launch} showToast={showToast} size="sm" />
                  <Link className="btn btn-outline justify-center mt-1 no-underline" href="/network/talent">
                    Startup Marketplace →
                  </Link>
                  <Link className="btn btn-ghost btn-sm justify-center no-underline" href="/terminal">
                    Research in Terminal →
                  </Link>
                </div>
              </WindowCard>

              <WindowCard label="DEVELOPER_ACTIVITY.SYS" className="mt-5" bodyClass="window-body window-body-blue">
                <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">SINCE LAUNCH</div>
                {[
                  { label: "Developer views", value: launch.devViews?.toLocaleString() || "—" },
                  { label: "GitHub stars gained", value: `+${launch.githubStars || 0}` },
                  { label: "Bookmarks", value: Math.floor((launch.votes || 0) * 0.4) },
                  { label: "Discussion comments", value: launch.comments?.length || 0 },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between border-b border-b-[#D8D4CC] py-1.75 text-[13px]">
                    <span className="text-muted">{r.label}</span>
                    <span className="font-['Space_Mono',monospace] font-bold">{r.value}</span>
                  </div>
                ))}
                <Link href={`https://${launch.github}`} target="_blank" rel="noreferrer" className="block mt-3">
                  <button className="btn btn-outline btn-sm w-full justify-center">⌥ View on GitHub →</button>
                </Link>
                <Link href={`https://${launch.demo}`} target="_blank" rel="noreferrer">
                  <button className="btn btn-primary btn-sm mt-2 w-full justify-center">↗ Try This Product →</button>
                </Link>
              </WindowCard>

              <WindowCard label="TALENT_PIPELINE.SYS" className="mt-5">
                <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">HIRING VIA ATHENAX</div>
                <div className="mb-2 flex justify-between text-[13px]">
                  <span className="text-muted">Open roles</span>
                  <span className="font-['Space_Mono',monospace] font-bold">{launch.rolesOpen || 0}</span>
                </div>
                <div className="mb-3.5 flex justify-between text-[13px]">
                  <span className="text-muted">Filled via AthenaX</span>
                  <span className="font-['Space_Mono',monospace] font-bold text-[#15803D]">{launch.rolesFilledViaAthenaX || 0}</span>
                </div>
                <Link className="btn btn-outline btn-sm w-full justify-center no-underline" href="/network/talent">
                  Browse All Startups →
                </Link>
                {user && (
                  <button
                    className="btn btn-ghost btn-sm mt-1.5 w-full justify-center"
                    onClick={() => showToast("Joining team interest registered!", "success")}
                  >
                    + Express Interest in Joining
                  </button>
                )}
              </WindowCard>

              <WindowCard label="INVESTOR_SIGNALS.SYS" className="mt-5" bodyClass="window-body window-body-yellow">
                <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">INVESTOR ACTIVITY</div>
                <div className="mb-2 flex justify-between text-[13px]">
                  <span className="text-muted">Interest registrations</span>
                  <span className="font-['Space_Mono',monospace] font-bold text-[#E8323C]">{launch.investorRegs || 0}</span>
                </div>
                <div className="mb-3.5 flex justify-between text-[13px]">
                  <span className="text-muted">Terminal subscribers watching</span>
                  <span className="font-['Space_Mono',monospace] font-bold">{Math.floor((launch.investorRegs || 0) * 1.4)}</span>
                </div>
                <button
                  className="btn btn-primary btn-sm w-full justify-center"
                  onClick={() => showToast("Investor interest registered. Founders will be notified.", "success")}
                >
                  ★ Register Investor Interest
                </button>
              </WindowCard>
            </div>
          </div>

          <div className="mt-8">
            <WindowCard label="DISCUSSION.SYS">
              <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
                {launch.comments?.length || 0} COMMENTS — DEVELOPER & RESEARCHER DISCUSSION
              </div>
              {(launch.comments || []).map((c, i) => (
                <div key={i} className="flex gap-3 border-b border-b-[#D8D4CC] py-3">
                  <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1C1C27] bg-[#EAF0F6] text-[11px] font-bold">
                    {c.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-['Space_Mono',monospace] text-xs text-muted">{c.user}</div>
                    <div className="text-sm leading-[1.6] text-[#1C1C27]">{c.text}</div>
                  </div>
                </div>
              ))}
              {user ? (
                <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
                  <input className="inp flex-1 py-2 px-3 text-[13px]" placeholder="Add a technical comment or question…" />
                  <button className="btn btn-primary btn-sm w-full justify-center sm:w-auto" onClick={() => showToast("Comment posted!", "success")}>
                    Post
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted">Sign in to join the discussion.</p>
              )}
            </WindowCard>
          </div>
        </div>
      </div>
    );
  }

  // ─── API product rendering ────────────────────────────────────────────────────

  if (apiLoading) {
    return (
      <div className="page-wrap section">
        <Link className="link-arrow" href="/launch" style={{ marginBottom: 20 }}>
          ← Back to Launch
        </Link>
        <div className="animate-pulse">
          <div className="mb-5 flex flex-wrap items-start gap-5">
            <div className="h-16 w-16 shrink-0 rounded-xl bg-[#E8E4DC]" />
            <div className="flex-1">
              <div className="mb-2 h-8 w-56 rounded bg-[#E8E4DC]" />
              <div className="h-4 w-full rounded bg-[#E8E4DC]" />
              <div className="mt-1 h-4 w-3/4 rounded bg-[#E8E4DC]" />
            </div>
            <div className="h-16 w-16 shrink-0 rounded bg-[#E8E4DC]" />
          </div>
          <hr className="divider" />
          <div className="grid-2 gap-5.5">
            <div className="space-y-5">
              <div className="h-40 rounded-xl bg-[#E8E4DC]" />
              <div className="h-32 rounded-xl bg-[#E8E4DC]" />
            </div>
            <div className="space-y-5">
              <div className="h-32 rounded-xl bg-[#E8E4DC]" />
              <div className="h-40 rounded-xl bg-[#E8E4DC]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!apiProduct) {
    return (
      <div className="page-wrap section">
        <p>Launch not found.</p>
        <Link className="link-arrow" href="/launch">
          ← Back to Launch
        </Link>
      </div>
    );
  }

  const p: ProductDetailOut = apiProduct;
  const primaryCategory = p.categories[0]?.name ?? "Product";

  const isInvestor = (user?.role as string) === "investor";
  const isAdmin = (user?.role as string) === "admin";

  const handleApiVote = () => {
    if (!user) {
      showToast("Sign in to upvote.", "error");
      return;
    }
    const newVoted = !p.voted;
    vote(
      { id: p.id, voted: newVoted },
      {
        onSuccess: () => showToast(newVoted ? `Upvoted ${p.name}!` : "Vote removed.", "success"),
        onError: () => showToast("Failed to vote. Please try again.", "error"),
      }
    );
  };

  const handleApiInterest = () => {
    if (!user) {
      showToast("Sign in to register interest.", "error");
      return;
    }
    if (!isInvestor) {
      showToast("Investor access required.", "error");
      return;
    }
    const newInterested = !p.interested;
    interest(
      { id: p.id, interested: newInterested },
      {
        onSuccess: () => showToast(newInterested ? "Investor interest registered. Founders will be notified." : "Interest removed.", "success"),
        onError: () => showToast("Failed to register interest. Please try again.", "error"),
      }
    );
  };

  return (
    <div>
      <div className="page-wrap section">
        <SEOMeta
          title={`${p.name} — ${primaryCategory} | AthenaX Launch`}
          description={`${p.name} launched on AthenaX. ${p.description.slice(0, 120)}`}
          type="product"
        />
        <Link className="link-arrow" href="/launch" style={{ marginBottom: 20 }}>
          ← Back to Launch
        </Link>
        <div className="path-badge ml-0 sm:ml-3">/root/launch/{p.slug}</div>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-5">
          <div className="flex items-start gap-3 sm:flex-1">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 border-[#1C1C27] bg-paper text-xl font-bold sm:h-16 sm:w-16 sm:text-2xl">
              {p.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="mb-2 text-[34px] leading-none sm:text-[36px]">{p.name}</h1>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="topic-pill">{primaryCategory}</span>
                <span className="ftag" style={{ background: p.stage === "Seed" ? "#D4EDDA" : "#EAF0F6" }}>
                  {p.stage}
                </span>
                <span className="ftag bg-paper font-bold text-[#15803D]">${p.funding.toLocaleString()}</span>
              </div>
              <p className="text-sm leading-[1.6] text-muted sm:text-base">{p.description}</p>
            </div>
          </div>
          <div className="shrink-0 flex w-full items-center gap-2 sm:w-auto">
            <button
              className={`${p.voted ? "btn btn-ghost" : "btn btn-outline"} flex-1 justify-center sm:flex-none`}
              style={{ ...(p.voted ? { background: "#D4EDDA" } : {}), padding: "8px 14px", gap: 6 }}
              onClick={handleApiVote}
              disabled={voting}
            >
              <span className="text-[16px] leading-none">{voting ? "…" : "▲"}</span>
              <span className="font-['Space_Mono',monospace] text-xs font-bold text-[#E8323C]">{p.voteCount.toLocaleString()}</span>
            </button>
            <button
              className="btn btn-ghost btn-sm flex-1 justify-center sm:flex-none"
              style={{ fontSize: 12 }}
              onClick={() => shareLaunch(p.name, p.slug)}
            >
              <IconShare size={14} />
              Share
            </button>
          </div>
        </div>

        <hr className="divider" />

        <div className="grid-2 gap-5.5">
          <div>
            <WindowCard label="RESEARCH_LINEAGE.SYS" className="mb-5.5">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">THIS PRODUCT IS BUILT ON</div>
              {p.papers && p.papers.length > 0 ? (
                p.papers.map((paper) => (
                  <Link href={`/paper/${paper.slug}`} key={paper.id} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
                    <IconPaperSmall />
                    <div className="ml-2 flex-1">
                      <div className="archive-title text-[13px]">{paper.title}</div>
                      <div className="archive-meta">{new Date(paper.publishedAt).getFullYear()}</div>
                    </div>
                    <span className="text-sm text-muted">→</span>
                  </Link>
                ))
              ) : (
                <p className="text-[13px] text-muted">No research lineage linked yet.</p>
              )}
            </WindowCard>

            <WindowCard label="ECOSYSTEM.SYS" bodyClass="window-body window-body-blue" className="mb-5.5">
              <div className="mb-3">
                <div className="mb-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">RESEARCH AREAS</div>
                <div className="flex flex-wrap gap-1.5">
                  {(p.categories ?? []).map((c) => (
                    <Link
                      key={c.id}
                      href={`/terminal?q=${encodeURIComponent(`topic: ${c.name}`)}`}
                      className="topic-pill cursor-pointer border-none font-['Space_Grotesk',sans-serif] no-underline"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
              <hr className="divider-sm" />
              <div>
                <div className="mb-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">INFRASTRUCTURE SPONSORS</div>
                <p className="text-[13px] text-muted">Data not available for this product.</p>
              </div>
            </WindowCard>

            <WindowCard label="LINKS.SYS">
              {[
                { label: "GitHub Repository", url: p.github, color: "#1C1C27" },
                { label: "Live Demo", url: p.demo, color: "#E8323C" },
              ]
                .filter((l) => l.url)
                .map((l) => (
                  <div key={l.label} className="flex items-center justify-between border-b border-b-[#D8D4CC] py-2.5">
                    <span className="text-sm font-semibold">{l.label}</span>
                    <Link
                      href={l.url!.startsWith("http") ? l.url! : `https://${l.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-['Space_Mono',monospace] text-xs"
                      style={{ color: l.color }}
                    >
                      ↗ {l.url}
                    </Link>
                  </div>
                ))}
              {!p.github && !p.demo && <p className="text-[13px] text-muted">No links provided.</p>}
            </WindowCard>
          </div>

          <div>
            <WindowCard label="FOUNDERS.SYS" className="mb-5.5">
              <div className="mb-3.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">ARS-VERIFIED FOUNDERS</div>
              <p className="text-[13px] text-muted">Founder data not available for this product.</p>
            </WindowCard>

            <WindowCard label="METRICS.SYS" className="mb-5.5">
              <div className="grid-2 gap-3">
                {[
                  { label: "Launch Votes", value: p.voteCount.toLocaleString() },
                  { label: "Funding", value: `$${p.funding.toLocaleString()}` },
                  { label: "Stage", value: p.stage },
                  { label: "Founded", value: p.founded },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value text-[18px]">{s.value}</div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="ACTIONS.SYS" bodyClass="window-body window-body-yellow">
              <div className="flex flex-col gap-2.5">
                {isInvestor && (
                  <button
                    className={p.interested ? "btn btn-ghost justify-center" : "btn btn-primary justify-center"}
                    style={p.interested ? { background: "#D4EDDA" } : {}}
                    onClick={handleApiInterest}
                    disabled={registeringInterest}
                  >
                    ★ {registeringInterest ? "Registering…" : p.interested ? "Interest Registered" : "Register Investor Interest"}
                  </button>
                )}
                <BookmarkButton user={user} launch={p} showToast={showToast} size="sm" useApi initialBookmarked={p.bookmarked} />
                <Link className="btn btn-outline justify-center mt-1 no-underline" href="/network/talent">
                  Startup Marketplace →
                </Link>
                <Link className="btn btn-ghost btn-sm justify-center no-underline" href="/terminal">
                  Research in Terminal →
                </Link>
              </div>
            </WindowCard>

            <WindowCard label="DEVELOPER_ACTIVITY.SYS" className="mt-5" bodyClass="window-body window-body-blue">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">SINCE LAUNCH</div>
              {[
                { label: "Bookmarks", value: p.bookmarkCount },
                { label: "Investor interest", value: p.investorInterestCount },
              ].map((r) => (
                <div key={r.label} className="flex justify-between border-b border-b-[#D8D4CC] py-1.75 text-[13px]">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-['Space_Mono',monospace] font-bold">{r.value}</span>
                </div>
              ))}
              {p.github && (
                <Link href={p.github.startsWith("http") ? p.github : `https://${p.github}`} target="_blank" rel="noreferrer" className="block mt-3">
                  <button className="btn btn-outline btn-sm w-full justify-center">⌥ View on GitHub →</button>
                </Link>
              )}
              {p.demo && (
                <Link href={p.demo.startsWith("http") ? p.demo : `https://${p.demo}`} target="_blank" rel="noreferrer">
                  <button className="btn btn-primary btn-sm mt-2 w-full justify-center">↗ Try This Product →</button>
                </Link>
              )}
            </WindowCard>

            <WindowCard label="TALENT_PIPELINE.SYS" className="mt-5">
              <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">HIRING VIA ATHENAX</div>
              <p className="text-[13px] text-muted">Talent data not available for this product.</p>
              <Link className="btn btn-outline btn-sm w-full justify-center no-underline mt-3" href="/network/talent">
                Browse All Startups →
              </Link>
            </WindowCard>

            {isInvestor && (
              <WindowCard label="INVESTOR_SIGNALS.SYS" className="mt-5" bodyClass="window-body window-body-yellow">
                <div className="mb-3 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">INVESTOR ACTIVITY</div>
                <div className="mb-3.5 flex justify-between text-[13px]">
                  <span className="text-muted">Interest registrations</span>
                  <span className="font-['Space_Mono',monospace] font-bold text-[#E8323C]">{p.investorInterestCount}</span>
                </div>
                <button
                  className={p.interested ? "btn btn-ghost btn-sm w-full justify-center" : "btn btn-primary btn-sm w-full justify-center"}
                  style={p.interested ? { background: "#D4EDDA" } : {}}
                  onClick={handleApiInterest}
                  disabled={registeringInterest}
                >
                  ★ {registeringInterest ? "Registering…" : p.interested ? "Interest Registered" : "Register Investor Interest"}
                </button>
              </WindowCard>
            )}
          </div>
        </div>

        <DiscussionSection
          productId={p.id}
          userId={user?.id ?? null}
          isAdmin={isAdmin}
          comments={comments}
          posting={posting}
          deletingComment={deletingComment}
          createComment={createComment}
          deleteComment={deleteComment}
          showToast={showToast}
          user={user}
        />
      </div>
    </div>
  );
}

function DiscussionSection({
  productId: _productId,
  userId,
  isAdmin,
  comments,
  posting,
  deletingComment,
  createComment,
  deleteComment,
  showToast,
  user,
}: {
  productId: number;
  userId: number | null;
  isAdmin: boolean;
  comments: ProductComment[];
  posting: boolean;
  deletingComment: boolean;
  createComment: (text: string, opts?: any) => void;
  deleteComment: (commentId: number, opts?: any) => void;
  showToast: (msg: string, type: string) => void;
  user: any;
}) {
  const [text, setText] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handlePost = () => {
    if (!text.trim()) return;
    createComment(text.trim(), {
      onSuccess: () => {
        setText("");
        showToast("Comment posted!", "success");
      },
      onError: () => showToast("Failed to post comment.", "error"),
    });
  };

  const handleDelete = (commentId: number) => {
    deleteComment(commentId, {
      onSuccess: () => showToast("Comment deleted.", "info"),
      onError: () => showToast("Failed to delete comment.", "error"),
    });
  };

  return (
    <div className="mt-8">
      <WindowCard label="DISCUSSION.SYS">
        <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
          {comments.length} COMMENT{comments.length !== 1 ? "S" : ""} — DEVELOPER & RESEARCHER DISCUSSION
        </div>

        {comments.length === 0 && <p className="text-[13px] text-muted">No comments yet. Be the first to share your thoughts.</p>}

        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 border-b border-b-[#D8D4CC] py-3">
            <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1C1C27] bg-[#EAF0F6] text-[11px] font-bold">
              {c.userId === userId ? (user?.name?.charAt(0) ?? "?") : "?"}
            </div>
            <div className="flex-1">
              <div className="mb-1 font-['Space_Mono',monospace] text-xs text-muted">
                {c.userId === userId ? (user?.name ?? "You") : `User #${c.userId}`}
                <span className="ml-2 opacity-50">{formatSubmittedDateTime(c.createdAt)}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                  <div className="text-sm leading-[1.6] text-[#1C1C27]">{c.text}</div>
                  {isAdmin && (
                    <div className="relative shrink-0">
                      <button
                        className="btn btn-ghost btn-sm px-2 py-1"
                        onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                      >
                        <IconMore size={15} />
                      </button>
                      {openMenuId === c.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                          <div
                            className="absolute right-0 top-full z-20 mt-1 min-w-32.5 rounded-lg border-2 border-[#1C1C27] bg-white shadow-md"
                            style={{ boxShadow: "2px 2px 0 #1C1C27" }}
                          >
                            <button
                              className="flex w-full items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#E8323C] hover:bg-[#FFF0F0]"
                              onClick={() => {
                                handleDelete(c.id);
                                setOpenMenuId(null);
                              }}
                              disabled={deletingComment}
                            >
                              <IconTrash size={13} />
                              {deletingComment ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>
        ))}

        {user ? (
          <div className="mt-3.5 flex flex-col gap-2 sm:flex-row">
            <input
              className="inp flex-1 py-2 px-3 text-[13px]"
              placeholder="Add a technical comment or question…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePost()}
            />
            <button className="btn btn-primary btn-sm w-full justify-center sm:w-auto" onClick={handlePost} disabled={posting || !text.trim()}>
              Post
            </button>
          </div>
        ) : (
          <p className="mt-3 text-xs text-muted">Sign in to join the discussion.</p>
        )}
      </WindowCard>
    </div>
  );
}
