// ─── Shared base enums ───────────────────────────────────────────────────────

const ContentStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

const ApprovalStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

const ContentType = {
  WHITEPAPER: "whitepaper",
  LIVESTREAM: "livestream",
  ROUNDTABLE: "roundtable",
} as const;

type ContentType = (typeof ContentType)[keyof typeof ContentType];

// ─── Aliases ─────────────────────────────────────────────────────────────────

export const ProductStatus = ApprovalStatus;
export type ProductStatus = ApprovalStatus;

export const PaperStatus = ContentStatus;
export type PaperStatus = ContentStatus;

export const PaperVerificationStatus = ApprovalStatus;
export type PaperVerificationStatus = ApprovalStatus;

export const VerificationStatus = ApprovalStatus;
export type VerificationStatus = ApprovalStatus;

export const ArticleStatus = ContentStatus;
export type ArticleStatus = ContentStatus;

export const ArticleType = ContentType;
export type ArticleType = ContentType;

export const BroadcastStatus = ContentStatus;
export type BroadcastStatus = ContentStatus;

export const BroadcastType = ContentType;
export type BroadcastType = ContentType;

// ─── Standalone enums ────────────────────────────────────────────────────────

export const QualityBadge = {
  RESEARCH_BASED: "Research-Based",
  ARS_FOUNDER: "ARS Founder",
  COHORT_GRADUATE: "Cohort Graduate",
  COMMUNITY_VOTED: "Community Voted",
} as const;

export type QualityBadge = (typeof QualityBadge)[keyof typeof QualityBadge];

// Single source of truth for both the `ProductLinkType` union and its display labels.
export const PRODUCT_LINK_TYPES = [
  { value: "website", label: "Website" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter / X" },
  { value: "docs", label: "Documentation" },
  { value: "demo", label: "Demo" },
  { value: "discord", label: "Discord" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "medium", label: "Medium" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "other", label: "Other" },
] as const;

export type ProductLinkType = (typeof PRODUCT_LINK_TYPES)[number]["value"];

export const ProductLinkTypeLabel = Object.fromEntries(
  PRODUCT_LINK_TYPES.map((t) => [t.value, t.label])
) as Record<ProductLinkType, string>;

const OTHER_LINK_TYPE: ProductLinkType = "other";
const DOCS_LINK_TYPE: ProductLinkType = "docs";

function linkTypeRank(linkType: string): number {
  if (linkType === OTHER_LINK_TYPE) return 2;
  if (linkType === DOCS_LINK_TYPE) return 1;
  return 0;
}

// Keeps "docs" second-to-last and "other" last, preserving relative order of everything else.
export function sortProductLinksOtherLast<T extends { linkType: string }>(links: T[]): T[] {
  return [...links].sort((a, b) => linkTypeRank(a.linkType) - linkTypeRank(b.linkType));
}

export const ProductMediaType = {
  IMAGE: "image",
  VIDEO_HOSTED: "video_hosted",
  VIDEO_YOUTUBE: "video_youtube",
} as const;

export type ProductMediaType = (typeof ProductMediaType)[keyof typeof ProductMediaType];

export const BountyStatus = {
  OPEN: "open",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BountyStatus = (typeof BountyStatus)[keyof typeof BountyStatus];
