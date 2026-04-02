"use client";

import { useGlobal } from "@/components/GlobalProvider";
import ResearchersPage from "@/components/page/researchers";

export default function Page() {
  const { user, showToast } = useGlobal();

  return <ResearchersPage user={user} showToast={showToast} />;
}
