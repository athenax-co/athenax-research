import type { ProductStatus, ProductLinkType, ProductMediaType, BountyStatus, VerificationStatus } from "@/enums";

export type { ProductStatus };

export interface ProductIn {
  name: string;
  stage: string;
  funding: number;
  founded: number;
  shortDesc?: string;
  description?: string;
  qualityBadge: string;
  email?: string;
  twitter?: string;
  categoryIds: number[];
  founders?: string[];
}

export interface CategoryRef {
  id: number;
  name: string;
}

export interface ProductOut {
  id: number;
  userId: number;
  createdById: number | null;
  slug: string;
  name: string;
  shortDesc?: string | null;
  description: string;
  stage: string;
  funding: number;
  founded: number;
  logo?: string | null;
  twitter?: string | null;
  qualityBadge?: string;
  status: ProductStatus;
  voteCount: number;
  bookmarkCount: number;
  investorInterestCount: number;
  categoryIds: number[];
  categories: CategoryRef[];
  bookmarked?: boolean | null;
  founders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductLink {
  id: number;
  productId: number;
  linkType: ProductLinkType;
  url: string;
  label: string | null;
}

export interface ProductMedia {
  id: number;
  productId: number;
  mediaType: ProductMediaType;
  storageKey: string;
  sortOrder: number;
}

export interface TeamMemberOut {
  id: number;
  productId: number;
  userId: number | null;
  name: string;
  roleLabel: string | null;
  bioNote: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  status: VerificationStatus;
}

export interface ProductBacker {
  id: number;
  productId: number;
  name: string;
}

export interface ProductVoice {
  id: number;
  productId: number;
  quote: string;
  authorHandle: string;
  authorName: string | null;
  sourceUrl: string | null;
  sortOrder: number;
}

export interface Bounty {
  id: number;
  productId: number;
  title: string;
  techLabel: string | null;
  rewardAmount: string;
  status: BountyStatus;
  externalUrl: string;
}

export interface ProductDetailOut extends ProductOut {
  papers?: Array<{ id: number; title: string; slug: string; publishedAt: string }>;
  voted: boolean | null;
  bookmarked: boolean | null;
  interested: boolean | null;
  links: ProductLink[];
  media: ProductMedia[];
  team: TeamMemberOut[];
  backers: ProductBacker[];
  voices: ProductVoice[];
  bounties: Bounty[];
}

export interface ProductSummary {
  id: number;
  slug: string;
  name: string;
  stage: string;
  categoryIds: number[];
  bookmarkCount: number;
  voteCount: number;
  createdAt: string;
}

export interface TeamMemberIn {
  name: string;
  roleLabel?: string;
  bioNote?: string;
  twitterUrl?: string;
  githubUrl?: string;
}

export interface VoiceIn {
  quote: string;
  authorHandle: string;
  authorName?: string;
  sourceUrl?: string;
}

export interface BountyIn {
  title: string;
  techLabel?: string;
  rewardAmount: string;
  externalUrl: string;
}

export interface ProductComment {
  id: number;
  productId: number;
  createdById: number;
  text: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}
