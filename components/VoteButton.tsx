import { voteProduct } from "@/features/products/api";
import type { ProductOut } from "@/features/products";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const VoteButton = ({
  user,
  product,
  showToast,
  size = "sm",
  initialVoted,
}: {
  user: any;
  product: ProductOut;
  showToast: (message: string, type: string) => void;
  size?: string;
  initialVoted?: boolean | null;
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
      showToast(next ? `Upvoted ${product.name}!` : "Vote removed.", next ? "success" : "info");
    } catch {
      showToast("Failed to vote. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-${voted ? "ghost" : "outline"} btn-${size} justify-center`}
      style={{ background: voted ? "#D4EDDA" : "" }}
      onClick={toggle}
      disabled={loading}
    >
      <span className="text-[14px] leading-none">{loading ? "…" : "▲"}</span>
      <span className="font-['Space_Mono',monospace] text-[10px] font-bold text-[#E8323C] ml-1">{count.toLocaleString()}</span>
    </button>
  );
};

export default VoteButton;
