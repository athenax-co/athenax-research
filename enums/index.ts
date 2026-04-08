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