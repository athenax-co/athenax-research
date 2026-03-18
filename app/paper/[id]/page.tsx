"use client";
import PaperPage from "@/components/page/paper";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page({ params }: { params: { id: string } }) {
  const { user, showToast } = useGlobal();
  return <PaperPage paperId={params.id} user={user} showToast={showToast} />;
}
