import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductBadgeType = "category" | "status" | "stage" | "subcategory" | "kind";

type ProductBadgeTone = "yellow" | "green" | "gray" | "blue" | "tan";

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
  blue: "bg-[#EAF0F6]",
  tan: "bg-[#E8E4D9]",
};

const baseClasses =
  "inline-flex items-center rounded-full border-[1.5px] border-ink px-2.5 py-[3px] font-['Space_Mono',monospace] text-[10px] font-semibold tracking-[0.04em] text-ink";

function normalizeBadgeLabel(label: string) {
  return label.replace(/\s+/g, " ").trim().toUpperCase();
}

function capitalizeLabel(label: string) {
  const trimmed = label.replace(/\s+/g, " ").trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

const KIND_TONE_MAP: Record<string, ProductBadgeTone> = {
  ARTICLE: "yellow",
  RESEARCH: "blue",
};

function resolveBadgeTone(label: string, type: ProductBadgeType): ProductBadgeTone {
  if (type === "stage") return "blue";
  if (type === "subcategory") return "tan";
  if (type === "kind") return KIND_TONE_MAP[normalizeBadgeLabel(label)] ?? "gray";
  const normalized = normalizeBadgeLabel(label);
  if (type === "status") return STATUS_TONE_MAP[normalized] ?? "gray";
  return CATEGORY_TONE_MAP[normalized] ?? "yellow";
}

function ProductBadge({ label, type = "category", className }: ProductBadgeProps) {
  const tone = resolveBadgeTone(label, type);
  const displayLabel = type === "stage" ? capitalizeLabel(label) : normalizeBadgeLabel(label);

  return (
    <Badge className={cn(baseClasses, type !== "stage" && "uppercase", toneClasses[tone], className)} variant="outline">
      {displayLabel}
    </Badge>
  );
}

export { ProductBadge };
