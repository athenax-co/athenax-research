"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEED_LAUNCHES, SEED_PAPERS } from "@/data/seed";
import { useGlobal } from "@/components/GlobalProvider";
import { useCategories } from "@/hooks/useReference";
import { IconBounties, IconBuilders, IconLabs, IconPaperSmall, IconTerminal } from "../Icons";
import WindowCard from "../ui/WindowCard";

type FeedSignal = {
  id: string;
  href: string;
  kind: "paper" | "launch" | "bounty";
  label: string;
  title: string;
  meta?: string;
};

type UserWithCategories = {
  categories?: { categoryId: number }[];
} | null;

const parseMoneyMillions = (value: string) => {
  const match = value.match(/\$([\d.]+)\s*([MK]?)/i);
  if (!match) return 0;

  const amount = Number(match[1]);
  const unit = match[2]?.toUpperCase();

  if (unit === "B") return amount * 1000;
  if (unit === "K") return amount / 1000;
  return amount;
};

const averageFounderArs = SEED_LAUNCHES.length
  ? (
      SEED_LAUNCHES.reduce((launchTotal, launch) => {
        const founderAverage = launch.founders.reduce((founderTotal, founder) => founderTotal + founder.ars, 0) / launch.founders.length;
        return launchTotal + founderAverage;
      }, 0) / SEED_LAUNCHES.length
    ).toFixed(1)
  : "0.0";

const totalRaised = SEED_LAUNCHES.reduce((sum, launch) => sum + parseMoneyMillions(launch.funding), 0);

function getFeedSignals(user: UserWithCategories, categoryNames: string[]): FeedSignal[] {
  if (!user || categoryNames.length === 0) return [];

  const normalizedCategories = categoryNames.map((name) => name.toLowerCase());

  const launchSignals = SEED_LAUNCHES.map((launch) => {
    const haystack = [launch.name, launch.sector, launch.category, launch.desc, ...launch.tags, ...launch.sponsors].join(" ").toLowerCase();
    const matches = normalizedCategories.filter((category) => haystack.includes(category)).length;

    return {
      id: `launch-${launch.id}`,
      href: `/launch/${launch.id}`,
      kind: "launch" as const,
      label: matches > 0 ? "Matched to your interests" : "Trending launch",
      title: launch.name,
      meta: `${launch.sector} · ▲ ${launch.votes.toLocaleString()}`,
      score: matches * 100 + launch.votes,
    };
  });

  const paperSignals = SEED_PAPERS.map((paper) => {
    const haystack = [paper.title, paper.topic, paper.abstract, paper.lab, paper.university].join(" ").toLowerCase();
    const matches = normalizedCategories.filter((category) => haystack.includes(category)).length;

    return {
      id: `paper-${paper.id}`,
      href: `/paper/${paper.id}`,
      kind: "paper" as const,
      label: matches > 0 ? "Research in your areas" : "Popular research",
      title: paper.title,
      meta: `${paper.topic} · ${paper.year}`,
      score: matches * 100 + paper.votes,
    };
  });

  const bountySignals = normalizedCategories.length
    ? [
        {
          id: "bounty-open",
          href: "/bounties",
          kind: "bounty" as const,
          label: "Funding opportunity",
          title: "Open bounties matched to emerging research themes",
          meta: `${normalizedCategories.length} interest area${normalizedCategories.length === 1 ? "" : "s"} selected`,
          score: 50 + normalizedCategories.length,
        },
      ]
    : [];

  return [...launchSignals, ...paperSignals, ...bountySignals]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((signal) => ({
      id: signal.id,
      href: signal.href,
      kind: signal.kind,
      label: signal.label,
      title: signal.title,
      meta: signal.meta,
    }));
}

