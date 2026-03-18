"use client";
import PostBountyPage from "@/components/page/post-bounty";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();
  return <PostBountyPage user={user} showToast={showToast} />;
}
