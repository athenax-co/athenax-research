"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useBroadcastsList, useDeleteBroadcast } from "@/features/broadcasts";
import { ContentRow } from "@/components/Content";
import { cn } from "@/utils/lib";
import { BroadcastStatus } from "@/enums";

const STATUS_COLORS: Record<string, string> = {
  published: "bg-[#15803D10] text-[#15803D]",
  draft: "bg-[#E8A00010] text-[#E8A000]",
  archived: "bg-[#1c1c2710] text-muted",
};

export default function Page() {
  const { user, showToast } = useGlobal();
  const [statusFilter, setStatusFilter] = useState<BroadcastStatus | undefined>(undefined);
  const { data: broadcasts = [], isLoading } = useBroadcastsList({ status: statusFilter }, { auth: true });
  const { mutate: deleteBroadcast } = useDeleteBroadcast();

  if (!user || (user.role as string) !== "admin") {
    return (
      <div className="page-wrap section">
        <div className="path-badge">/root/admin/broadcasts</div>
        <h1 className="mb-3 text-5xl">Broadcasts</h1>
        <WindowCard label="ACCESS_DENIED.SYS" bodyClass="window-body window-body-yellow">
          <p className="mb-4 text-[15px]">Admin access required.</p>
          <Link className="btn btn-outline" href="/admin">
            Back to Admin
          </Link>
        </WindowCard>
      </div>
    );
  }

  const handleDelete = (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteBroadcast(id, {
      onSuccess: () => showToast(`Deleted: ${title.slice(0, 40)}`, "info"),
      onError: () => showToast("Delete failed.", "error"),
    });
  };

  const filters: { label: string; value: BroadcastStatus | undefined }[] = [
    { label: "All", value: undefined },
    { label: "Draft", value: BroadcastStatus.DRAFT },
    { label: "Published", value: BroadcastStatus.PUBLISHED },
    { label: "Archived", value: BroadcastStatus.ARCHIVED },
  ];

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/admin/broadcasts</div>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <Link href="/admin" className="font-mono text-xs text-muted no-underline hover:underline">
            ← Admin
          </Link>
          <h1 className="mb-0 text-5xl">Broadcasts</h1>
        </div>
        <Link href="/admin/broadcasts/editor" className={cn(buttonVariants({ size: "sm" }), "no-underline")}>
          + New Broadcast
        </Link>
      </div>
      <p className="mb-0 text-[17px] text-muted">Manage whitepapers, livestreams, and roundtables.</p>
      <hr className="divider" />

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map(({ label, value }) => (
          <Button
            key={label}
            size="sm"
            variant={statusFilter === value ? "ghost" : "outline"}
            className={statusFilter === value ? "bg-yellow" : undefined}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      <WindowCard label="BROADCASTS.SYS">
        {isLoading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : broadcasts.length === 0 ? (
          <p className="text-sm text-muted">No broadcasts found.</p>
        ) : (
          broadcasts.map((broadcast) => (
            <ContentRow
              key={broadcast.id}
              item={broadcast}
              kind="broadcast"
              statusBadge={
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 font-['Space_Mono',monospace] text-[10px] font-bold uppercase tracking-wide",
                    STATUS_COLORS[broadcast.status]
                  )}
                >
                  {broadcast.status}
                </span>
              }
              actions={
                <div className="flex shrink-0 gap-2">
                  <Link href={`/admin/broadcasts/editor?id=${broadcast.id}`} className="btn btn-outline btn-sm no-underline">
                    Edit →
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(broadcast.id, broadcast.title)}>
                    ✗
                  </Button>
                </div>
              }
            />
          ))
        )}
      </WindowCard>
    </div>
  );
}
