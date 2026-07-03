"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IconBounties, IconBuilders, IconLabs, IconTerminal } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import WindowCard from "@/components/ui/WindowCard";
import { ProductBadge } from "@/components/ui/ProductBadge";
import BookmarkButton from "@/components/BookmarkButton";
import { useGlobal } from "@/components/GlobalProvider";
import { cn } from "@/lib/utils";
import { getProductStatsLabel, useProducts, useProductStats, approvedSubcategories } from "@/features/products";

export default function Page() {
  const { user, showToast, openSubmitProductModal } = useGlobal();
  const { data: productsData } = useProducts("approved");
  const apiProducts = productsData?.items ?? [];
  const { data: productStats } = useProductStats();
  const statsLabel = getProductStatsLabel(productStats);
  const liveProductsValue = productStats?.releases.total != null ? String(productStats.releases.total) : "";

  const latestProducts = [...apiProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  return (
    <div>
      <div className="page-wrap section">
        <>
          <div className="mb-13 max-w-160">
            <div className="status-badge mb-5">
              <div className="status-dot" />
              <span>{statsLabel || "Live launches"}</span>
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
              <Button variant="outline" size="lg" onClick={() => openSubmitProductModal()}>
                Submit Your Product
              </Button>
            </div>
          </div>

          <div className="mb-13">
            <WindowCard label="NETWORK_ACTIVITY.SYS">
              <div className="grid grid-cols-2 sm:grid-cols-3">
                {[
                  { value: liveProductsValue, label: "products live" },
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
                    <div className="mb-1.5 font-['Space_Mono',monospace] text-[22px] sm:text-[26px] font-bold leading-none text-danger">
                      {metric.value}
                    </div>
                    <div className="font-['Space_Mono',monospace] text-xs tracking-[0.03em] text-muted">{metric.label}</div>
                  </div>
                ))}
              </div>
            </WindowCard>
          </div>

          {latestProducts.length > 0 && (
            <div className="my-20">
              <div className="mb-5 flex items-baseline justify-between">
                <h2>
                  <Link href="/launch" className="link-arrow no-underline text-[28px] font-bold">
                    Latest Launches
                  </Link>
                </h2>
                <Link href="/launch" className="link-arrow no-underline">
                  See All →
                </Link>
              </div>
              {latestProducts.map((launch: any) => {
                const description =
                  typeof launch.shortDesc === "string" ? launch.shortDesc : typeof launch.description === "string" ? launch.description : "";

                return (
                  <Link key={launch.id} href={`/launch/${launch.slug}`} className="archive-row no-underline" prefetch={false}>
                    <Avatar className="size-10 shrink-0 rounded-lg overflow-visible">
                      <AvatarImage src={launch.logo ?? undefined} alt={launch.name} className="size-full object-contain" />
                      <AvatarFallback className="rounded-lg border border-[#D8D4CC] bg-paper text-base font-bold">
                        {launch.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="mb-0.5 flex flex-wrap items-center gap-2">
                        <span className="archive-title">
                          {launch.name}
                        </span>
                        {(launch.categories ?? []).map((c: any) => (
                          <ProductBadge key={c.id} label={c.name} />
                        ))}
                        {approvedSubcategories(launch.categories ?? []).map((sub) => (
                          <ProductBadge key={sub.id} label={sub.name} type="subcategory" />
                        ))}
                        {launch.qualityBadge && <ProductBadge label={launch.qualityBadge} type="stage" />}
                        {(launch.stage != null || launch.funding != null) && (
                          <ProductBadge
                            label={[launch.stage, launch.funding != null ? `$${launch.funding.toLocaleString()}` : null].filter(Boolean).join(" · ")}
                            type="stage"
                          />
                        )}
                      </div>
                      <div className="mt-0.75 text-xs leading-normal text-muted">
                        {description || "No description yet."}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="border-t-2 border-t-[#D8D4CC] pt-10">
            <div className="mb-4.5 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">EXPLORE ATHENAX</div>
            <div className="grid-4">
              {[
                { icon: <IconLabs />, label: "Research", sub: "Papers & archive", bgClass: "bg-[#EAF0F6]", href: "/archive", comingSoon: false },
                { icon: <IconTerminal />, label: "Terminal", sub: "Coming soon", bgClass: "bg-[#F9F5DC]", href: "/roadmap", comingSoon: true },
                { icon: <IconBounties />, label: "Bounties", sub: "Coming soon", bgClass: "bg-[#F2EFE9]", href: "/roadmap", comingSoon: true },
                { icon: <IconBuilders />, label: "Cohorts", sub: "Coming soon", bgClass: "bg-[#F2EFE9]", href: "/roadmap", comingSoon: true },
              ].map((item) =>
                item.comingSoon ? (
                  <div
                    key={item.label}
                    aria-disabled="true"
                    className={`block rounded-xl border-2 border-[#1C1C27] p-[18px_22px] text-left text-inherit no-underline cursor-default opacity-60 ${item.bgClass}`}
                  >
                    <div className="mb-2.5">{item.icon}</div>
                    <div className="mb-0.75 text-[15px] font-bold">{item.label}</div>
                    <div className="text-xs text-muted">{item.sub}</div>
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`explore-card block cursor-pointer rounded-xl border-2 border-[#1C1C27] p-[18px_22px] text-left text-inherit no-underline ${item.bgClass}`}
                  >
                    <div className="mb-2.5">{item.icon}</div>
                    <div className="mb-0.75 text-[15px] font-bold">{item.label}</div>
                    <div className="text-xs text-muted">{item.sub}</div>
                  </Link>
                )
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
