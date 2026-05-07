import { bookmarkProduct } from "@/features/products/api";
import { bookmarkSvc } from "@/utils/lib";
import type { ProductOut } from "@/features/products";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const BookmarkButton = ({
  user,
  launch,
  showToast,
  size = "sm",
  showCount = false,
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
  const [saved, setSaved] = useState(() => {
    if (useApi && initialBookmarked != null) return initialBookmarked;
    return user ? bookmarkSvc.isBookmarked(user.id, launch.id) : false;
  });
  const [count, setCount] = useState(() => (useApi ? (launch.bookmarkCount ?? 0) : bookmarkSvc.count(launch.id)));
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (!user) {
      showToast("Sign in to bookmark.", "error");
      return;
    }

    if (useApi) {
      if (loading) return;
      const previous = saved;
      const previousCount = count;
      const next = !saved;

      setSaved(next);
      setCount(next ? count + 1 : Math.max(0, count - 1));
      setLoading(true);

      try {
        await bookmarkProduct(launch.id, next);
        queryClient.setQueriesData({ queryKey: ["products"] }, (products: ProductOut[] | undefined) => {
          if (!Array.isArray(products)) return products;
          return products.map((p) =>
            p.id === launch.id ? { ...p, bookmarkCount: Math.max(0, p.bookmarkCount + (next ? 1 : -1)) } : p
          );
        });
        showToast(next ? `Saved ${launch.name}` : `Removed ${launch.name}`, next ? "success" : "info");
      } catch {
        setSaved(previous);
        setCount(previousCount);
        showToast("Failed to bookmark. Please try again.", "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    const result = bookmarkSvc.toggle(user.id, launch);
    setSaved(result.saved);
    setCount((c: number) => (result.saved ? c + 1 : Math.max(0, c - 1)));
    showToast(result.saved ? `Saved ${launch.name}` : `Removed ${launch.name}`, result.saved ? "success" : "info");
  };

  return (
    <button
      className={`btn btn-${saved ? "ghost" : "outline"} btn-${size} justify-center ${saved ? "bg-yellow text-black" : "text-black"}`}
      onClick={toggle}
      disabled={loading}
    >
      {saved ? "★ Bookmarked" : "☆ Bookmark"}
      {showCount && count > 0 && <span className="ml-1.5 font-['Space_Mono',monospace] text-[10px] opacity-70">{count}</span>}
    </button>
  );
};

export default BookmarkButton;
