import type { ArticleType, ArticleStatus } from "@/enums";

export type { ArticleType, ArticleStatus };

export interface ArticleOut {
  id: number;
  title: string;
  slug: string;
  articleType: ArticleType;
  content: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  creatorName: string | null;
  categories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArticleIn {
  title: string;
  articleType: ArticleType;
  content?: string | null;
  status?: ArticleStatus;
  publishedAt?: string | null;
  categoryIds?: number[];
}

export interface ArticleUpdate {
  title?: string | null;
  articleType?: ArticleType | null;
  content?: string | null;
  status?: ArticleStatus | null;
  publishedAt?: string | null;
  categoryIds?: number[] | null;
}

export interface ArticleListParams {
  limit?: number;
  offset?: number;
  status?: ArticleStatus;
  articleType?: ArticleType;
  categoryId?: number;
}
