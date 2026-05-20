"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useMyVotedProducts } from "@/features/products";
import { cn } from "@/lib/utils";

export default function Page() {
  const { user } = useGlobal();
  const { data: votedProducts, isLoading } = useMyVotedProducts();

  if (!user) {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/dashboard/voted</div>
        <p className="text-[15px] text-muted">Sign in to view your upvoted products.</p>
      </div>
    );
  }

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/dashboard/voted</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="mb-0 text-5xl">Upvoted</h1>
        <Link href="/dashboard" className="font-['Space_Mono',monospace] text-[12px] text-[#888] hover:text-ink">
          ← Dashboard
        </Link>
      </div>
      <p className="mb-0 text-[17px] text-muted">Products you&apos;ve upvoted.</p>
      <hr className="divider" />

      {isLoading && (
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="mb-1 border-b-2 border-b-[#D8D4CC] py-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-md bg-[#E8E4DC]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-40 rounded bg-[#E8E4DC]" />
                  <div className="h-3 w-24 rounded bg-[#E8E4DC]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!votedProducts || votedProducts.items.length === 0) && (
        <div className="py-16 text-center">
          <p className="mb-4 font-['Space_Mono',monospace] text-[12px] text-muted">No upvoted products yet.</p>
          <Link href="/launch" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}>
            Browse Launches →
          </Link>
        </div>
      )}

      {!isLoading &&
        votedProducts &&
        votedProducts.items.map((product) => (
          <div key={product.id} className="mb-1 border-b-2 border-b-[#D8D4CC] py-4">
            <Link href={`/launch/${product.slug}`} className="group flex items-center gap-3 no-underline">
              <Avatar className="size-9 shrink-0 rounded-md">
                <AvatarFallback className="rounded-md border border-[#D8D4CC] bg-paper text-[13px] font-bold">
                  {product.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-ink group-hover:text-danger">{product.name}</div>
                <div className="font-['Space_Mono',monospace] text-[11px] text-muted">
                  {product.stage} · ▲ {product.voteCount.toLocaleString()}
                </div>
              </div>
              <span className="shrink-0 font-['Space_Mono',monospace] text-[11px] text-[#888]">View →</span>
            </Link>
          </div>
        ))}
    </div>
  );
}
