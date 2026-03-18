"use client";
import DigestPage from "@/components/page/digest";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { user } = useGlobal();
  return <DigestPage user={user} />;
}
