"use client";

import { useState } from "react";
import { Dialog, DialogBody, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrafficLights } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/components/GlobalProvider";
import { useUpdateProductStatus } from "@/features/products";
import type { ProductOut } from "@/features/products";
import { formatShortDate, formatSubmittedDateTime } from "@/utils/lib";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type ProductReviewRowProps = {
  product: ProductOut;
};

export default function ProductReviewRow({ product }: ProductReviewRowProps) {
  const { showToast } = useGlobal();
  const { mutate: updateStatus, isPending: isBusy } = useUpdateProductStatus();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const handleStatusAction = (status: "approved" | "rejected") => {
    updateStatus(
      { id: product.id, status },
      {
        onSuccess: () => {
          showToast(`${product.name} ${status}`, status === "approved" ? "success" : "info");
          close();
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-start gap-3 border-b border-[#D8D4CC] py-4 last:border-b-0">
        <Avatar className="size-9 rounded-md border border-ink">
          <AvatarImage src={product.logo ?? undefined} alt={product.name} className="rounded-md" />
          <AvatarFallback className="rounded-md bg-paper text-[13px] font-bold">
            {product.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold">{product.name}</div>
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-normal text-muted">{product.description}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="ftag bg-[#EAF0F6] text-[10px]">{product.stage}</span>
            {(product.categories ?? []).map((c) => (
              <span key={c.id} className="topic-pill text-[10px]">
                {c.name}
              </span>
            ))}
            <span className="font-['Space_Mono',monospace] text-[10px] text-muted">{formatShortDate(product.createdAt)}</span>
            <span className={`ftag text-[10px] ${product.status === "pending" ? "bg-yellow" : "bg-[#FDECEA] text-[#E8323C]"}`}>{product.status}</span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          <Button size="sm" disabled={isBusy} onClick={() => handleStatusAction("approved")}>
            Approve
          </Button>
          <Button variant="outline" size="sm" disabled={isBusy} onClick={() => handleStatusAction("rejected")}>
            Reject
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
            Review →
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="window-titlebar" style={{ border: "none", padding: 0, background: "none", flex: 1 }}>
              <DialogTrafficLights />
              <DialogTitle className="titlebar-label ml-2">REVIEW_PRODUCT.SYS</DialogTitle>
            </div>
            <DialogClose className="modal-close">×</DialogClose>
          </DialogHeader>
          <DialogBody>
            <div className="mb-4">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="mb-0 text-[22px]">{product.name}</h2>
                {(product.categories ?? []).map((c) => (
                  <span key={c.id} className="topic-pill">
                    {c.name}
                  </span>
                ))}
                {product.qualityBadge && <span className="ftag bg-[#EAF0F6] text-[10px]">{product.qualityBadge}</span>}
              </div>
              <p className="mb-3 text-[13px] leading-[1.6] text-muted">{product.description}</p>

              <div className="mb-3 grid grid-cols-3 gap-2.5">
                {[
                  { label: "Stage", value: product.stage },
                  { label: "Funding", value: product.funding != null ? `$${product.funding.toLocaleString()}` : "—" },
                  { label: "Founded", value: product.founded },
                ].map((s) => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value text-[15px]">{s.value}</div>
                  </div>
                ))}
              </div>

              {[
                { label: "GitHub", value: product.github },
                { label: "Demo", value: product.demo },
              ]
                .filter((l) => l.value)
                .map((l) => (
                  <div key={l.label} className="mb-1.5 flex items-center justify-between border-b border-[#D8D4CC] py-1.5">
                    <span className="text-[12px] font-semibold text-muted">{l.label}</span>
                    <span className="font-['Space_Mono',monospace] text-[11px]">{l.value}</span>
                  </div>
                ))}

              <div className="mt-2 flex flex-wrap gap-3">
                <span className="font-['Space_Mono',monospace] text-[10px] text-muted">Submitted: {formatSubmittedDateTime(product.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-2 border-t border-[#D8D4CC] pt-3">
              <Button className="flex-1 justify-center" disabled={isBusy} onClick={() => handleStatusAction("approved")}>
                Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 justify-center"
                disabled={isBusy || product.status !== "pending"}
                onClick={() => handleStatusAction("rejected")}
              >
                Reject
              </Button>
            </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </>
  );
}
