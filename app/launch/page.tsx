"use client";
import LaunchPage from "@/components/page/launch";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();

  return <LaunchPage user={user} showToast={showToast} />;
}
