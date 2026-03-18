"use client";
import SponsorOnboardingPage from "@/components/page/sponsor-onboarding";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();
  return <SponsorOnboardingPage user={user} showToast={showToast} />;
}
