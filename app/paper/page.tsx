"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaperPage from "@/components/page/paper";
import { useGlobal } from "@/components/GlobalProvider";

function PaperPageContent() {
  const searchParams = useSearchParams();
  const paperId = searchParams.get("id") || "";
  const { user, showToast } = useGlobal();

  return <PaperPage paperId={paperId} user={user} showToast={showToast} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaperPageContent />
    </Suspense>
  );
}
