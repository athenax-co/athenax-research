"use client";
import BountiesPage from "@/components/page/bounties";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();
  return <BountiesPage user={user} showToast={showToast} />;
}
