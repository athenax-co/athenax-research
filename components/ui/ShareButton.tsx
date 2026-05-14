"use client";

import { useGlobal } from "@/components/GlobalProvider";
import { IconShare } from "@/components/Icons";

export function ShareButton({ url }: { url: string }) {
  const { showToast } = useGlobal();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied!", "success");
    } catch {
      showToast("Could not copy link.", "error");
    }
  };

  return (
    <button className="btn btn-ghost btn-sm size-9 p-0! shrink-0 mt-1" onClick={handleShare}>
      <IconShare size={15} />
    </button>
  );
}
