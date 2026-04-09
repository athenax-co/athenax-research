import type { PaperStatus, PaperVerificationStatus } from "@/enums";

export type { PaperStatus, PaperVerificationStatus };

export type PaperSourceType = "link" | "editor";

export interface PaperIn {
  title: string;
  sourceType: PaperSourceType;
  status?: PaperStatus;
  externalUrl?: string;
  abstract?: string;
  content?: string;
  categoryIds: number[];
}

export interface CategoryRef {
  id: number;
  name: string;
}

export interface PaperOut {
  id: number;
  userId: number;
  productId: number | null;
  title: string;
  slug: string;
  abstract: string | null;
  status: PaperStatus;
  publishedAt: string | null;
  sourceType: PaperSourceType;
  externalUrl: string | null;
  content: string | null;
  verificationStatus: PaperVerificationStatus;
  voteCount: number;
  /** Raw IDs from the API */
  categoryIds: number[];
  /** Resolved from categoryIds — populated by query hooks */
  categories: CategoryRef[];
  createdAt: string;
  updatedAt: string;
}

export interface PaperUpdate {
  title?: string;
  abstract?: string;
  content?: string;
  externalUrl?: string;
  categoryIds?: number[];
  status?: PaperStatus;
}
