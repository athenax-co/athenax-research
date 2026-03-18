"use client";
import PaperPage from "@/components/page/paper";
import { useGlobal } from "@/components/GlobalProvider";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { user, showToast } = useGlobal();
  const { id } = use(params);

  return <PaperPage paperId={id} user={user} showToast={showToast} />;
}
