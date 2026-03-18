import { SEED_PAPERS, SEED_RESEARCHERS, SEED_USERS } from "@/data/seed";

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

export const DB_KEYS = {
  USERS: "ax_users",
  SESSION: "ax_session",
  RESEARCHERS: "ax_researchers",
  PAPERS: "ax_papers",
  BOUNTIES: "ax_bounties",
  APPLICATIONS: "ax_applications",
  SUBSCRIBERS: "ax_subscribers",
  SEEDED: "ax_seeded_v2",
};

const subscriberSvc = {
  getAll: () => dbRead(DB_KEYS.SUBSCRIBERS, []),
  isSubscribed: (email: string, newsletterId: string) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []);
    return subs.some((s: { email: string; newsletterId: string }) => s.email === email && s.newsletterId === newsletterId);
  },
  subscribe: (email: string, newsletterId: string) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []);
    if (subs.some((s: { email: string; newsletterId: string }) => s.email === email && s.newsletterId === newsletterId))
      return { error: "Already subscribed." };
    dbWrite(DB_KEYS.SUBSCRIBERS, [...subs, { id: dbUid("sub"), email, newsletterId, subscribedAt: dbNow() }]);
    return { ok: true };
  },
  unsubscribe: (email: string, newsletterId: string) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []).filter(
      (s: { email: string; newsletterId: string }) => !(s.email === email && s.newsletterId === newsletterId)
    );
    dbWrite(DB_KEYS.SUBSCRIBERS, subs);
    return { ok: true };
  },
  getByEmail: (email: string) => dbRead(DB_KEYS.SUBSCRIBERS, []).filter((s: { email: string }) => s.email === email),
};

const initDB = () => {
  if (localStorage.getItem(DB_KEYS.SEEDED)) return;
  dbWrite(DB_KEYS.USERS, SEED_USERS);
  dbWrite(DB_KEYS.RESEARCHERS, SEED_RESEARCHERS);
  dbWrite(DB_KEYS.APPLICATIONS, []);
  localStorage.setItem(DB_KEYS.SEEDED, "1");
};

const calcARS = (r: any) => {
  if (!r) return 0;
  const s =
    (r.citations || 0) * 0.3 +
    (r.peerReviews || 0) * 0.25 +
    Math.min((r.downloads || 0) / 1000, 20) * 0.15 +
    Math.min((r.votes || 0) / 100, 20) * 0.15 +
    (r.sponsorEndorsements || 0) * 0.1 +
    (r.bountyCompletions || 0) * 0.05;
  return Math.min(10, parseFloat(s.toFixed(1)));
};

const authSvc = {
  getSession: () => {
    const s = dbRead(DB_KEYS.SESSION, []);
    if (!s?.userId) return null;
    return dbRead(DB_KEYS.USERS).find((u: { id: any; }) => u.id === s.userId) || null;
  },
  login: (email: string, password: string) => {
    const user = dbRead(DB_KEYS.USERS).find((u: { email: string; password: string }) => u.email === email && u.password === password);
    if (!user) return { error: "Invalid email or password." };
    dbWrite(DB_KEYS.SESSION, [{ userId: user.id, loginAt: dbNow() }]);
    return { user };
  },
  logout: () => localStorage.removeItem(DB_KEYS.SESSION),
  register: (data: any) => {
    const users = dbRead(DB_KEYS.USERS);
    if (users.find((u: { email: any }) => u.email === data.email)) return { error: "An account with this email already exists." };
    const user = { id: dbUid("user"), ...data, avatar: data.name?.charAt(0).toUpperCase() || "?", createdAt: dbNow() };
    dbWrite(DB_KEYS.USERS, [...users, user]);
    if (data.role === "researcher") {
      const rs = dbRead(DB_KEYS.RESEARCHERS);
      dbWrite(DB_KEYS.RESEARCHERS, [
        ...rs,
        {
          id: dbUid("res"),
          userId: user.id,
          name: data.name,
          university: data.university || "",
          lab: data.lab || "",
          bio: data.bio || "",
          avatar: user.avatar,
          citations: 0,
          peerReviews: 0,
          downloads: 0,
          votes: 0,
          sponsorEndorsements: 0,
          bountyCompletions: 0,
        },
      ]);
    }
    dbWrite(DB_KEYS.SESSION, [{ userId: user.id, loginAt: dbNow() }]);
    return { user };
  },
  updateProfile: (userId: string, updates: any) => {
    const users = dbRead(DB_KEYS.USERS).map((u: { id: string }) => (u.id === userId ? { ...u, ...updates, updatedAt: dbNow() } : u));
    dbWrite(DB_KEYS.USERS, users);
    const updated = users.find((u: { id: string }) => u.id === userId);
    if (updated?.role === "researcher") {
      const rs = dbRead(DB_KEYS.RESEARCHERS);
      const ri = rs.findIndex((r: { userId: string }) => r.userId === userId);
      if (ri >= 0) {
        ["name", "bio", "university", "lab"].forEach((k) => {
          if (updates[k] !== undefined) rs[ri][k] = updates[k];
        });
        dbWrite(DB_KEYS.RESEARCHERS, rs);
      }
    }
    return updated;
  },
  getResearcher: (userId: string) => dbRead(DB_KEYS.RESEARCHERS).find((r: { userId: string }) => r.userId === userId) || null,
  getPapersByUser: (userId: string) => SEED_PAPERS.filter((p: { authorIds: any }) => (p.authorIds || []).includes(userId)),
  getApplications: (userId: string) => dbRead(DB_KEYS.APPLICATIONS).filter((a: { userId: string }) => a.userId === userId),
  DEMO_ACCOUNTS: [
    { label: "Researcher — Dr. Yuki Tanaka", email: "yuki@mit.edu", password: "demo123" },
    { label: "Researcher — Dankrad Feist", email: "dankrad@ef.org", password: "demo123" },
    { label: "Sponsor — Ethereum Foundation", email: "grants@ethereum.org", password: "demo123" },
    { label: "Admin", email: "admin@athenax.io", password: "admin123" },
  ],
};

export { initDB, calcARS, authSvc, subscriberSvc };
