"use client";
import ApplyLabPage from "@/components/page/apply-lab";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { showToast } = useGlobal();
  return <ApplyLabPage showToast={showToast} />;
}
