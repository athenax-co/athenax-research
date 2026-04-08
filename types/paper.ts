import type { PaperStatus } from "@/enums";

export type { PaperStatus };

export type PaperSourceType = "link" | "editor";

export interface PaperIn {
  title: string;
  sourceType: PaperSourceType;
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
  voteCount: number;
  /** Raw IDs from the API */
  categoryIds: number[];
  /** Resolved from categoryIds — populated by query hooks */
  categories: CategoryRef[];
  createdAt: string;
  updatedAt: string;
}
