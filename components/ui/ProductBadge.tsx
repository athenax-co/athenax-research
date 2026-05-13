import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProductBadgeType = "category" | "status" | "stage" | "subcategory" | "kind" | "tag";

type ProductBadgeTone =
  | "ai-agents"
  | "biotech"
  | "crypto"
  | "dev-tools"
  | "infrastructure"
  | "robotics"
  | "subcategory"
  | "status-positive"
  | "status-progress"
  | "status-neutral"
  | "kind-article"
  | "kind-research"
  | "kind-whitepaper"
  | "kind-livestream"
  | "kind-roundtable"
  | "gray"
  | "tag";

type ProductBadgeProps = {
  label: string;
  type?: ProductBadgeType;
  className?: string;
};

const CATEGORY_TONE_MAP: Record<string, ProductBadgeTone> = {
  "AI & AGENTS":     "ai-agents",
  "DEVELOPER TOOLS": "dev-tools",
  "CRYPTO & DEFI":   "crypto",
  ROBOTICS:          "robotics",
  BIOTECH:           "biotech",
  INFRASTRUCTURE:    "infrastructure",
};

const STATUS_POSITIVE = new Set(["LIVE", "ACTIVE", "LAUNCHED"]);
const STATUS_PROGRESS = new Set(["BETA", "ACTIVE DEVELOPMENT"]);

const toneClasses: Record<ProductBadgeTone, string> = {
  "ai-agents":       "bg-[#FFE0CC] border-ink text-ink",
  "biotech":         "bg-[#D4ECD5] border-ink text-ink",
  "crypto":          "bg-[#FFE9A0] border-ink text-ink",
  "dev-tools":       "bg-[#D4E4F7] border-ink text-ink",
  "infrastructure":  "bg-[#E0DAD0] border-ink text-ink",
  "robotics":        "bg-[#E0D4F0] border-ink text-ink",
  "subcategory":     "bg-white border-[#1a1a1a] text-[#1a1a1a]",
  "status-positive": "bg-[#C8F7C5] border-[#2D6A2E] text-[#2D6A2E]",
  "status-progress": "bg-[#FFF3C4] border-[#8B7000] text-[#8B7000]",
  "status-neutral":  "bg-[#E8E4D9] border-[#1a1a1a] text-[#1a1a1a]",
  "kind-article":     "bg-[#ffe14d] border-ink text-ink",
  "kind-research":    "bg-[#EAF0F6] border-ink text-ink",
  "kind-whitepaper":  "bg-[#E8DFB8] border-[#D4C88E] text-[#6B5D2F]",
  "kind-livestream":  "bg-[#D4E4CF] border-[#B8CEB0] text-[#3D5A34]",
  "kind-roundtable":  "bg-[#EACED0] border-[#D4AEB1] text-[#7A3338]",
  "gray":             "bg-[#e8e4d9] border-ink text-ink",
  "tag":              "bg-transparent border-[#D4C88E] text-[#8B7A3D]",
};

const baseClasses =
  "inline-flex items-center rounded-full border-[1.5px] px-2.5 py-[3px] font-['Space_Mono',monospace] text-[10px] font-semibold tracking-[0.04em]";

function normalizeBadgeLabel(label: string) {
  return label.replace(/\s+/g, " ").trim().toUpperCase();
}

function capitalizeLabel(label: string) {
  const trimmed = label.replace(/\s+/g, " ").trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function resolveBadgeTone(label: string, type: ProductBadgeType): ProductBadgeTone {
  const normalized = normalizeBadgeLabel(label);
  if (type === "tag") return "tag";
  if (type === "category") return CATEGORY_TONE_MAP[normalized] ?? "gray";
  if (type === "subcategory") return "subcategory";
  if (type === "kind") {
    if (normalized === "ARTICLE") return "kind-article";
    if (normalized === "RESEARCH") return "kind-research";
    if (normalized === "WHITEPAPER") return "kind-whitepaper";
    if (normalized === "LIVESTREAM") return "kind-livestream";
    if (normalized === "ROUNDTABLE") return "kind-roundtable";
    return "gray";
  }
  if (STATUS_POSITIVE.has(normalized)) return "status-positive";
  if (STATUS_PROGRESS.has(normalized)) return "status-progress";
  return "status-neutral";
}

function ProductBadge({ label, type = "category", className }: ProductBadgeProps) {
  const tone = resolveBadgeTone(label, type);
  const displayLabel =
    type === "tag"
      ? label.replace(/\s+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase())
      : type === "stage"
      ? capitalizeLabel(label)
      : normalizeBadgeLabel(label);

  return (
    <Badge className={cn(baseClasses, type !== "stage" && type !== "tag" && "uppercase", toneClasses[tone], className)} variant="outline">
      {displayLabel}
    </Badge>
  );
}

export { ProductBadge };
