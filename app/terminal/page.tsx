"use client";
import TerminalPage from "@/components/page/terminal";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user, showToast } = useGlobal();

  return <TerminalPage user={user} showToast={showToast} />;
}
