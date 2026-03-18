"use client";
import ProfilePage from "@/components/page/profile";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, setUser, showToast } = useGlobal();

  return <ProfilePage user={user} showToast={showToast} onUserUpdate={setUser} />;
}
