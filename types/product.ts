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
