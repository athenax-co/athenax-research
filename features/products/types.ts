import type { ProductStatus } from "@/enums";

export type { ProductStatus };

export interface ProductIn {
  name: string;
  stage: string;
  funding: number;
  founded: number;
  description: string;
  qualityBadge: string;
  github?: string;
  demo?: string;
  email?: string;
  twitter?: string;
  categoryIds: number[];
}

export interface CategoryRef {
  id: number;
  name: string;
}

export interface ProductOut {
  id: number;
  userId: number;
  slug: string;
  name: string;
  description: string;
  stage: string;
  funding: number;
  founded: number;
  github?: string;
  demo?: string;
  qualityBadge?: string;
  status: ProductStatus;
  voteCount: number;
  bookmarkCount: number;
  investorInterestCount: number;
  /** Raw IDs from the API */
  categoryIds: number[];
  /** Resolved from categoryIds — populated by query hooks */
  categories: CategoryRef[];
  bookmarked?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFounder {
  id: number;
  name: string;
  labName?: string | null;
  universityName?: string | null;
}

export interface ProductDetailOut extends ProductOut {
  papers?: Array<{ id: number; title: string; slug: string; publishedAt: string }>;
  founder?: ProductFounder | null;
  voted: boolean | null;
  bookmarked: boolean | null;
  interested: boolean | null;
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

export interface ProductComment {
  id: number;
  productId: number;
  userId: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}
