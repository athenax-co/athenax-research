"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEED_LAUNCHES, SEED_PAPERS } from "@/data/seed";
import { useGlobal } from "@/components/GlobalProvider";
import { useCategories } from "@/hooks/queries/useReference";
import { IconBounties, IconBuilders, IconLabs, IconPaperSmall, IconTerminal } from "@/components/Icons";
import WindowCard from "@/components/ui/WindowCard";

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
          href: "/funding/bounties",
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

export default function Page() {
  const router = useRouter();
  const { user, showToast, handleAuthClick } = useGlobal();
  const { data: categories = [] } = useCategories();

  const todayLaunches = SEED_LAUNCHES.filter((launch) => launch.launchedToday);
  const showLaunches = todayLaunches.length > 0 ? todayLaunches : SEED_LAUNCHES.slice(0, 5);
  const selectedCategoryNames =
    user?.categories?.map((entry: { categoryId: number }) => categories.find((category) => category.id === entry.categoryId)?.name).filter(Boolean) ??
    [];
  const feedSignals = getFeedSignals(user, selectedCategoryNames);

  return (
    <div>
      <div className="page-wrap section">
        <>
          <div className="mb-13 max-w-160">
            <div className="status-badge mb-5">
              <div className="status-dot" />
              <span>
                {todayLaunches.length > 0
                  ? `${todayLaunches.length} product${todayLaunches.length !== 1 ? "s" : ""} launched today`
                  : `${SEED_LAUNCHES.length} live launches`}
              </span>
            </div>
            <h1 className="mb-5.5 text-[clamp(42px,6vw,70px)] leading-none">
              Where New
              <br />
              Products <span className="text-danger">Begin.</span>
            </h1>
            <p className="mb-8 max-w-125 text-[17px] leading-[1.65] text-[#1C1C27]">
              Discover research-backed products across frontier technology. Every founder is ARS-scored. Every product is grounded in real research.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/launch" className="btn btn-primary px-7 py-3.25 text-base no-underline">
                Explore Launches →
              </Link>
              <button
                className="btn btn-outline px-7 py-3.25 text-base"
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

          <div className="mb-13">
            <WindowCard label="NETWORK_ACTIVITY.SYS">
              <div className="flex flex-wrap gap-0">
                {[
                  { value: `${SEED_LAUNCHES.length}`, label: "launches this month" },
                  { value: `$${totalRaised.toFixed(1)}M`, label: "raised by AthenaX startups" },
                  { value: averageFounderArs, label: "average founder ARS" },
                  { value: `${SEED_LAUNCHES.reduce((sum, launch) => sum + launch.investorRegs, 0)}`, label: "investor introductions" },
                ].map((metric, index, items) => (
                  <div
                    key={metric.label}
                    className={`basis-40 px-6 py-5 ${index < items.length - 1 ? "border-r-[1.5px] border-r-[#D8D4CC]" : ""} flex-1`}
                  >
                    <div className="mb-1.5 font-['Space_Mono',monospace] text-[26px] font-bold leading-none text-danger">{metric.value}</div>
                    <div className="font-['Space_Mono',monospace] text-xs tracking-[0.03em] text-muted">{metric.label}</div>
                  </div>
                ))}
              </div>
            </WindowCard>
          </div>

          {user && feedSignals.length > 0 && (
            <div className="mb-13">
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="text-2xl">Your Feed</h2>
                <Link href="/launch" className="link-arrow no-underline">
                  See All →
                </Link>
              </div>
              <hr className="divider" />
              {feedSignals.map((signal) => (
                <Link key={signal.id} href={signal.href} className="archive-row cursor-pointer text-inherit no-underline">
                  <div className="archive-icon shrink-0 bg-paper">
                    {signal.kind === "paper" && <IconPaperSmall />}
                    {signal.kind === "launch" && <span className="text-[11px] font-bold">{signal.title.charAt(0) || "L"}</span>}
                    {signal.kind === "bounty" && <IconBounties size={14} />}
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 font-['Space_Mono',monospace] text-[10px] uppercase text-muted">{signal.label}</div>
                    <div className="archive-title text-sm">{signal.title}</div>
                    {signal.meta && <div className="archive-meta">{signal.meta}</div>}
                  </div>
                  <span className="shrink-0 text-sm text-muted">→</span>
                </Link>
              ))}
            </div>
          )}

          <div className="mb-13">
            <div className="mb-2 flex items-baseline justify-between">
              <h2 className="text-[28px]">{todayLaunches.length > 0 ? "Today's Launches" : "Top Launches"}</h2>
              <Link href="/launch" className="link-arrow no-underline">
                See All →
              </Link>
            </div>
            <hr className="divider" />
            {showLaunches.map((launch) => (
              <Link key={launch.id} href={`/launch/${launch.id}`} className="archive-row cursor-pointer text-inherit no-underline">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#1C1C27] bg-paper text-base font-bold">
                  {launch.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="mb-0.5 flex flex-wrap items-center gap-2">
                    <div className="archive-title">{launch.name}</div>
                    {launch.launchedToday && <span className="ftag bg-success text-[10px] font-bold">Today</span>}
                    <span className="topic-pill px-2 py-0.5 text-[10px]">{launch.sector}</span>
                  </div>
                  <div className="archive-meta">
                    {launch.founders.map((founder) => founder.name.split(" ").pop()).join(", ")}
                    &nbsp;·&nbsp;ARS {launch.founders.map((founder) => founder.ars).join(" / ")}
                  </div>
                  <div className="mt-0.75 text-xs leading-normal text-muted">{launch.desc.slice(0, 110)}…</div>
                </div>
                <div className="min-w-16 shrink-0 text-right">
                  <div className="font-['Space_Mono',monospace] text-[15px] font-bold text-danger">▲ {launch.votes.toLocaleString()}</div>
                  <div className="mt-0.75 text-[11px] text-muted">💬 {launch.comments.length}</div>
                </div>
              </Link>
            ))}
            <div className="mt-4.5 flex flex-wrap gap-3">
              <Link href="/launch" className="btn btn-primary no-underline">
                View All Launches →
              </Link>
              <Link href="/archive" className="btn btn-outline no-underline">
                Research Archive
              </Link>
            </div>
          </div>

          <div className="border-t-2 border-t-[#D8D4CC] pt-10">
            <div className="mb-4.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">EXPLORE ATHENAX</div>
            <div className="grid-4">
              {[
                { icon: <IconLabs />, label: "Research", sub: "Papers & archive", bgClass: "bg-[#EAF0F6]", href: "/archive" },
                { icon: <IconTerminal />, label: "Terminal", sub: "Investor intelligence", bgClass: "bg-[#F9F5DC]", href: "/terminal" },
                { icon: <IconBounties />, label: "Bounties", sub: "Funded challenges", bgClass: "bg-[#F2EFE9]", href: "/funding/bounties" },
                { icon: <IconBuilders />, label: "Cohorts", sub: "Get funded · 5–8% equity", bgClass: "bg-[#F2EFE9]", href: "/funding/cohorts" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block cursor-pointer rounded-[10px] border-2 border-[#1C1C27] p-[16px_18px] text-left text-inherit no-underline shadow-[3px_3px_0_#1C1C27] ${item.bgClass}`}
                >
                  <div className="mb-2.5">{item.icon}</div>
                  <div className="mb-0.75 text-[15px] font-bold">{item.label}</div>
                  <div className="text-xs text-muted">{item.sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
