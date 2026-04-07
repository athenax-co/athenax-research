import { bookmarkProduct } from "@/api/product";
import { bookmarkSvc } from "@/utils/lib";
import type { ProductOut } from "@/types/product";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const BookmarkButton = ({
  user,
  launch,
  showToast,
  size = "sm",
  showCount = true,
  useApi = false,
  initialBookmarked,
}: {
  user: any;
  launch: any;
  showToast: (message: string, type: string) => void;
  size?: string;
  showCount?: boolean;
  useApi?: boolean;
  initialBookmarked?: boolean | null;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(() => {
    if (useApi && initialBookmarked != null) return initialBookmarked;
    return user ? bookmarkSvc.isBookmarked(user.id, launch.id) : false;
  });
  const [count, setCount] = useState(() => (useApi ? (launch.bookmarkCount ?? 0) : bookmarkSvc.count(launch.id)));

  const toggle = async () => {
    if (!user) {
      showToast("Sign in to bookmark.", "error");
      return;
    }

    if (useApi) {
      const next = !saved;
      setLoading(true);
      try {
        await bookmarkProduct(launch.id, next);
        setSaved(next);
        setCount((currentCount: number) => (next ? currentCount + 1 : Math.max(0, currentCount - 1)));
        queryClient.setQueriesData({ queryKey: ["products"] }, (products: ProductOut[] | undefined) => {
          if (!products) return products;
          return products.map((product) =>
            product.id === launch.id ? { ...product, bookmarkCount: Math.max(0, product.bookmarkCount + (next ? 1 : -1)) } : product
          );
        });
        showToast(next ? `Saved ${launch.name}` : `Removed ${launch.name}`, next ? "success" : "info");
      } catch {
        showToast("Failed to bookmark. Please try again.", "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = bookmarkSvc.toggle(user.id, launch);
    setSaved(result.saved);
    setCount((currentCount: number) => (result.saved ? currentCount + 1 : Math.max(0, currentCount - 1)));
    showToast(result.saved ? `Saved ${launch.name}` : `Removed ${launch.name}`, result.saved ? "success" : "info");
  };

  return (
    <button
      className={`btn btn-${saved ? "ghost" : "outline"} btn-${size} justify-center ${saved ? "bg-yellow text-black" : "text-black"}`}
      onClick={toggle}
      disabled={loading}
    >
      {loading ? "…" : saved ? "★ Bookmarked" : "☆ Bookmark"}{" "}
      {!loading && showCount && count > 0 && <span className="ml-1.5 font-['Space_Mono',monospace] text-[10px] opacity-70">{count}</span>}
    </button>
  );
};

export default BookmarkButton;
