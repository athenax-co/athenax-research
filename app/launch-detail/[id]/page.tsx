"use client";
import { LaunchDetailPage } from "@/components/page/launch";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page({ params }: { params: { id: string } }) {
  const { user, showToast } = useGlobal();

  return <LaunchDetailPage launchId={params.id} user={user} showToast={showToast} />;
}
