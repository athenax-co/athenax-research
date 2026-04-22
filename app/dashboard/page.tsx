"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { dbNow, dbRead, dbUid, dbWrite, formatShortDate, notifSvc } from "@/utils/lib";
import { useMyProducts, useMyVotedProducts, useMyBookmarkedProducts } from "@/features/products";
import type { ProductSummary } from "@/features/products";

const FOLLOW_KEYS = {
  FOLLOWS: "ax_follows_v1",
  NOTIFICATIONS: "ax_notifications_v1",
  VOTES: "ax_votes_v1",
} as const;

type FollowType = "launch" | "researcher" | "topic";

type FollowItem = {
  id: string;
  userId: string;
  type: FollowType;
  targetId: string;
  targetName: string;
  followedAt: string;
};

const followSvc = {
  getAll: (userId: string): FollowItem[] => dbRead(FOLLOW_KEYS.FOLLOWS, []).filter((f: FollowItem) => f.userId === userId),
  toggle: (userId: string, type: FollowType, targetId: string, targetName: string) => {
    const all: FollowItem[] = dbRead(FOLLOW_KEYS.FOLLOWS, []);
    const idx = all.findIndex((f) => f.userId === userId && f.type === type && f.targetId === targetId);
    if (idx >= 0) {
      dbWrite(
        FOLLOW_KEYS.FOLLOWS,
        all.filter((_, i) => i !== idx)
      );
      return { followed: false };
    }
    dbWrite(FOLLOW_KEYS.FOLLOWS, [
      ...all,
      {
        id: dbUid("fl"),
        userId,
        type,
        targetId,
        targetName,
        followedAt: dbNow(),
      },
    ]);
    return { followed: true };
  },
};

function ProductMini({ product }: { product: ProductSummary }) {
  return (
    <Link className="archive-row cursor-pointer no-underline text-inherit" href={`/launch/${product.slug}`}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink bg-paper text-[13px] font-bold">
        {product.name.charAt(0)}
      </div>
      <div className="ml-2.5 flex-1">
        <div className="archive-title text-sm">{product.name}</div>
        <div className="archive-meta">
          {product.stage} · ▲ {product.voteCount}
        </div>
      </div>
      <span className="ftag shrink-0 bg-yellow text-[11px] font-semibold">★ {product.bookmarkCount}</span>
    </Link>
  );
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow text-black",
  approved: "bg-[#E8F5E9] text-[#2E7D32]",
  rejected: "bg-[#FDECEA] text-[#E8323C]",
};

