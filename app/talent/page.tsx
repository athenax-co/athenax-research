"use client";
import TalentPage from "@/components/page/talent";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();

  return <TalentPage user={user} showToast={showToast} />;
}
