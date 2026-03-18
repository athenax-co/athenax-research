"use client";
import SubmitPaperPage from "@/components/page/submit-paper";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();
  return <SubmitPaperPage user={user} showToast={showToast} />;
}
