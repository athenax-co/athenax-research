"use client";

import { useGlobal } from "@/components/GlobalProvider";
import TechMarketplacePage from "@/components/page/technology";

export default function Page() {
  const { user, showToast } = useGlobal();

  return <TechMarketplacePage user={user} showToast={showToast} />;
}
