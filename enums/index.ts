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

export const ProductLinkType = {
  WEBSITE: "website",
  GITHUB: "github",
  TWITTER: "twitter",
  DOCS: "docs",
  DEMO: "demo",
  DISCORD: "discord",
} as const;

export type ProductLinkType = (typeof ProductLinkType)[keyof typeof ProductLinkType];

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
