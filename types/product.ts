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
  categories: CategoryRef[];
  createdAt: string;
  updatedAt: string;
}
