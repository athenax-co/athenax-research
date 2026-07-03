import type { ProductStatus, ProductLinkType, ProductMediaType, BountyStatus, VerificationStatus } from "@/enums";

export type { ProductStatus };

export interface ProductIn {
  name: string;
  url?: string;
  stage?: string;
  funding: number;
  founded?: number;
  shortDesc?: string;
  description?: string;
  qualityBadge?: string;
  email?: string;
  categoryIds: number[];
  subCategoryIds?: number[];
  otherSubcategoryName?: string;
  backers?: string[];
  grants?: string[];
  links?: ProductLinkIn[];
}

export interface SubcategoryRef {
  id: number;
  name: string;
  status: VerificationStatus;
}

export interface CategoryRef {
  id: number;
  name: string;
  subcategories: SubcategoryRef[];
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
  qualityBadge?: string;
  status: ProductStatus;
  voteCount: number;
  bookmarkCount: number;
  investorInterestCount: number;
  categories: CategoryRef[];
  bookmarked?: boolean | null;
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
  mediaType: ProductMediaType;
  sortOrder: number;
  url: string | null;
}

export interface TeamMemberOut {
  id: number;
  productId: number;
  userId: number | null;
  name: string;
  roleLabel: string | null;
  bioNote: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  githubUrl: string | null;
  otherUrl: string | null;
  status: VerificationStatus;
}

export interface ProductBacker {
  id: number;
  productId: number;
  name: string;
}

export interface ProductGrant {
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
  imported?: boolean | null;
  email?: string | null;
  links: ProductLink[];
  media: ProductMedia[];
  team: TeamMemberOut[];
  backers: ProductBacker[];
  grants: ProductGrant[];
  voices: ProductVoice[];
  bounties: Bounty[];
}

export interface ProductUpdateIn {
  name?: string;
  shortDesc?: string;
  description?: string;
  stage?: string;
  funding?: number;
  founded?: number;
  qualityBadge?: string;
  imported?: boolean;
  logo?: string;
  email?: string;
  categoryIds?: number[];
  subCategoryIds?: number[];
  otherSubcategoryName?: string;
  links?: ProductLinkIn[];
  backers?: string[];
  grants?: string[];
}

export interface ProductLinkIn {
  linkType: ProductLinkType;
  url: string;
  label?: string;
}

export interface ProductListItem {
  id: number;
  slug: string;
  name: string;
  shortDesc: string | null;
  logo: string | null;
  stage: string | null;
  categories: CategoryRef[];
}

export interface ProductSummary {
  id: number;
  slug: string;
  name: string;
  stage: string;
  categories: CategoryRef[];
  bookmarkCount: number;
  voteCount: number;
  createdAt: string;
}

export interface TeamMemberIn {
  name: string;
  roleLabel?: string;
  bioNote?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  otherUrl?: string;
}

export interface VoiceIn {
  quote: string;
  authorHandle: string;
  authorName?: string;
  sourceUrl?: string;
  sortOrder?: number;
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
  username: string;
  parentId: number | null;
  depth: number;
  text: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}
