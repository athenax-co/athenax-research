export const ProductStatus = {
    PENDING:  "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const ProductStage = {
    PRE_SEED: "Pre-Seed",
    SEED: "Seed",
    SERIES_A: "Series A",
    SERIES_B: "Series B",
} as const;

export type ProductStage = (typeof ProductStage)[keyof typeof ProductStage];

export const QualityBadge = {
    RESEARCH_BASED: "Research-Based",
    ARS_FOUNDER: "ARS Founder",
    COHORT_GRADUATE: "Cohort Graduate",
    COMMUNITY_VOTED: "Community Voted",
} as const;

export type QualityBadge = (typeof QualityBadge)[keyof typeof QualityBadge];

export const PaperStatus = {
    DRAFT:     "draft",
    PUBLISHED: "published",
    ARCHIVED:  "archived",
} as const;

export type PaperStatus = (typeof PaperStatus)[keyof typeof PaperStatus];

export const PaperVerificationStatus = {
    PENDING:  "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export type PaperVerificationStatus = (typeof PaperVerificationStatus)[keyof typeof PaperVerificationStatus];

export const VerificationStatus = {
    PENDING:  "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
} as const;

export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

export const ProductLinkType = {
    WEBSITE: "website",
    GITHUB:  "github",
    TWITTER: "twitter",
    DOCS:    "docs",
    DEMO:    "demo",
    DISCORD: "discord",
} as const;

export type ProductLinkType = (typeof ProductLinkType)[keyof typeof ProductLinkType];

export const ProductMediaType = {
    IMAGE:         "image",
    VIDEO_HOSTED:  "video_hosted",
    VIDEO_YOUTUBE: "video_youtube",
} as const;

export type ProductMediaType = (typeof ProductMediaType)[keyof typeof ProductMediaType];

export const BountyStatus = {
    OPEN:      "open",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
} as const;

export type BountyStatus = (typeof BountyStatus)[keyof typeof BountyStatus];

export const ArticleType = {
    WHITEPAPER:  "whitepaper",
    LIVESTREAM:  "livestream",
    ROUNDTABLE:  "roundtable",
} as const;

export type ArticleType = (typeof ArticleType)[keyof typeof ArticleType];

export const ArticleStatus = {
    DRAFT:     "draft",
    PUBLISHED: "published",
    ARCHIVED:  "archived",
} as const;

export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];