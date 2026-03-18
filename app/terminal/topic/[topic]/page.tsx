"use client";
import TerminalPage from "@/components/page/terminal";
import { useGlobal } from "@/components/GlobalProvider";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ topic: string }> }) {
  const { user, showToast } = useGlobal();
  const { topic } = use(params);

  return <TerminalPage user={user} showToast={showToast} initialQuery={`topic: ${topic}`} />;
}
