"use client";

import { useEffect } from "react";

/**
 * Guards against accidental data loss when `isDirty` is true.
 * - Browser tab close / refresh  → native "Leave site?" dialog
 * - In-app link clicks           → window.confirm dialog (App Router has no
 *                                  cancellable route-change event, so we
 *                                  intercept clicks on <a> elements instead)
 */
export function useUnsavedChangesGuard(isDirty: boolean) {
  // Guard browser close / refresh
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Guard in-app navigation via <a> clicks
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      // Ignore external links, hash-only links, and non-navigation anchors
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return;

      if (!window.confirm("You have unsaved changes. Leave anyway?")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isDirty]);
}
