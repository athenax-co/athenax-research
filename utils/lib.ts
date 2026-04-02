import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Utility: Combine classnames ────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// DB helpers first — everything else depends on these
export const dbRead = (k: string, fb = []) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fb;
  } catch {
    return fb;
  }
};
export const dbWrite = (k: string, v: any[]) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};
export const dbUid = (p = "id") => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
export const dbNow = () => new Date().toISOString();

const DB_KEYS = {
  USERS: "ax_users",
  SESSION: "ax_session",
  RESEARCHERS: "ax_researchers",
  PAPERS: "ax_papers",
  BOUNTIES: "ax_bounties",
  APPLICATIONS: "ax_applications",
  SUBSCRIBERS: "ax_subscribers",
  SEEDED: "ax_seeded_v2",
};

const FOLLOW_KEYS = {
  FOLLOWS: "ax_follows_v1",
  NOTIFICATIONS: "ax_notifications_v1",
  BOOKMARKS: "ax_bookmarks_v1",
  VOTES: "ax_votes_v1",
};

export const subscriberSvc = {
  getAll: () => dbRead(DB_KEYS.SUBSCRIBERS, []),
  isSubscribed: (email: any, newsletterId: any) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []);
    return subs.some((s: { email: any; newsletterId: any }) => s.email === email && s.newsletterId === newsletterId);
  },
  subscribe: (email: any, newsletterId: any) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []);
    if (subs.some((s: { email: any; newsletterId: any }) => s.email === email && s.newsletterId === newsletterId))
      return { error: "Already subscribed." };
    dbWrite(DB_KEYS.SUBSCRIBERS, [...subs, { id: dbUid("sub"), email, newsletterId, subscribedAt: dbNow() }]);
    return { ok: true };
  },
  unsubscribe: (email: any, newsletterId: any) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []).filter(
      (s: { email: any; newsletterId: any }) => !(s.email === email && s.newsletterId === newsletterId)
    );
    dbWrite(DB_KEYS.SUBSCRIBERS, subs);
    return { ok: true };
  },
  getByEmail: (email: any) => dbRead(DB_KEYS.SUBSCRIBERS, []).filter((s: { email: any }) => s.email === email),
};

export const bookmarkSvc = {
  getAll: (userId: string) => dbRead(FOLLOW_KEYS.BOOKMARKS, []).filter((b: { userId: string }) => b.userId === userId),
  isBookmarked: (userId: string, id: string) =>
    dbRead(FOLLOW_KEYS.BOOKMARKS, []).some((b: { userId: string; launchId: string }) => b.userId === userId && b.launchId === id),
  count: (id: string) => dbRead(FOLLOW_KEYS.BOOKMARKS, []).filter((b: { launchId: string }) => b.launchId === id).length,
  toggle: (userId: string, launch: any) => {
    const all = dbRead(FOLLOW_KEYS.BOOKMARKS, []);
    const idx = all.findIndex((b: { userId: string; launchId: any }) => b.userId === userId && b.launchId === launch.id);
    if (idx >= 0) {
      dbWrite(
        FOLLOW_KEYS.BOOKMARKS,
        all.filter((_: any, i: any) => i !== idx)
      );
      return { saved: false };
    }
    dbWrite(FOLLOW_KEYS.BOOKMARKS, [
      ...all,
      { id: dbUid("bk"), userId, launchId: launch.id, launchName: launch.name, launchSector: launch.sector, savedAt: dbNow() },
    ]);
    return { saved: true };
  },
};
