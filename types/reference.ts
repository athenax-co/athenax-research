export interface CategoryOut {
  id: number;
  name: string;
  parentId: number | null;
}

export interface UniversityOut {
  id: number;
  name: string;
  country: string;
  focus?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LabOut {
  id: number;
  universityId: number;
  name: string;
  focus?: string | null;
  description?: string | null;
  active: boolean;
  categories: CategoryOut[];
  createdAt: string;
  updatedAt: string;
}

export interface CategoryRef {
  categoryId: number;
}
