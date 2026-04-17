"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGlobal } from "@/components/GlobalProvider";
import { usePaperBySlug, PaperPage } from "@/features/papers";

function PaperPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? searchParams.get("id") ?? "";
  const { user, showToast } = useGlobal();
  const { data: paper, isLoading, isError } = usePaperBySlug(slug);

  if (isLoading) {
    return (
      <div className="page-wrap section">
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-24 rounded bg-[#E8E4DC]" />
          <div className="mb-4 h-9 w-3/4 rounded bg-[#E8E4DC]" />
          <div className="h-4 w-full rounded bg-[#E8E4DC]" />
        </div>
      </div>
    );
  }

  if (isError || !paper) {
    return (
      <div className="page-wrap section">
        <p className="text-muted">Paper not found.</p>
      </div>
    );
  }

  return <PaperPage paper={paper} user={user} showToast={showToast} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaperPageContent />
    </Suspense>
  );
}
