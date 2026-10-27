"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/lib";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({ page, totalPages, onPageChange, className }: Props) {
  const [jumpValue, setJumpValue] = useState("");
  const jumpId = useId();

  if (totalPages < 2) return null;

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpValue, 10);
    if (Number.isNaN(target)) return;
    const clamped = Math.min(totalPages, Math.max(1, target));
    if (clamped !== page) onPageChange(clamped);
    setJumpValue("");
  };

  const items: (number | "ellipsis")[] = [];
  const delta = 1;
  const rangeStart = Math.max(2, page - delta);
  const rangeEnd = Math.min(totalPages - 1, page + delta);

  items.push(1);
  if (rangeStart > 2) items.push("ellipsis");
  for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
  if (rangeEnd < totalPages - 1) items.push("ellipsis");
  if (totalPages > 1) items.push(totalPages);

  // .btn-sm padding is too wide to fit a full row on phones
  const compact = "max-sm:px-2.5 max-sm:py-1 max-sm:text-xs";

  return (
    <div className={cn("flex flex-col items-center gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-1.5", className)}>
      <div className="hidden sm:block" />
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 sm:flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className={compact}
          disabled={page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          ←<span className="hidden sm:inline"> Prev</span>
        </Button>
        {items.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="font-['Space_Mono',monospace] text-xs text-muted px-0.5 sm:px-1 select-none">
              ···
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "ghost" : "outline"}
              size="sm"
              className={cn("min-w-8", compact, "max-sm:min-w-7", item === page ? "bg-yellow font-bold" : "")}
              onClick={() => onPageChange(item)}
            >
              {item}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          className={compact}
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next </span>→
        </Button>
      </div>
      {totalPages > 5 && (
        <form onSubmit={handleJump} className="flex items-center gap-1.5 sm:justify-self-end">
          <label htmlFor={jumpId} className="font-['Space_Mono',monospace] text-xs text-muted select-none">
            Go to
          </label>
          <input
            id={jumpId}
            type="number"
            inputMode="numeric"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            placeholder={`1–${totalPages}`}
            aria-label={`Jump to page (1 to ${totalPages})`}
            className="h-7 w-14 sm:h-8 sm:w-16 rounded-lg border-2 border-[#1C1C27] bg-white px-2 text-center text-[13px] shadow-[2px_2px_0_#1C1C27] placeholder:text-[#aaa] focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <Button type="submit" variant="outline" size="sm" className={compact} disabled={!jumpValue}>
            Go
          </Button>
        </form>
      )}
    </div>
  );
}
