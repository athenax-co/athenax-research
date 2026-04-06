"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import { useGlobal } from "@/components/GlobalProvider";
import { SEED_LAUNCHES } from "@/data/seed";
import { dbNow, dbRead, dbUid, dbWrite, bookmarkSvc } from "@/utils/lib";
import { useProducts, useUpdateProductStatus } from "@/hooks/queries/useProduct";

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

type NotificationItem = {
  id: string;
  userId: string;
  kind: string;
  text: string;
  createdAt: string;
  read?: boolean;
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

const notifSvc = {
  getAll: (userId: string): NotificationItem[] =>
    dbRead(FOLLOW_KEYS.NOTIFICATIONS, [])
      .filter((n: NotificationItem) => n.userId === userId)
      .sort((a: NotificationItem, b: NotificationItem) => +new Date(b.createdAt) - +new Date(a.createdAt)),
  unread: (userId: string) => dbRead(FOLLOW_KEYS.NOTIFICATIONS, []).filter((n: NotificationItem) => n.userId === userId && !n.read).length,
  markOne: (id: string) => {
    const all: NotificationItem[] = dbRead(FOLLOW_KEYS.NOTIFICATIONS, []);
    dbWrite(
      FOLLOW_KEYS.NOTIFICATIONS,
      all.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  },
};

function LaunchMini({ launch, user, showToast }: { launch: any; user: any; showToast: (text: string, type?: string) => void }) {
  if (!launch) return null;

  return (
    <Link className="archive-row cursor-pointer no-underline text-inherit" href={`/launch/${launch.id}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink bg-paper text-[13px] font-bold">
        {launch.name.charAt(0)}
      </div>
      <div className="ml-2.5 flex-1">
        <div className="archive-title text-sm">{launch.name}</div>
        <div className="archive-meta">
          {launch.sector} · {launch.stage} · ▲ {launch.votes}
        </div>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <BookmarkButton user={user} launch={launch} showToast={showToast} size="sm" />
      </div>
    </Link>
  );
}

function AdminPendingReview({ showToast }: { showToast: (text: string, type?: string) => void }) {
  const { data: products, isLoading } = useProducts("pending");
  const { mutate: updateStatus, isPending } = useUpdateProductStatus();

  return (
    <div className="mb-8">
      <WindowCard label="PENDING_REVIEW.SYS" bodyClass="window-body window-body-yellow">
        {isLoading ? (
          <p className="text-[13px] text-muted">Loading…</p>
        ) : !products || products.length === 0 ? (
          <p className="text-[13px] text-muted">No pending products.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-start gap-3 border-b border-[#D8D4CC] py-3 last:border-b-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink bg-paper text-[13px] font-bold">
                {product.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold">{product.name}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-[11px] text-muted">{product.stage}</span>
                  {product.categories.map((c) => (
                    <span key={c.id} className="topic-pill text-[10px]">
                      {c.name}
                    </span>
                  ))}
                  <span className="font-mono text-[10px] text-muted">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button
                  className="btn btn-primary btn-sm"
                  disabled={isPending}
                  onClick={() => updateStatus({ id: product.id, status: "approved" }, { onSuccess: () => showToast(`${product.name} approved`) })}
                >
                  Approve
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={isPending}
                  onClick={() => updateStatus({ id: product.id, status: "rejected" }, { onSuccess: () => showToast(`${product.name} rejected`) })}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </WindowCard>
    </div>
  );
}

export default function Page() {
  const { user, showToast } = useGlobal();
  const [tick, setTick] = useState(0);

  if (!user)
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/dashboard</div>
        <h1 className="mb-3 text-5xl">Dashboard</h1>
        <WindowCard label="SIGN_IN_REQUIRED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Sign in to access your personal dashboard.</p>
          <Link className="btn btn-primary" href="/">
            Back to Home
          </Link>
        </WindowCard>
      </div>
    );

  const bookmarks = bookmarkSvc.getAll(user.id);
  const follows = followSvc.getAll(user.id);
  const notifs = notifSvc.getAll(user.id).slice(0, 10);
  const votes = dbRead(FOLLOW_KEYS.VOTES, []).filter((v: any) => v.userId === user.id);

  const bookmarkedLaunches = bookmarks.map((b: any) => SEED_LAUNCHES.find((l) => l.id === b.launchId)).filter(Boolean);

  const votedLaunches = votes.map((v: any) => SEED_LAUNCHES.find((l) => l.id === v.launchId)).filter(Boolean);

  const followedLaunches = follows
    .filter((f) => f.type === "launch")
    .map((f) => SEED_LAUNCHES.find((l) => l.id === f.targetId))
    .filter(Boolean);

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

      {(user.role as string) === "admin" && <AdminPendingReview showToast={showToast} />}

      <div className="grid-4 mb-7 gap-3.5">
        {[
          { label: "Saved Products", value: bookmarks.length },
          { label: "Products Voted", value: votes.length },
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
              {bookmarkedLaunches.length > 0 ? (
                bookmarkedLaunches.map((l: any) => <LaunchMini key={l.id} launch={l} user={user} showToast={showToast} />)
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
              {votedLaunches.length > 0 ? (
                votedLaunches.map((l: any) => <LaunchMini key={l.id} launch={l} user={user} showToast={showToast} />)
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

          {followedLaunches.length > 0 && (
            <div className="mb-8">
              <WindowCard label="FOLLOWED_PRODUCTS.SYS">
                {followedLaunches.map((l: any) => (
                  <LaunchMini key={l.id} launch={l} user={user} showToast={showToast} />
                ))}
              </WindowCard>
            </div>
          )}
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
                      <div className="mt-0.5 font-mono text-[10px] text-muted">{new Date(n.createdAt).toLocaleDateString()}</div>
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
