"use client";

import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import { IconArrowUpRight, IconFileTextSmall, IconPackageSmall, IconPaperSmall } from "@/components/Icons";
import { useMyProducts } from "@/hooks/queries/useProduct";
import { useMyPapers } from "@/hooks/queries/usePaper";
import type { SessionUser } from "@/types/auth";
import type { PaperOut } from "@/types/paper";
import SubmitProductButton from "@/components/SubmitProductModal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PaperStatus } from "@/enums";

function ProductsList() {
  const { data: products = [], isLoading } = useMyProducts();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-[#E8E4DC]" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        <p className="mb-3.5 text-sm text-muted">No products submitted yet.</p>
        <SubmitProductButton label="Submit a Product →" />
      </div>
    );
  }

  return (
    <div>
      {products.map((p) => (
        <Link key={p.id} href={`/launch/${p.slug}`} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
          <div className="archive-icon bg-paper flex items-center justify-center">
            <IconPackageSmall />
          </div>
          <div className="flex-1">
            <div className="archive-title text-sm">{p.name}</div>
            <div className="archive-meta">
              {p.stage ?? "—"} · {p.funding != null ? `$${p.funding.toLocaleString()}` : "—"} · ▲ {p.voteCount}
            </div>
          </div>
          <span className={`ftag text-[10px] ${p.status === "approved" ? "bg-success" : p.status === "pending" ? "bg-amber-100" : "bg-[#EAF0F6]"}`}>
            {p.status}
          </span>
        </Link>
      ))}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link href="/launch" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "no-underline")}>
          View All on Launch <IconArrowUpRight />
        </Link>
        <SubmitProductButton />
      </div>
    </div>
  );
}

function PapersList() {
  const { data: papers = [], isLoading } = useMyPapers();

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-[#E8E4DC]" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {papers.length === 0 && <p className="mb-3.5 text-sm text-muted">No papers submitted yet.</p>}
      {papers.map((p) => {
        const status = getPaperDisplayStatus(p);
        const href = status === PaperStatus.DRAFT ? `/paper/submit?draftId=${p.id}` : `/paper/${p.slug}`;

        return (
          <Link key={p.id} href={href} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
            <div className="archive-icon bg-paper flex items-center justify-center">
              <IconPaperSmall />
            </div>
            <div className="flex-1">
              <div className="archive-title text-sm">{(p.title?.length ?? 0) > 55 ? p.title!.slice(0, 55) + "…" : (p.title ?? "Untitled")}</div>
              <div className="archive-meta">
                {new Date(p.createdAt).toLocaleDateString()} · {p.categories.map((c) => c.name).join(", ") || "Uncategorized"}
              </div>
            </div>
            <span className={`ftag text-[10px] ${paperStatusClass(status)}`}>{status}</span>
          </Link>
        );
      })}
      <div className="mt-3">
        <Link href="/paper/submit" className={cn(buttonVariants({ size: "sm" }), "w-fit no-underline")}>
          {papers.length === 0 ? "Submit a Paper" : "Submit Another Paper"} <IconArrowUpRight />
        </Link>
      </div>
    </div>
  );
}

function getPaperDisplayStatus(paper: PaperOut) {
  return paper.status === PaperStatus.DRAFT ? PaperStatus.DRAFT : paper.verificationStatus;
}

function paperStatusClass(status: string) {
  if (status === "draft") return "bg-[#EAF0F6] text-ink";
  if (status === "approved") return "bg-success";
  if (status === "rejected") return "bg-red-100 text-[#E8323C]";
  return "bg-amber-100 text-ink";
}

export default function ProfileSubmissions({ user }: { user: SessionUser }) {
  const isFounder = user.role === "founder";
  const isResearcher = user.role === "researcher";
  const isAdmin = (user.role as string) === "admin";

  if (!isFounder && !isResearcher && !isAdmin) return null;

  return (
    <>
      {(isFounder || isAdmin) && (
        <WindowCard label="MY_PRODUCTS.SYS" className="mb-5">
          <div className="mb-3 flex items-center gap-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
            <IconPackageSmall size={11} />
            SUBMITTED PRODUCTS
          </div>
          <ProductsList />
        </WindowCard>
      )}

      {(isResearcher || isAdmin) && (
        <WindowCard label="MY_PAPERS.SYS" className="mb-5">
          <div className="mb-3 flex items-center gap-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
            <IconFileTextSmall />
            SUBMITTED PAPERS
          </div>
          <PapersList />
        </WindowCard>
      )}
    </>
  );
}
