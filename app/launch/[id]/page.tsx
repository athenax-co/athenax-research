"use client";

import { use, useState } from "react";
import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta from "@/components/SEOMeta";
import { IconMore, IconShare, IconTrash } from "@/components/Icons";
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

  const { data: apiProduct, isLoading } = useProductBySlug(id);
  const { mutate: vote, isPending: voting } = useVoteProduct();
  const { mutate: interest, isPending: registeringInterest } = useInterestProduct();
  const apiProductId = apiProduct?.id ?? 0;
  const { data: comments = [] } = useComments(apiProductId);
  const { mutate: createComment, isPending: posting } = useCreateComment(apiProductId);
  const { mutate: deleteComment, isPending: deletingComment } = useDeleteComment(apiProductId);

  const shareLaunch = async (slug: string) => {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin;
    const shareUrl = `${origin}/launch/${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied!", "success");
    } catch {
      showToast("Could not copy link. Please try again.", "error");
    }
  };

  if (isLoading) {
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
          description={`${p.name} launched on AthenaX.${p.description ? ` ${p.description.slice(0, 120)}` : ""}`}
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
              <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h1 className="text-[34px] leading-none sm:text-[36px]">{p.name}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  {p.categories.length > 0 && <span className="topic-pill">{p.categories[0].name}</span>}
                  {p.stage != null && (
                    <span className="ftag" style={{ background: p.stage === "Seed" ? "#D4EDDA" : "#EAF0F6" }}>
                      {p.stage}
                    </span>
                  )}
                  {p.funding != null && <span className="ftag bg-paper font-bold text-[#15803D]">${p.funding.toLocaleString()}</span>}
                </div>
              </div>
              <p className="text-sm leading-[1.6] text-muted sm:text-base">{p.description}</p>
            </div>
          </div>
          <div className="shrink-0 flex w-full items-center gap-2 sm:w-auto">
            <button
              className={p.voted ? "btn btn-ghost btn-sm bg-success flex-1 justify-center sm:flex-none" : "btn btn-outline btn-sm flex-1 justify-center sm:flex-none"}
              onClick={handleApiVote}
              disabled={voting}
            >
              {voting ? "…" : p.voted ? "✓ Voted" : "▲ Upvote"}&nbsp;·&nbsp;{p.voteCount.toLocaleString()}
            </button>
            <button
              className="btn btn-ghost btn-sm flex-1 justify-center sm:flex-none"
              style={{ fontSize: 12 }}
              onClick={() => shareLaunch(p.slug)}
            >
              <IconShare size={14} />
              Share
            </button>
          </div>
        </div>

        <hr className="divider" />

        <div className="grid-2 gap-5.5">
          <div>
            <WindowCard label="ABOUT.SYS" className="mb-5.5">
              {[
                p.categories.length > 0 ? { label: "CATEGORY", value: p.categories[0].name } : null,
                p.stage != null ? { label: "STAGE", value: p.stage } : null,
                p.founded != null ? { label: "FOUNDED", value: p.founded } : null,
                p.funding != null ? { label: "FUNDING", value: `$${p.funding.toLocaleString()}` } : null,
              ].filter(Boolean).map((row) => (
                <div key={row!.label} className="flex items-center justify-between border-b border-b-[#D8D4CC] py-3">
                  <span className="font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">{row!.label}</span>
                  <span className="text-sm font-bold">{row!.value}</span>
                </div>
              ))}
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
              {p.founders && p.founders.length > 0 ? (
                p.founders.map((name, i) => (
                  <div key={i} className="lb-row py-3">
                    <div className="lb-avatar h-10 w-10 text-[15px]">{name.charAt(0)}</div>
                    <div className="flex-1">
                      <div className="lb-name">{name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-muted">No founders listed.</p>
              )}
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
                <Link className="btn btn-outline justify-center mt-1 no-underline" href="/launch">
                  Browse All Launches →
                </Link>
                <Link className="btn btn-ghost btn-sm justify-center no-underline" href="/archive">
                  View in Archive →
                </Link>
              </div>
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
