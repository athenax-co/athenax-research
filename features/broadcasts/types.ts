import type { BroadcastType, BroadcastStatus } from "@/enums";

export type { BroadcastType, BroadcastStatus };

export interface BroadcastOut {
  id: number;
  title: string;
  slug: string;
  broadcastType: BroadcastType;
  status: BroadcastStatus;
  embedUrl: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  originDate: string | null;
  publishedAt: string | null;
  creatorName: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastIn {
  title: string;
  broadcastType: BroadcastType;
  status?: BroadcastStatus;
  embedUrl?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  originDate?: string | null;
  publishedAt?: string | null;
  tags?: string[];
}

export interface BroadcastUpdate {
  title?: string | null;
  broadcastType?: BroadcastType | null;
  status?: BroadcastStatus | null;
  embedUrl?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
  originDate?: string | null;
  publishedAt?: string | null;
  tags?: string[] | null;
}

export interface BroadcastListParams {
  limit?: number;
  offset?: number;
  status?: BroadcastStatus;
  broadcastType?: BroadcastType;
  tag?: string;
}
