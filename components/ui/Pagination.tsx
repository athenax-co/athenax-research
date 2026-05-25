import { Button } from "@/components/ui/button";
import { cn } from "@/utils/lib";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({ page, totalPages, onPageChange, className }: Props) {
  if (totalPages < 2) return null;

  const items: (number | "ellipsis")[] = [];
  const delta = 1;
  const rangeStart = Math.max(2, page - delta);
  const rangeEnd = Math.min(totalPages - 1, page + delta);

  items.push(1);
  if (rangeStart > 2) items.push("ellipsis");
  for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
  if (rangeEnd < totalPages - 1) items.push("ellipsis");
  if (totalPages > 1) items.push(totalPages);

  return (
    <div className={cn("flex items-center justify-center gap-1.5 flex-wrap", className)}>
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
        ← Prev
      </Button>
      {items.map((item, idx) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="font-['Space_Mono',monospace] text-xs text-muted px-1 select-none">
            ···
          </span>
        ) : (
          <Button
            key={item}
            variant={item === page ? "ghost" : "outline"}
            size="sm"
            className={cn("min-w-8", item === page ? "bg-yellow font-bold" : "")}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        )
      )}
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
        Next →
      </Button>
    </div>
  );
}
