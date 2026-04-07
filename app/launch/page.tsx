"use client";

import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import BookmarkButton from "@/components/BookmarkButton";
import SEOMeta from "@/components/SEOMeta";
import { useGlobal } from "@/components/GlobalProvider";
import { useState } from "react";
import { useCategories } from "@/hooks/queries/useReference";
import { useProducts } from "@/hooks/queries/useProduct";
import SubmitProductButton from "@/components/SubmitProductModal";

export default function Page() {
  const { user, showToast } = useGlobal();
  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading: productsLoading } = useProducts("approved");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [timeTab, setTimeTab] = useState("all");

  const TIME_TABS = [
    ["all", "All"],
    ["week", "This Week"],
    ["month", "This Month"],
  ];

  const filtered = (filter === "All" ? products : products.filter((p) => p.categories.some((c) => c.name === filter))).sort((a, b) => {
    if (sortBy === "votes") return b.voteCount - a.voteCount;
    if (sortBy === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.voteCount - a.voteCount;
  });

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
              {products.length} Products Listed
            </span>
          </div>
          <SubmitProductButton label="+ Submit Your Product" className="btn btn-primary self-start hidden sm:inline-flex" />
        </div>

        <p className="mb-0 text-[17px] text-muted">
          Research-backed products launching across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate. Every founder is
          ARS-scored. Every product is grounded in indexed research.
        </p>
        <SubmitProductButton label="+ Submit Your Product" className="btn btn-primary w-full justify-center mt-4 sm:hidden" />
        <hr className="divider" />

        <div className="mb-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            { label: "Launches This Month", value: products.length },
            { label: "Total Funding Raised", value: "$18.4M" },
            { label: "Avg. Founder ARS", value: "7.3" },
            { label: "Investor Intros Made", value: "142" },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value text-[20px]">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-2 border-b-2 border-b-[#1C1C27] pb-2.5">
          {TIME_TABS.map(([k, l]) => (
            <button
              key={k}
              className={timeTab === k ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={timeTab === k ? { background: "#F5D94E" } : {}}
              onClick={() => setTimeTab(k)}
            >
              {l} {k === "all" ? `(${products.length})` : ""}
            </button>
          ))}
          <span className="ml-auto self-center font-['Space_Mono',monospace] text-xs text-muted">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          {[{ id: 0, name: "All" }, ...categories].map((c) => (
            <button
              key={c.id}
              className={`shrink-0 ${filter === c.name ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}`}
              style={filter === c.name ? { background: "#F5D94E" } : {}}
              onClick={() => setFilter(c.name)}
            >
              {c.name}
            </button>
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
          filtered.map((product) => (
            <div key={product.id} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5">
              <div className="flex flex-wrap gap-5">
                <div className="min-w-65 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="mb-0 text-[21px]">
                      <Link href={`/launch/${product.slug}`} className="cursor-pointer text-inherit no-underline">
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
                    <span className="text-xs text-muted">Founded {product.founded}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col justify-start gap-1.5 w-full sm:min-w-30 sm:w-auto">
                  <span className="ftag bg-[#EAF0F6] text-center text-[11px]">
                    {product.stage} · ${product.funding.toLocaleString()}
                  </span>
                  <div className="flex gap-1.5 sm:flex-col">
                    <Link href={`/launch/${product.slug}`} className="btn btn-primary btn-sm flex-1 justify-center no-underline">
                      View →
                    </Link>
                    <BookmarkButton user={user} launch={product} showToast={showToast} size="sm" useApi initialBookmarked={product.bookmarked} />
                  </div>
                </div>
              </div>
            </div>
          ))}

        <WindowCard label="LAUNCH_TIERS.SYS" className="mt-7">
          <div className="mb-4 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">LAUNCH PROMOTION TIERS</div>
          <div className="mb-5 grid grid-cols-1 sm:grid-cols-4 gap-3.5">
            {[
              {
                tier: "Standard",
                price: "Free",
                highlight: false,
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
                highlight: true,
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
            <SubmitProductButton label="Submit Your Launch →" className="btn btn-primary" />
          </div>
        </WindowCard>
      </div>
    </div>
  );
}
