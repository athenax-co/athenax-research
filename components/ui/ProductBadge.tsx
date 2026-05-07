import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductBadgeType = "category" | "status";

type ProductBadgeTone = "yellow" | "green" | "gray";

type ProductBadgeProps = {
  label: string;
  type?: ProductBadgeType;
  className?: string;
};

const CATEGORY_TONE_MAP: Record<string, ProductBadgeTone> = {
  "AI & AGENTS": "yellow",
  "DEVELOPER TOOLS": "yellow",
  "CRYPTO & DEFI": "yellow",
  ROBOTICS: "green",
  BIOTECH: "green",
  INFRASTRUCTURE: "gray",
};

const STATUS_TONE_MAP: Record<string, ProductBadgeTone> = {
  LIVE: "green",
  BETA: "yellow",
};

const toneClasses: Record<ProductBadgeTone, string> = {
  yellow: "bg-badge-yellow",
  green: "bg-badge-green",
  gray: "bg-badge-gray",
};

const baseClasses =
  "inline-flex items-center rounded-full border-[1.5px] border-ink px-2.5 py-[3px] font-['Space_Mono',monospace] text-[10px] font-semibold uppercase tracking-[0.04em] text-ink";

function normalizeBadgeLabel(label: string) {
  return label.replace(/\s+/g, " ").trim().toUpperCase();
}

function resolveBadgeTone(label: string, type: ProductBadgeType): ProductBadgeTone {
  const normalized = normalizeBadgeLabel(label);
  if (type === "status") {
    return STATUS_TONE_MAP[normalized] ?? "gray";
  }

  return CATEGORY_TONE_MAP[normalized] ?? "yellow";
}

function ProductBadge({ label, type = "category", className }: ProductBadgeProps) {
  const tone = resolveBadgeTone(label, type);

  return (
    <Badge className={cn(baseClasses, toneClasses[tone], className)} variant="outline">
      {normalizeBadgeLabel(label)}
    </Badge>
  );
}

export { ProductBadge };
