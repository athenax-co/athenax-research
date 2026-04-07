"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import ProductReviewRow from "@/components/ui/ProductReviewRow";
import { useGlobal } from "@/components/GlobalProvider";
import { useProducts } from "@/hooks/queries/useProduct";

export default function Page() {
  const { user } = useGlobal();
  const [tab, setTab] = useState<"pending" | "rejected" | "all">("pending");

  const { data: pending = [], isLoading: loadingPending } = useProducts("pending");
  const { data: rejected = [], isLoading: loadingRejected } = useProducts("rejected");

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/dashboard/review</div>
        <h1 className="mb-3 text-5xl">Admin Review</h1>
        <WindowCard label="ACCESS_DENIED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Admin access required.</p>
          <Link className="btn btn-primary" href="/dashboard">
            Back to Dashboard
          </Link>
        </WindowCard>
      </div>
    );
  }

  const isLoading = loadingPending || loadingRejected;

  const displayList =
    tab === "pending"
      ? pending
      : tab === "rejected"
        ? rejected
        : [...pending, ...rejected].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/dashboard/review</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Link href="/dashboard" className="font-mono text-xs text-muted no-underline hover:underline">
            ← Dashboard
          </Link>
          <h1 className="mb-0 text-5xl">Admin Review</h1>
        </div>
        <span className="font-mono text-xs text-muted">Welcome back, {user.name.split(" ")[0]}</span>
      </div>
      <p className="mb-0 text-[17px] text-muted">Review pending and rejected product submissions.</p>
      <hr className="divider" />

      <div className="mb-7 grid grid-cols-3 gap-3.5">
        {[
          { label: "Pending Review", value: pending.length },
          { label: "Rejected", value: rejected.length },
          { label: "Total Queued", value: pending.length + rejected.length },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value text-[20px]">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex gap-2 border-b-2 border-b-[#1C1C27] pb-2.5">
        {(
          [
            ["pending", "Pending"],
            ["rejected", "Rejected"],
            ["all", "All"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            className={tab === k ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
            style={tab === k ? { background: "#F5D94E" } : {}}
            onClick={() => setTab(k)}
          >
            {l} {k === "pending" ? `(${pending.length})` : k === "rejected" ? `(${rejected.length})` : `(${pending.length + rejected.length})`}
          </button>
        ))}
      </div>

      <WindowCard label="PRODUCTS.SYS">
        {isLoading ? (
          <p className="text-[13px] text-muted">Loading…</p>
        ) : displayList.length === 0 ? (
          <p className="text-[13px] text-muted">No products in this tab.</p>
        ) : (
          displayList.map((product) => <ProductReviewRow key={product.id} product={product} />)
        )}
      </WindowCard>
    </div>
  );
}
