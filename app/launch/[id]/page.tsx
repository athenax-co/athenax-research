"use client";

import { use } from "react";
import { LaunchDetailPage } from "@/components/page/launch";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { user, showToast } = useGlobal();
  const { id } = use(params);

  return <LaunchDetailPage launchId={id} user={user} showToast={showToast} />;
}
