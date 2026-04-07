"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { useGlobal } from "@/components/GlobalProvider";
import { useUpdateProductStatus } from "@/hooks/queries/useProduct";
import type { ProductOut } from "@/types/product";
import { formatShortDate, formatSubmittedDateTime } from "@/utils/lib";

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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink bg-paper text-[13px] font-bold">
          {product.name.charAt(0)}
        </div>
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
          <button className="btn btn-primary btn-sm" disabled={isBusy} onClick={() => handleStatusAction("approved")}>
            Approve
          </button>
          <button className="btn btn-outline btn-sm" disabled={isBusy} onClick={() => handleStatusAction("rejected")}>
            Reject
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => setIsOpen(true)}>
            Review →
          </button>
        </div>
      </div>

      {isOpen && (
        <Modal title="REVIEW_PRODUCT.SYS" onClose={close}>
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
                { label: "Funding", value: `$${product.funding.toLocaleString()}` },
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
            <button className="btn btn-primary flex-1 justify-center" disabled={isBusy} onClick={() => handleStatusAction("approved")}>
              Approve
            </button>
            <button
              className="btn btn-outline flex-1 justify-center"
              disabled={isBusy || product.status !== "pending"}
              onClick={() => handleStatusAction("rejected")}
            >
              Reject
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
