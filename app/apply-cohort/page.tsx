"use client";
import ApplyCohortPage from "@/components/page/apply-cohort";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();
  return <ApplyCohortPage user={user} showToast={showToast} />;
}
