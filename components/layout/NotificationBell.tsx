"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatShortDate, notifSvc } from "@/utils/lib";
import Link from "next/link";

type NotificationBellProps = {
  user: {
    id: string;
  } | null;
};

export default function NotificationBell({ user }: NotificationBellProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

  const notifs = useMemo(() => {
    if (!user) return [];
    if (refreshTick < 0) return [];
    return notifSvc.getAll(user.id);
  }, [user, refreshTick]);

  const unread = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  if (!user) return null;

  const togglePanel = () => {
    if (!open) {
      notifSvc.markRead(user.id);
      setRefreshTick((value) => value + 1);
    }
    setOpen((value) => !value);
  };

  const handleNotificationClick = (id: string) => {
    notifSvc.markOne(id);
    setRefreshTick((value) => value + 1);
    setOpen(false);
    router.push("/launch");
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        className="btn btn-ghost btn-sm relative px-2.5"
        onClick={togglePanel}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute right-0.5 top-0.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full border-[1.5px] border-cream bg-[#E8323C] px-1 text-[8px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-300 w-80 rounded-xl border-2 border-ink bg-cream shadow-[5px_5px_0_#1C1C27]">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#D8D4CC] px-4 py-3">
            <span className="font-['Space_Mono',monospace] text-[11px] tracking-[0.06em]">NOTIFICATIONS</span>
            <button className="text-base text-muted" onClick={() => setOpen(false)} aria-label="Close notifications">
              ×
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="px-4 py-5 text-center font-['Space_Mono',monospace] text-[13px] text-muted">
                No notifications yet.
                <br />
                Follow researchers to get started.
              </div>
            ) : (
              notifs.map((notification) => (
                <button
                  key={notification.id}
                  className={`w-full cursor-pointer border-0 border-b border-[#D8D4CC] px-4 py-3 text-left ${
                    notification.read ? "bg-transparent" : "bg-[#FEF3C7]"
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="text-[13px] leading-normal text-ink">{notification.text}</div>
                  <div className="mt-1 font-['Space_Mono',monospace] text-[10px] text-muted">
                    {notification.kind.toUpperCase()} · {formatShortDate(notification.createdAt)}
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t-[1.5px] border-[#D8D4CC] px-4 py-2.5">
            <Link href={"/profile"}
              className="text-xs font-medium text-ink underline-offset-2 hover:underline"
            >
              Manage follows →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
