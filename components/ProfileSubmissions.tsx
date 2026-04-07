"use client";

import Link from "next/link";
import { Package, FileText, ArrowUpRight } from "lucide-react";
import WindowCard from "@/components/ui/WindowCard";
import { IconPaperSmall } from "@/components/Icons";
import { useMyProducts } from "@/hooks/queries/useProduct";
import { authSvc } from "@/lib/db-helper";
import type { SessionUser } from "@/types/auth";
import SubmitProductButton from "@/components/SubmitProductModal";

function ProductsList({ userId }: { userId: number }) {
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
            <Package size={14} className="text-muted" />
          </div>
          <div className="flex-1">
            <div className="archive-title text-sm">{p.name}</div>
            <div className="archive-meta">
              {p.stage} · ${p.funding.toLocaleString()} · ▲ {p.voteCount}
            </div>
          </div>
          <span className={`ftag text-[10px] ${p.status === "approved" ? "bg-success" : p.status === "pending" ? "bg-amber-100" : "bg-[#EAF0F6]"}`}>
            {p.status}
          </span>
        </Link>
      ))}
      <div className="mt-3 flex items-center gap-2">
        <Link href="/launch" className="btn btn-ghost btn-sm flex items-center gap-1.5">
          View All on Launch <ArrowUpRight size={12} />
        </Link>
        <SubmitProductButton />
      </div>
    </div>
  );
}

function PapersList({ userId }: { userId: number }) {
  const papers = authSvc.getPapersByUser(String(userId));

  if (papers.length === 0) {
    return (
      <div>
        <p className="mb-3.5 text-sm text-muted">No papers submitted yet.</p>
        <Link href="/paper/submit" className="btn btn-primary btn-sm">
          Submit a Paper →
        </Link>
      </div>
    );
  }

  return (
    <div>
      {papers.map((p) => (
        <Link key={p.id} href={`/paper/${p.id}`} className="archive-row mb-2 cursor-pointer text-inherit no-underline">
          <div className="archive-icon bg-paper">
            <IconPaperSmall />
          </div>
          <div className="flex-1">
            <div className="archive-title text-sm">{p.title.length > 55 ? p.title.slice(0, 55) + "…" : p.title}</div>
            <div className="archive-meta">
              {p.year} · {p.topic} · {p.citations} cites
            </div>
          </div>
          <span className="ftag text-[10px] bg-success">{p.status}</span>
        </Link>
      ))}
    </div>
  );
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
            <Package size={11} />
            SUBMITTED PRODUCTS
          </div>
          <ProductsList userId={user.id} />
        </WindowCard>
      )}

      {(isResearcher || isAdmin) && (
        <WindowCard label="MY_PAPERS.SYS" className="mb-5">
          <div className="mb-3 flex items-center gap-2 font-['Space_Mono',monospace] text-[10px] tracking-[0.07em] text-muted">
            <FileText size={11} />
            SUBMITTED PAPERS
          </div>
          <PapersList userId={user.id} />
        </WindowCard>
      )}
    </>
  );
}