function FounderSubmissions() {
  const { data: products, isLoading } = useMyProducts();

  return (
    <div className="mb-8">
      <WindowCard label="MY_SUBMISSIONS.SYS">
        {isLoading ? (
          <p className="text-[13px] text-muted">Loading…</p>
        ) : !products || products.length === 0 ? (
          <div>
            <p className="mb-3 text-[13px] text-muted">No submissions yet.</p>
            <Link className="btn btn-outline btn-sm" href="/launch">
              Submit a Product →
            </Link>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-start gap-3 border-b border-[#D8D4CC] py-3 last:border-b-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink bg-paper text-[13px] font-bold">
                {product.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold">{product.name}</div>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-muted">{product.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[10px] text-muted">{product.stage}</span>
                  {(product.categories ?? []).map((c) => (
                    <span key={c.id} className="topic-pill text-[10px]">
                      {c.name}
                    </span>
                  ))}
                  <span className="font-mono text-[10px] text-muted">{formatShortDate(product.createdAt)}</span>
                </div>
              </div>
              <span className={`ftag shrink-0 text-[10px] ${STATUS_STYLE[product.status] ?? ""}`}>{product.status}</span>
            </div>
          ))
        )}
      </WindowCard>
    </div>
  );
}

export default function Page() {
  const { user, handleAuthClick } = useGlobal();
  const [, setTick] = useState(0);
  const { data: bookmarkedProducts, isLoading: bookmarksLoading } = useMyBookmarkedProducts();
  const { data: votedProducts, isLoading: votesLoading } = useMyVotedProducts();

  if (!user)
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/dashboard</div>
        <h1 className="mb-3 text-5xl">Dashboard</h1>
        <WindowCard label="SIGN_IN_REQUIRED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Sign in to access your personal dashboard.</p>
          <div className="flex flex-wrap gap-2.5">
            <Button onClick={() => handleAuthClick("login")}>
              Sign In to Continue
            </Button>
            <Link className="btn btn-outline" href="/">
              Back to Home
            </Link>
          </div>
        </WindowCard>
      </div>
    );

  const follows = followSvc.getAll(user.id);
  const notifs = notifSvc.getAll(user.id).slice(0, 10);

  const followedResearchers = follows.filter((f) => f.type === "researcher");
  const followedTopics = follows.filter((f) => f.type === "topic");

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/dashboard</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="mb-0 text-5xl">Dashboard</h1>
        <span className="font-mono text-xs text-muted">Welcome back, {user.name.split(" ")[0]}</span>
      </div>
      <p className="mb-0 text-[17px] text-muted">Your saves, votes, follows, and activity in one place.</p>
      <hr className="divider" />

      {(user.role as string) === "founder" && <FounderSubmissions />}

      <div className="grid-4 mb-7 gap-3.5">
        {[
          { label: "Saved Products", value: bookmarkedProducts?.length ?? 0 },
          { label: "Products Voted", value: votedProducts?.length ?? 0 },
          { label: "Following", value: follows.length },
          { label: "Notifications", value: notifSvc.unread(user.id) },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value text-[22px]">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 gap-5.5">
        <div>
          <div className="mb-8">
            <WindowCard label="SAVED_PRODUCTS.SYS">
              {bookmarksLoading ? (
                <p className="text-[13px] text-muted">Loading…</p>
              ) : bookmarkedProducts && bookmarkedProducts.length > 0 ? (
                bookmarkedProducts.map((p) => <ProductMini key={p.id} product={p} />)
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  <p className="mb-3 text-[13px] text-muted">No saved products yet.</p>
                  <Link className="btn btn-outline btn-sm" href="/launch">
                    Browse Launches →
                  </Link>
                </div>
              )}
            </WindowCard>
          </div>

          <div className="mb-8">
            <WindowCard label="VOTED_PRODUCTS.SYS">
              {votesLoading ? (
                <p className="text-[13px] text-muted">Loading…</p>
              ) : votedProducts && votedProducts.length > 0 ? (
                votedProducts.map((p) => <ProductMini key={p.id} product={p} />)
              ) : (
                <div>
                  <p className="mb-3 text-[13px] text-muted">Vote on launches to build your activity history.</p>
                  <Link className="btn btn-outline btn-sm" href="/launch">
                    See Today&apos;s Launches →
                  </Link>
                </div>
              )}
            </WindowCard>
          </div>
        </div>

        <div>
          <div className="mb-8">
            <WindowCard label="FOLLOWING.SYS">
              {follows.length === 0 ? (
                <div>
                  <p className="mb-3 text-[13px] text-muted">Follow researchers, topics, and products to personalise your feed.</p>
                  <div className="flex flex-wrap gap-2">
                    <Link className="btn btn-outline btn-sm" href="/researchers">
                      Follow Researchers
                    </Link>
                    <Link className="btn btn-outline btn-sm" href="/launch">
                      Follow Products
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {followedResearchers.length > 0 && (
                    <div className="mb-3">
                      <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-muted">RESEARCHERS ({followedResearchers.length})</div>
                      {followedResearchers.map((f) => (
                        <div key={f.id} className="flex items-center gap-2 border-b border-[#D8D4CC] py-1.5">
                          <div className="lb-avatar h-7 w-7 text-[11px]">{f.targetName.charAt(0)}</div>
                          <span className="flex-1 text-[13px] font-semibold">{f.targetName}</span>
                          <button
                            className="cursor-pointer border-none bg-transparent text-[11px] text-muted"
                            onClick={() => {
                              followSvc.toggle(user.id, f.type, f.targetId, f.targetName);
                              setTick((v) => v + 1);
                            }}
                          >
                            Unfollow
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {followedTopics.length > 0 && (
                    <div>
                      <div className="mb-2 font-mono text-[10px] tracking-[0.06em] text-muted">TOPICS ({followedTopics.length})</div>
                      <div className="flex flex-wrap gap-1.5">
                        {followedTopics.map((f) => (
                          <span key={f.id} className="topic-pill cursor-pointer">
                            {f.targetName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </WindowCard>
          </div>

          <WindowCard label="RECENT_ACTIVITY.SYS">
            {notifs.length === 0 ? (
              <p className="text-[13px] text-muted">No activity yet. Follow researchers and products to start your feed.</p>
            ) : (
              notifs.map((n) => (
                <button
                  key={n.id}
                  className="w-full cursor-pointer border-none border-b border-[#D8D4CC] bg-transparent py-2.5 text-left"
                  onClick={() => {
                    notifSvc.markOne(n.id);
                    setTick((v) => v + 1);
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 shrink-0 rounded border-[1.5px] border-ink px-2 py-1 font-mono text-[9px] tracking-[0.05em] ${
                        n.read ? "bg-cream" : "bg-yellow"
                      }`}
                    >
                      {n.kind.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px] leading-normal text-ink">{n.text}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-muted">{formatShortDate(n.createdAt)}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
