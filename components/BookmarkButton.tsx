import { bookmarkSvc } from "@/utils/lib";
import { useState } from "react";

const BookmarkButton = ({
  user,
  launch,
  showToast,
  size = "sm",
  showCount = true,
}: {
  user: any;
  launch: any;
  showToast: (message: string, type: string) => void;
  size?: string;
  showCount?: boolean;
}) => {
  const [saved, setSaved] = useState(() => (user ? bookmarkSvc.isBookmarked(user.id, launch.id) : false));
  const [count, setCount] = useState(() => bookmarkSvc.count(launch.id));
  const toggle = () => {
    if (!user) {
      showToast("Sign in to bookmark.", "error");
      return;
    }
    const r = bookmarkSvc.toggle(user.id, launch);
    setSaved(r.saved);
    setCount((c: number) => (r.saved ? c + 1 : Math.max(0, c - 1)));
    showToast(r.saved ? `Saved ${launch.name}` : `Removed ${launch.name}`, r.saved ? "success" : "info");
  };
  return (
    <button className={`btn btn-${saved ? "ghost" : "outline"} btn-${size}`} style={saved ? { background: "#F5D94E" } : {}} onClick={toggle}>
      {saved ? "★" : "☆"}{" "}
      {showCount && count > 0 && <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, marginLeft: 3, opacity: 0.7 }}>{count}</span>}
    </button>
  );
};

export default BookmarkButton;
