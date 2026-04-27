"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta from "@/components/SEOMeta";
import { useGlobal } from "@/components/GlobalProvider";
import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useCategories } from "@/hooks/queries/useReference";
import SubmitProductButton from "@/components/SubmitProductModal";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useInfiniteProducts, useProductStats } from "@/features/products";

type DateFilter = "today" | "this_week" | "this_month" | undefined;

const TIME_TABS: { key: DateFilter; label: string; statsKey: "total" | "today" | "thisWeek" | "thisMonth" }[] = [
  { key: undefined,      label: "All",        statsKey: "total" },
  { key: "this_week",    label: "This Week",  statsKey: "thisWeek" },
  { key: "this_month",   label: "This Month", statsKey: "thisMonth" },
];

const PAGE_SIZE = 25;

export default function Page() {
  const { user, showToast, openSubmitProductModal } = useGlobal();
  const { data: categories = [] } = useCategories();
  const { data: productStats } = useProductStats();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("submit") !== null) {
      openSubmitProductModal();
      router.replace("/launch", { scroll: false });
    }
  }, [searchParams, router, openSubmitProductModal]);

  const [categoryId, setCategoryId] = useQueryState("category", parseAsInteger);
  const [dateFilter, setDateFilter] = useQueryState("date", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const {
    data,
    isLoading: productsLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteProducts("approved", {
    categoryId: categoryId ?? undefined,
    dateFilter: (dateFilter || undefined) as DateFilter,
  });

  const allProducts = useMemo(() => {
    const pages = data?.pages ?? [];
    const items = pages.flatMap((page) => page.items);
    return [...new Map(items.map((p) => [p.id, p])).values()];
  }, [data]);

  const totalCount = useMemo(() => data?.pages[0]?.total ?? 0, [data]);

  // Auto-fetch remaining pages when user requests a page we don't have loaded yet
  useEffect(() => {
    const neededProducts = page * PAGE_SIZE;
    if (hasNextPage && allProducts.length < neededProducts) {
      fetchNextPage();
    }
  }, [page, allProducts.length, hasNextPage, fetchNextPage]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [categoryId, dateFilter, setPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedProducts = allProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Redirect out-of-range page to 1
  useEffect(() => {
    if (!productsLoading && totalPages > 0 && page > totalPages) setPage(1);
  }, [productsLoading, totalPages, page, setPage]);

  return (
    <div>
      <div className="page-wrap section">
        <SEOMeta
          title="AthenaX Launch — Research-Backed Products Across Frontier Technology"
          description="Discover research-backed products across AI, robotics, biotech, crypto, and infrastructure. Every founder is ARS-scored. Every product is grounded in indexed research."
        />
        <div className="path-badge">/root/launch</div>

        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="mb-1 text-[48px]">AthenaX Launch</h1>
            <span className="status-badge mb-0">
              <div className="status-dot" />
              {productStats
                ? `${productStats.releases.thisMonth} This Month`
                : `${allProducts.length} Products Listed`}
            </span>
          </div>
          <SubmitProductButton label="+ Submit Your Product" className="self-start hidden sm:inline-flex" />
        </div>

        <p className="mb-0 text-[17px] text-muted">
          {/* Research-backed products launching across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate. Every founder is
          ARS-scored. Every product is grounded in indexed research. */}
          Early-stage products across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate.
        </p>
        <SubmitProductButton label="+ Submit Your Product" className="mt-4 w-full sm:hidden" />
        <hr className="divider" />

        <div className="mb-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            { label: "Launches This Month", value: productStats?.releases.thisMonth ?? null },
            { label: "Investor Intros Made", value: 8 },
            // { label: "Total Funding Raised", value: "$18.4M" },
            // { label: "Avg. Founder ARS", value: "7.3" },
            // { label: "Investor Intros Made", value: "142" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value text-[20px]">{s.value ?? "-"}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-2 border-b-2 border-b-[#1C1C27] pb-2.5">
          {TIME_TABS.map((tab) => (
            <Button
              key={tab.label}
              variant={(dateFilter || null) === (tab.key || null) ? "ghost" : "outline"}
              size="sm"
              className={(dateFilter || null) === (tab.key || null) ? "bg-yellow" : ""}
              onClick={() => setDateFilter(tab.key ?? null)}
            >
              {tab.label}
              {productStats != null && tab.key == null && (
                <span className="ml-1 font-['Space_Mono',monospace] text-[10px] opacity-60">
                  ({productStats.releases[tab.statsKey]})
                </span>
              )}
              {productStats != null && tab.key != null && (
                <span className="ml-1 font-['Space_Mono',monospace] text-[10px] opacity-60 hidden sm:inline">
                  ({productStats.releases[tab.statsKey]})
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {[{ id: 0, name: "All" }, ...categories].map((c) => (
            <Button
              key={c.id}
              variant={(categoryId ?? null) === (c.id || null) ? "ghost" : "outline"}
              size="sm"
              className={`shrink-0 ${(categoryId ?? null) === (c.id || null) ? "bg-yellow" : ""}`}
              onClick={() => setCategoryId(c.id === 0 ? null : c.id)}
            >
              {c.name}
            </Button>
          ))}
        </div>

        {productsLoading && (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5 animate-pulse">
                <div className="flex flex-wrap gap-5">
                  <div className="min-w-65 flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-5 w-40 rounded bg-[#E8E4DC]" />
                      <div className="h-4 w-16 rounded bg-[#E8E4DC]" />
                    </div>
                    <div className="mb-1 h-3.5 w-full rounded bg-[#E8E4DC]" />
                    <div className="mb-2.5 h-3.5 w-3/4 rounded bg-[#E8E4DC]" />
                    <div className="flex gap-2">
                      <div className="h-3 w-12 rounded bg-[#E8E4DC]" />
                      <div className="h-3 w-12 rounded bg-[#E8E4DC]" />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5 w-30">
                    <div className="h-6 w-full rounded bg-[#E8E4DC]" />
                    <div className="h-7 w-full rounded bg-[#E8E4DC]" />
                    <div className="h-7 w-full rounded bg-[#E8E4DC]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!productsLoading &&
          paginatedProducts.map((product) => (
            <div key={product.id} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5">
              <div className="flex flex-wrap gap-5">
                <div className="min-w-65 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Avatar className="size-7 rounded-lg border border-[#D8D4CC]">
                      <AvatarImage src={product.logo ?? undefined} alt={product.name} className="rounded-md" />
                      <AvatarFallback className="rounded-md bg-paper text-ink text-xs font-bold">
                        {product.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mb-0 text-[21px]">
                      <Link href={`/launch/${product.slug}`} className="cursor-pointer text-inherit no-underline" prefetch={false}>
                        {product.name}
                      </Link>
                    </h3>
                    {(product.categories ?? []).map((c) => (
                      <span key={c.id} className="topic-pill">
                        {c.name}
                      </span>
                    ))}
                    {product.qualityBadge && <span className="ftag bg-[#EAF0F6] text-[10px]">{product.qualityBadge}</span>}
                  </div>
                  <p className="mb-2.5 text-[13px] leading-[1.6] text-[#1C1C27]">{product.description}</p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="font-['Space_Mono',monospace] text-xs font-bold text-[#E8323C]">▲ {product.voteCount.toLocaleString()}</span>
                    <span className="text-xs text-muted">★ {product.bookmarkCount}</span>
                    {product.founded != null && <span className="text-xs text-muted">Founded {product.founded}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col justify-start gap-1.5 w-full sm:min-w-30 sm:w-auto">
                  {(product.stage != null || product.funding != null) && (
                    <span className="ftag bg-[#EAF0F6] text-center text-[11px]">
                      {[product.stage, product.funding != null ? `$${product.funding.toLocaleString()}` : null].filter(Boolean).join(" · ")}
                    </span>
                  )}
                  <div className="flex gap-1.5 sm:flex-col">
                    <Link href={`/launch/${product.slug}`} className={cn(buttonVariants({ size: "sm" }), "flex-1 no-underline")} prefetch={false}>
                      View →
                    </Link>
                    <BookmarkButton user={user} launch={product} showToast={showToast} size="sm" useApi initialBookmarked={product.bookmarked} />
                  </div>
                </div>
              </div>
            </div>
          ))}

        {totalPages > 1 && (
          <div className="mt-8 mb-7 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              ← Prev
            </Button>
            <span className="font-['Space_Mono',monospace] text-xs text-muted">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
            >
              Next →
            </Button>
          </div>
        )}

        <WindowCard label="LAUNCH_TIERS.SYS" className="mt-20">
          <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">LAUNCH PROMOTION TIERS</div>
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            {[
              {
                tier: "Standard",
                price: "Free",
                highlight: true,
                perks: ["Public listing", "ARS badge", "Archive indexing", "Research lineage display"],
              },
              {
                tier: "Verified",
                price: "$2,000",
                highlight: false,
                perks: ["Everything in Standard", "Featured 48 hours", "Researcher network blast", "Slug: /launch/your-product"],
              },
              {
                tier: "Premier",
                price: "$7,500",
                highlight: false,
                perks: ["Everything in Verified", "Investor intro email blast", "Terminal featured slot", "Cohort alumni spotlight"],
              },
              {
                tier: "Homepage",
                price: "$15,000",
                highlight: false,
                perks: ["Everything in Premier", "Homepage placement 7 days", "Newsletter promotion", "Weekly Digest feature"],
              },
            ].map((t) => (
              <div
                key={t.tier}
                className="rounded-[10px] border-2 border-[#1C1C27] p-4"
                style={{
                  background: t.highlight ? "#F9F5DC" : "#fff",
                  boxShadow: t.highlight ? "3px 3px 0 #1C1C27" : "none",
                }}
              >
                <div className="mb-1 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">{t.tier.toUpperCase()}</div>
                <div className="mb-3" style={{ fontSize: 22, fontWeight: 700, color: t.highlight ? "#E8323C" : "#1C1C27" }}>
                  {t.price}
                </div>
                {t.perks.map((p) => (
                  <div key={p} className="mb-1.25 flex items-start gap-1.5 text-xs">
                    <span className="shrink-0 font-bold text-[#4CAF50]">✓</span>
                    {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex justify-center md:justify-end">
            <SubmitProductButton label="Submit Your Launch →" />
          </div>
        </WindowCard>
      </div>
    </div>
  );
}