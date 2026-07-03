import { VerificationStatus } from "@/enums";
import type { CategoryRef, SubcategoryRef } from "./types";

export function approvedSubcategories(categories: CategoryRef[]): SubcategoryRef[] {
  return categories.flatMap((c) => c.subcategories.filter((s) => s.status === VerificationStatus.APPROVED));
}

export function pendingSubcategory(categories: CategoryRef[]): SubcategoryRef | null {
  for (const c of categories) {
    const pending = c.subcategories.find((s) => s.status === VerificationStatus.PENDING);
    if (pending) return pending;
  }
  return null;
}
