"use client";

import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta from "@/components/SEOMeta";
import { useGlobal } from "@/components/GlobalProvider";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { Search } from "lucide-react";
import { useCategories } from "@/hooks/queries/useReference";
import SubmitProductButton from "@/components/SubmitProductModal";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePagedProducts, useProductStats } from "@/features/products";
import { ProductBadge } from "@/components/ui/ProductBadge";

type DateFilter = "today" | "this_week" | "this_month" | undefined;

const TIME_TABS: { key: DateFilter; label: string; statsKey: "total" | "today" | "thisWeek" | "thisMonth" }[] = [
  { key: undefined, label: "All", statsKey: "total" },
  { key: "this_week", label: "This Week", statsKey: "thisWeek" },
  { key: "this_month", label: "This Month", statsKey: "thisMonth" },
];

const PAGE_SIZE = 21;

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
  const [search, setSearch] = useQueryState("q", parseAsString);
  const [upvotedFilter, setUpvotedFilter] = useQueryState("upvoted", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchInput, setSearchInput] = useState(search ?? "");
  const debouncedSearch = useDebounce(searchInput);
  const searchRef = useRef<HTMLInputElement>(null);

  // Track whether a filter change (not a page change) triggered a page reset
  const filterResetRef = useRef(false);

  const { data, isLoading: productsLoading } = usePagedProducts("approved", {
    categoryId: categoryId ?? undefined,
    dateFilter: (dateFilter || undefined) as DateFilter,
    search: search ?? undefined,
    upvoted: upvotedFilter === "true" ? true : undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const pagedProducts = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Reset to page 1 when filters change, scroll stays
  const prevCategoryRef = useRef(categoryId);
  const prevDateRef = useRef(dateFilter);
  const prevSearchRef = useRef(search);
  const prevUpvotedRef = useRef(upvotedFilter);
  useEffect(() => {
    if (
      prevCategoryRef.current !== categoryId ||
      prevDateRef.current !== dateFilter ||
      prevSearchRef.current !== search ||
      prevUpvotedRef.current !== upvotedFilter
    ) {
      prevCategoryRef.current = categoryId;
      prevDateRef.current = dateFilter;
      prevSearchRef.current = search;
      prevUpvotedRef.current = upvotedFilter;
      filterResetRef.current = true;
      setPage(1);
    }
  }, [categoryId, dateFilter, search, upvotedFilter, setPage]);

  // Sync debounced value → URL param
  useEffect(() => {
    setSearch(debouncedSearch.trim() || null);
  }, [debouncedSearch, setSearch]);

  // / key focuses the search input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll to top on page change (but not on filter-triggered resets)
  const prevPageRef = useRef(page);
  useEffect(() => {
    if (prevPageRef.current !== page) {
      prevPageRef.current = page;
      if (!filterResetRef.current) {
        const section = document.getElementById("launch-tabs-section");
        if (section) {
          const top = section.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
      filterResetRef.current = false;
    }
  }, [page]);

  // Redirect out-of-range page to 1
  useEffect(() => {
    if (!productsLoading && totalPages > 0 && page > totalPages) setPage(1);
  }, [productsLoading, totalPages, page, setPage]);

  const isNouns = (name: string) => name.toLowerCase() === "nouns";

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
              {productStats ? `${productStats.releases.thisMonth} This Month` : `${totalCount} Products Listed`}
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

        <WindowCard label="LAUNCH_STATS.SYS" className="mb-10" bodyClass="bg-white overflow-hidden">
          <div className="grid sm:grid-cols-3">
            {[
              { label: "Launches This Month", value: productStats?.releases.thisMonth ?? null },
              { label: "Categories", value: categories.length || null },
              { label: "Investor Intros Made", value: 8 },
            ].map((s, index, array) => (
              <div
                key={s.label}
                className={cn(
                  "px-5 py-4 sm:px-6 sm:py-5",
                  index < array.length - 1 && "border-b border-b-[#D8D4CC] sm:border-b-0 sm:border-r sm:border-r-[#D8D4CC]"
                )}
              >
                <div className="mb-1.5 font-['Space_Mono',monospace] text-[22px] sm:text-[26px] font-bold leading-none text-danger">
                  {s.value ?? "-"}
                </div>
                <div className="font-['Space_Mono',monospace] text-xs tracking-[0.03em] text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </WindowCard>

        <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-b-[#1C1C27] pb-2.5 flex-wrap" id="launch-tabs-section">
          <div className="flex items-center gap-2 flex-wrap">
            {TIME_TABS.map((tab) => (
              <Button
                key={tab.label}
                variant={(dateFilter || null) === (tab.key || null) ? "ghost" : "outline"}
                size="sm"
                className={(dateFilter || null) === (tab.key || null) ? "bg-yellow" : ""}
                onClick={() => {
                  setDateFilter(tab.key ?? null);
                  setUpvotedFilter(null);
                }}
              >
                {tab.label}
                {productStats != null && tab.key == null && (
                  <span className="ml-1 font-['Space_Mono',monospace] text-[10px] opacity-60">({productStats.releases[tab.statsKey]})</span>
                )}
                {productStats != null && tab.key != null && (
                  <span className="ml-1 font-['Space_Mono',monospace] text-[10px] opacity-60 hidden sm:inline">
                    ({productStats.releases[tab.statsKey]})
                  </span>
                )}
              </Button>
            ))}
            {user && (
              <>
                <div className="h-5 w-[1px] bg-[#1C1C27] opacity-20" />
                <Button
                  variant={upvotedFilter === "true" ? "ghost" : "outline"}
                  size="sm"
                  className={upvotedFilter === "true" ? "bg-[#D4EDDA]" : ""}
                  onClick={() => {
                    setUpvotedFilter(upvotedFilter === "true" ? null : "true");
                    setDateFilter(null);
                  }}
                >
                  ▲ Upvoted
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-2 rounded-lg border-2 border-[#1C1C27] bg-white px-3.5 py-1.5 shadow-[2px_2px_0_#1C1C27]"
              style={{ width: 280 }}
            >
              <Search size={13} className="shrink-0 text-[#888]" />
              <input
                ref={searchRef}
                className="flex-1 bg-transparent text-[13px] placeholder:text-[#aaa] focus:outline-none"
                placeholder="Search projects..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && searchRef.current?.blur()}
              />
              <kbd className="shrink-0 rounded border border-[#D8D4CC] bg-[#F5F2EC] px-1.5 py-0.5 font-['Space_Mono',monospace] text-[10px] text-[#888]">
                /
              </kbd>
            </div>
          </div>
        </div>

        <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {[{ id: 0, name: "All" }, ...[...categories].sort((a, b) => (isNouns(a.name) ? 1 : isNouns(b.name) ? -1 : 0))].map((c) => (
            <Button
              key={c.id}
              variant={(categoryId ?? null) === (c.id || null) ? "ghost" : "outline"}
              size="xs"
              className={`shrink-0 ${(categoryId ?? null) === (c.id || null) ? "bg-yellow" : ""}`}
              onClick={() => setCategoryId(c.id === 0 ? null : c.id)}
            >
              {isNouns(c.name) ? (
                <Image src="https://athenax.mypinx.store/Noggles.png" alt="Nouns" width={28} height={16} className="object-contain" />
              ) : (
                c.name
              )}
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

        {!productsLoading && pagedProducts.length === 0 && (
          <div className="py-16 text-center font-['Space_Mono',monospace] text-[12px] text-muted">
            No products found{search ? ` for "${search}"` : ""}.
          </div>
        )}

        {!productsLoading &&
          pagedProducts.map((product) => (
            <div key={product.id} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5">
              <div className="flex flex-wrap gap-5">
                <div className="min-w-65 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {(user?.role as string) === "admin" ? (
                      <Link href={`/launch/${product.slug}`} className="group flex items-center gap-2 no-underline" prefetch={false}>
                        <Avatar className="size-7 rounded-md overflow-visible">
                          <AvatarImage src={product.logo ?? undefined} alt={product.name} className="size-full object-contain" />
                          <AvatarFallback className="rounded-md border border-[#D8D4CC] bg-paper text-xs font-bold">
                            {product.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-xl text-ink group-hover:text-danger">{product.name}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7 rounded-md overflow-visible">
                          <AvatarImage src={product.logo ?? undefined} alt={product.name} className="size-full object-contain" />
                          <AvatarFallback className="rounded-md border border-[#D8D4CC] bg-paper text-xs font-bold">
                            {product.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-xl text-ink">{product.name}</span>
                      </div>
                    )}
                    {(product.categories ?? []).map((c) => (
                      <ProductBadge key={c.id} label={c.name} />
                    ))}
                    {(product.subCategories ?? []).map((name) => (
                      <ProductBadge key={name} label={name} type="subcategory" />
                    ))}
                    {product.qualityBadge && <ProductBadge label={product.qualityBadge} type="stage" />}
                    {(product.stage != null || (product.funding != null && product.funding > 0)) && (
                      <ProductBadge
                        label={[product.stage, product.funding != null && product.funding > 0 ? `$${product.funding.toLocaleString()}` : null].filter(Boolean).join(" · ")}
                        type="stage"
                      />
                    )}
                  </div>
                  <p className="mb-2.5 text-[13px] leading-[1.6] text-[#1C1C27]">{product.shortDesc ?? product.description}</p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-4">
                    {product.founded != null && <span className="text-xs text-muted">Founded {product.founded}</span>}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col justify-start gap-1.5 w-full sm:min-w-30 sm:w-auto">
                  <div className="flex gap-1.5 sm:flex-col">
                    {(user?.role as string) === "admin" && (
                      <Link href={`/launch/${product.slug}`} className={cn(buttonVariants({ size: "sm" }), "flex-1 no-underline")} prefetch={false}>
                        View →
                      </Link>
                    )}
                    <BookmarkButton user={user} launch={product} showToast={showToast} size="sm" useApi initialBookmarked={product.bookmarked} />
                  </div>
                </div>
              </div>
            </div>
          ))}

        {totalPages >= 1 && (
          <div className="mt-8 mb-7 flex items-center justify-center gap-1.5 flex-wrap">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(Math.max(1, page - 1))}>
              ← Prev
            </Button>
            {(() => {
              const items: (number | "ellipsis")[] = [];
              const delta = 1; // neighbours on each side of current page
              const rangeStart = Math.max(2, page - delta);
              const rangeEnd = Math.min(totalPages - 1, page + delta);

              items.push(1);
              if (rangeStart > 2) items.push("ellipsis");
              for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
              if (rangeEnd < totalPages - 1) items.push("ellipsis");
              if (totalPages > 1) items.push(totalPages);

              return items.map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${idx}`} className="font-['Space_Mono',monospace] text-xs text-muted px-1 select-none">
                    ···
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === page ? "ghost" : "outline"}
                    size="sm"
                    className={cn("min-w-8", item === page ? "bg-yellow font-bold" : "")}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </Button>
                )
              );
            })()}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>
              Next →
            </Button>
          </div>
        )}

        <WindowCard label="LAUNCH_TIERS.SYS" className="mt-20 hidden">
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
