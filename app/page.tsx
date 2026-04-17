"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEED_LAUNCHES, SEED_PAPERS } from "@/data/seed";
import { useGlobal } from "@/components/GlobalProvider";
import { useCategories } from "@/hooks/queries/useReference";
import { useProducts, useProductStats, getProductStatsLabel } from "@/features/products";
import { IconBounties, IconBuilders, IconLabs, IconPaperSmall, IconTerminal } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import WindowCard from "@/components/ui/WindowCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const { data: apiProducts = [] } = useProducts("approved");
  const { data: productStats } = useProductStats();
  const statsLabel = getProductStatsLabel(productStats);

  const latestProducts = [...apiProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  const todayLaunches = SEED_LAUNCHES.filter((launch) => launch.launchedToday);
  const showLaunches = latestProducts.length > 0 ? latestProducts : todayLaunches.length > 0 ? todayLaunches : SEED_LAUNCHES.slice(0, 5);
  const selectedCategoryNames =
    user?.categories?.map((entry: { categoryId: number }) => categories.find((category) => category.id === entry.categoryId)?.name).filter(Boolean) ??
    [];
  const feedSignals = getFeedSignals(user, selectedCategoryNames);

  const isMobile = useIsMobile();

  return (
    <div>
      <div className="page-wrap section">
        <>
          <div className="mb-13 max-w-160">
            <div className="status-badge mb-5">
              <div className="status-dot" />
              <span>{statsLabel || `${SEED_LAUNCHES.length} live launches`}</span>
            </div>
            <h1 className="mb-5.5 text-[clamp(42px,6vw,70px)] leading-none">
              Where New
              <br />
              Products <span className="text-danger">Begin.</span>
            </h1>
            <p className="mb-8 max-w-125 text-[17px] leading-[1.65] text-[#1C1C27]">
              {/* Discover research-backed products across frontier technology. Every founder is ARS-scored. Every product is grounded in real research. */}
              Discover early-stage products across frontier technology.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/launch" className={cn(buttonVariants({ size: "lg" }), "no-underline")}>
                Explore Launches →
              </Link>
              <Button
                variant="outline"
                size="lg"
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
              </Button>
            </div>
          </div>

          <div className="mb-13">
            <WindowCard label="NETWORK_ACTIVITY.SYS">
              <div className="grid grid-cols-2 sm:grid-cols-3">
                {[
                  { value: `${productStats?.releases.total}`, label: "products live" },
                  { value: `Active`, label: "Community" },
                  { value: `Open`, label: "Submissions" },
                  // { value: `$${totalRaised.toFixed(1)}M`, label: "raised by AthenaX startups" },
                  // { value: averageFounderArs, label: "average founder ARS" },
                  // { value: `${SEED_LAUNCHES.reduce((sum, launch) => sum + launch.investorRegs, 0)}`, label: "investor introductions" },
                ].map((metric, index) => (
                  <div
                    key={metric.label}
                    className={`px-5 py-4 sm:px-6 sm:py-5 ${index % 3 === 0 ? "border-r-[1.5px] border-r-[#D8D4CC]" : ""} ${index < 2 ? "border-b-[1.5px] border-b-[#D8D4CC] sm:border-b-0" : ""} sm:not-last:border-r-[1.5px] sm:border-r-[#D8D4CC]`}
                  >
                    <div className="mb-1.5 font-['Space_Mono',monospace] text-[22px] sm:text-[26px] font-bold leading-none text-danger">{metric.value}</div>
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
              <h2 className="text-[28px]">Latest Launches</h2>
              <Link href="/launch" className="link-arrow no-underline">
                See All →
              </Link>
            </div>
            <hr className="divider" />
            {showLaunches.map((launch: any) => {
              const isReal = "slug" in launch;
              const href = isReal ? `/launch/${launch.slug}` : `/launch/${launch.id}`;
              const sector = isReal ? (launch.categories?.[0]?.name ?? launch.stage) : launch.sector;
              const desc = isReal ? launch.description : launch.desc;
              const votes = isReal ? launch.voteCount : launch.votes;
              const isToday = !isReal && launch.launchedToday;
              return (
                <Link key={launch.id} href={href} className="archive-row cursor-pointer text-inherit no-underline" prefetch={false}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#1C1C27] bg-paper text-base font-bold">
                    {launch.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex flex-wrap items-center gap-2">
                      <div className="archive-title">{launch.name}</div>
                      {isToday && <span className="ftag bg-success text-[10px] font-bold">Today</span>}
                      {sector && <span className="topic-pill px-2 py-0.5 text-[10px]">{sector}</span>}
                    </div>
                    {!isReal && (
                      <div className="archive-meta">
                        {launch.founders.map((founder: any) => founder.name.split(" ").pop()).join(", ")}
                        &nbsp;·&nbsp;ARS {launch.founders.map((founder: any) => founder.ars).join(" / ")}
                      </div>
                    )}
                    <div className="mt-0.75 text-xs leading-normal text-muted">{desc.slice(0, 110)}…</div>
                  </div>
                  <div className="min-w-16 shrink-0 text-right">
                    <div className="font-['Space_Mono',monospace] text-[15px] font-bold text-danger">▲ {votes.toLocaleString()}</div>
                    <div className="mt-0.75 text-[11px] text-muted">
                      {isReal ? `★ ${launch.bookmarkCount}` : `💬 ${launch.comments.length}`}
                    </div>
                  </div>
                </Link>
              );
            })}
            <div className="mt-4.5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                href="/launch"
                className={cn(buttonVariants({ size: isMobile ? "sm" : "default" }), "no-underline")}
              >
                View All Launches →
              </Link>
              <Link
                href="/archive"
                className={cn(buttonVariants({ variant: "outline", size: isMobile ? "sm" : "default" }), "no-underline")}
              >
                Research Archive
              </Link>
            </div>
          </div>

          <div className="border-t-2 border-t-[#D8D4CC] pt-10">
            <div className="mb-4.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">EXPLORE ATHENAX</div>
            <div className="grid-4">
              {[
                { icon: <IconLabs />, label: "Research", sub: "Papers & archive", bgClass: "bg-[#EAF0F6]", href: "/archive", comingSoon: false },
                { icon: <IconTerminal />, label: "Terminal", sub: "Coming soon", bgClass: "bg-[#F9F5DC]", href: "/roadmap", comingSoon: true },
                { icon: <IconBounties />, label: "Bounties", sub: "Coming soon", bgClass: "bg-[#F2EFE9]", href: "/roadmap", comingSoon: true },
                { icon: <IconBuilders />, label: "Cohorts", sub: "Coming soon", bgClass: "bg-[#F2EFE9]", href: "/roadmap", comingSoon: true },
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
