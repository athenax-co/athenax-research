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
  tags: string[];
  broadcastId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleIn {
  title: string;
  articleType: ArticleType;
  broadcastId?: number;
  content?: string | null;
  status?: ArticleStatus;
  publishedAt?: string | null;
  tags?: string[];
}

export interface ArticleUpdate {
  title?: string | null;
  slug?: string | null;
  articleType?: ArticleType | null;
  content?: string | null;
  status?: ArticleStatus | null;
  publishedAt?: string | null;
  tags?: string[] | null;
  broadcastId?: number | null;
}

export interface ArticleListParams {
  limit?: number;
  offset?: number;
  status?: ArticleStatus;
  articleType?: ArticleType;
  tag?: string;
}
