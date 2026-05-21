import { voteProduct } from "@/features/products/api";
import type { ProductOut } from "@/features/products";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VoteButton = ({
  user,
  product,
  showToast,
  size = "sm",
  initialVoted,
  showLabel = false,
  className,
  disabled = false,
}: {
  user: any;
  product: ProductOut;
  showToast: (message: string, type: string) => void;
  size?: "xs" | "sm" | "default" | "lg";
  initialVoted?: boolean | null;
  showLabel?: boolean;
  className?: string;
  disabled?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(() => initialVoted ?? false);
  const [count, setCount] = useState(() => product.voteCount ?? 0);

  const toggle = async () => {
    if (!user) {
      showToast("Sign in to upvote.", "error");
      return;
    }

    const next = !voted;
    setLoading(true);
    try {
      await voteProduct(product.id, next);
      setVoted(next);
      setCount((c) => Math.max(0, c + (next ? 1 : -1)));
      queryClient.setQueriesData({ queryKey: ["products"] }, (pages: any) => {
        if (!pages?.pages) return pages;
        return {
          ...pages,
          pages: pages.pages.map((page: ProductOut[]) =>
            page.map((p: ProductOut) =>
              p.id === product.id ? { ...p, voteCount: Math.max(0, p.voteCount + (next ? 1 : -1)) } : p
            )
          ),
        };
      });
      queryClient.setQueriesData({ queryKey: ["product"] }, (old: any) => {
        if (!old || old.id !== product.id) return old;
        return { ...old, voted: next, voteCount: Math.max(0, old.voteCount + (next ? 1 : -1)) };
      });
      queryClient.invalidateQueries({ queryKey: ["products", "me", "voted"] });
      queryClient.invalidateQueries({ queryKey: ["products", "paged"] });
      showToast(next ? `Upvoted ${product.name}!` : "Vote removed.", next ? "success" : "info");
    } catch {
      showToast("Failed to vote. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={voted ? "ghost" : "outline"}
      size={size}
      className={cn(voted ? "bg-[#D4EDDA]" : "", className)}
      onClick={toggle}
      disabled={loading || disabled}
    >
      <span className="text-[14px] leading-none">{loading ? "…" : voted ? "✓" : "▲"}</span>
      {showLabel && <span className="ml-1">{voted ? "Voted" : "Upvote"}</span>}
      <span className="font-['Space_Mono',monospace] text-[10px] font-bold text-[#E8323C] ml-1">{count.toLocaleString()}</span>
    </Button>
  );
};

export default VoteButton;