const HomeClientSections = () => {
  const router = useRouter();
  const { user, showToast, handleAuthClick } = useGlobal();
  const { data: categories = [] } = useCategories();

  const todayLaunches = SEED_LAUNCHES.filter((launch) => launch.launchedToday);
  const showLaunches = todayLaunches.length > 0 ? todayLaunches : SEED_LAUNCHES.slice(0, 5);
  const selectedCategoryNames =
    user?.categories
      ?.map((entry: { categoryId: number }) => categories.find((category) => category.id === entry.categoryId)?.name)
      .filter(Boolean) ?? [];
  const feedSignals = getFeedSignals(user, selectedCategoryNames);

  return (
    <>
      <div style={{ maxWidth: 640, marginBottom: 52 }}>
        <div className="status-badge" style={{ marginBottom: 20 }}>
          <div className="status-dot" />
          <span>
            {todayLaunches.length > 0
              ? `${todayLaunches.length} product${todayLaunches.length !== 1 ? "s" : ""} launched today`
              : `${SEED_LAUNCHES.length} live launches`}
          </span>
        </div>
        <h1 style={{ fontSize: "clamp(42px,6vw,70px)", lineHeight: 1, marginBottom: 22 }}>
          Where New
          <br />
          Products <span style={{ color: "#E8323C" }}>Begin.</span>
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: "#1C1C27", marginBottom: 32, maxWidth: 500 }}>
          Discover research-backed products across frontier technology. Every founder is ARS-scored. Every product is grounded in real research.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/launch" className="btn btn-primary" style={{ fontSize: 16, padding: "13px 28px", textDecoration: "none" }}>
            Explore Launches →
          </Link>
          <button
            className="btn btn-outline"
            style={{ fontSize: 16, padding: "13px 28px" }}
            onClick={() => {
              if (!user) {
                showToast("Sign in to submit a launch.", "error");
                handleAuthClick("login");
                return;
              }
              router.push("/launch");
            }}
          >
            Submit Your Product
          </button>
        </div>
      </div>

      <WindowCard label="NETWORK_ACTIVITY.SYS" style={{ marginBottom: 52 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
          {[
            { value: `${SEED_LAUNCHES.length}`, label: "launches this month" },
            { value: `$${totalRaised.toFixed(1)}M`, label: "raised by AthenaX startups" },
            { value: averageFounderArs, label: "average founder ARS" },
            { value: `${SEED_LAUNCHES.reduce((sum, launch) => sum + launch.investorRegs, 0)}`, label: "investor introductions" },
          ].map((metric, index, items) => (
            <div
              key={metric.label}
              style={{
                flex: "1 1 160px",
                padding: "20px 24px",
                borderRight: index < items.length - 1 ? "1.5px solid #D8D4CC" : "none",
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#E8323C",
                  marginBottom: 6,
                  lineHeight: 1,
                }}
              >
                {metric.value}
              </div>
              <div style={{ fontSize: 12, color: "#6B6B7A", fontFamily: "'Space Mono',monospace", letterSpacing: "0.03em" }}>{metric.label}</div>
            </div>
          ))}
        </div>
      </WindowCard>

      {user && feedSignals.length > 0 && (
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
            <h2 style={{ fontSize: 24 }}>Your Feed</h2>
            <Link href="/launch" className="link-arrow" style={{ textDecoration: "none" }}>
              See All →
            </Link>
          </div>
          <hr className="divider" />
          {feedSignals.map((signal) => (
            <Link
              key={signal.id}
              href={signal.href}
              className="archive-row"
              style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
            >
              <div className="archive-icon" style={{ background: "#F9F5DC", flexShrink: 0 }}>
                {signal.kind === "paper" && <IconPaperSmall />}
                {signal.kind === "launch" && <span style={{ fontSize: 11, fontWeight: 700 }}>{signal.title.charAt(0) || "L"}</span>}
                {signal.kind === "bounty" && <IconBounties size={14} />}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontFamily: "'Space Mono',monospace",
                    color: "#6B6B7A",
                    marginBottom: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {signal.label}
                </div>
                <div className="archive-title" style={{ fontSize: 14 }}>
                  {signal.title}
                </div>
                {signal.meta && <div className="archive-meta">{signal.meta}</div>}
              </div>
              <span style={{ color: "#6B6B7A", fontSize: 14, flexShrink: 0 }}>→</span>
            </Link>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 52 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
          <h2 style={{ fontSize: 28 }}>{todayLaunches.length > 0 ? "Today's Launches" : "Top Launches"}</h2>
          <Link href="/launch" className="link-arrow" style={{ textDecoration: "none" }}>
            See All →
          </Link>
        </div>
        <hr className="divider" />
        {showLaunches.map((launch) => (
          <Link
            key={launch.id}
            href={`/launch/${launch.id}`}
            className="archive-row"
            style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1.5px solid #1C1C27",
                background: "#F9F5DC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {launch.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                <div className="archive-title">{launch.name}</div>
                {launch.launchedToday && (
                  <span className="ftag" style={{ background: "#D4EDDA", fontSize: 10, fontWeight: 700 }}>
                    Today
                  </span>
                )}
                <span className="topic-pill" style={{ fontSize: 10, padding: "2px 8px" }}>
                  {launch.sector}
                </span>
              </div>
              <div className="archive-meta">
                {launch.founders.map((founder) => founder.name.split(" ").pop()).join(", ")}
                &nbsp;·&nbsp;ARS {launch.founders.map((founder) => founder.ars).join(" / ")}
              </div>
              <div style={{ fontSize: 12, color: "#6B6B7A", marginTop: 3, lineHeight: 1.5 }}>{launch.desc.slice(0, 110)}…</div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right", minWidth: 64 }}>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 15, fontWeight: 700, color: "#E8323C" }}>▲ {launch.votes.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#6B6B7A", marginTop: 3 }}>💬 {launch.comments.length}</div>
            </div>
          </Link>
        ))}
        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/launch" className="btn btn-primary" style={{ textDecoration: "none" }}>
            View All Launches →
          </Link>
          <Link href="/archive" className="btn btn-outline" style={{ textDecoration: "none" }}>
            Research Archive
          </Link>
        </div>
      </div>

      <div style={{ paddingTop: 40, borderTop: "2px solid #D8D4CC" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 18 }}>
          EXPLORE ATHENAX
        </div>
        <div className="grid-4">
          {[
            { icon: <IconLabs />, label: "Research", sub: "Papers & archive", bg: "#EAF0F6", href: "/archive" },
            { icon: <IconTerminal />, label: "Terminal", sub: "Investor intelligence", bg: "#F9F5DC", href: "/terminal" },
            { icon: <IconBounties />, label: "Bounties", sub: "Funded challenges", bg: "#F2EFE9", href: "/bounties" },
            { icon: <IconBuilders />, label: "Cohorts", sub: "Get funded · 5–8% equity", bg: "#F2EFE9", href: "/cohorts" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              style={{
                textAlign: "left",
                background: item.bg,
                border: "2px solid #1C1C27",
                borderRadius: 10,
                padding: "16px 18px",
                cursor: "pointer",
                boxShadow: "3px 3px 0 #1C1C27",
                textDecoration: "none",
                color: "inherit",
                display: "block",
              }}
            >
              <div style={{ marginBottom: 10 }}>{item.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#6B6B7A" }}>{item.sub}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeClientSections;
