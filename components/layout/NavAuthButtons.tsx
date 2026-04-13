"use client";

import Link from "next/link";
import { useGlobal } from "@/components/GlobalProvider";
import NotificationBell from "@/components/layout/NotificationBell";

export const NavAuthDesktop = () => {
  const { user, handleAuthClick } = useGlobal();

  return (
    <div className="hidden md:flex items-center gap-1.5">
      {user ? (
        <>
          <NotificationBell user={user} />
          {user.role === "admin" && (
            <Link className="btn btn-ghost btn-sm text-[#E8323C] no-underline" href="/admin">
              Admin
            </Link>
          )}
          {["sponsor", "admin"].includes(user.role) && (
            <Link className="btn btn-ghost btn-sm no-underline" href="/sponsors/dashboard">
              Sponsor
            </Link>
          )}
          <Link className="btn btn-ghost btn-sm no-underline" href="/dashboard">
            Dashboard
          </Link>
          <Link className="btn btn-ghost btn-sm no-underline" href="/profile">
            <span className="size-5.5 rounded-full bg-yellow border-[1.5px] border-ink inline-flex items-center justify-center text-[11px] font-bold shrink-0">
              {user.avatar}
            </span>
            {user.name.split(" ")[0]}
          </Link>
          <button className="btn btn-outline btn-sm" onClick={() => handleAuthClick("logout")}>
            Out
          </button>
        </>
      ) : (
        <>
          <button className="btn btn-primary btn-sm" onClick={() => handleAuthClick("login")}>
            Sign In
          </button>
        </>
      )}
    </div>
  );
};

export const NavAuthMobile = ({ onCloseAction }: { onCloseAction: () => void }) => {
  const { user, handleAuthClick } = useGlobal();
  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div className="mt-2 pt-4 border-t-2 border-[#D8D4CC] flex flex-col gap-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-ink/40 px-4 mb-1">Account</p>
      {user ? (
        <>
          <Link
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-ink bg-paper shadow-[3px_3px_0_#1C1C27] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_#1C1C27] no-underline transition-all duration-100"
            href="/profile"
            onClick={onCloseAction}
          >
            <span className="size-10 rounded-full bg-yellow border-2 border-ink inline-flex items-center justify-center text-[15px] font-bold text-ink shrink-0">
              {user.avatar}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[16px] font-semibold text-ink">Profile</span>
              <span className="truncate text-[12px] text-ink/55">{firstName}&rsquo;s account</span>
            </span>
            <span className="text-[18px] font-semibold text-ink/45" aria-hidden="true">
              &rarr;
            </span>
          </Link>
          <Link
            className="flex flex-col px-4 py-3 rounded-xl border-2 border-transparent hover:border-ink/20 hover:bg-ink/5 no-underline transition-all duration-100"
            href="/dashboard"
            onClick={onCloseAction}
          >
            <span className="text-[16px] font-semibold text-ink">Dashboard</span>
          </Link>
          {user.role === "admin" && (
            <Link
              className="flex flex-col px-4 py-3 rounded-xl border-2 border-transparent hover:border-ink/20 hover:bg-ink/5 no-underline transition-all duration-100"
              href="/admin"
              onClick={onCloseAction}
            >
              <span className="text-[16px] font-semibold text-[#E8323C]">Admin</span>
            </Link>
          )}
          {["sponsor", "admin"].includes(user.role) && (
            <Link
              className="flex flex-col px-4 py-3 rounded-xl border-2 border-transparent hover:border-ink/20 hover:bg-ink/5 no-underline transition-all duration-100"
              href="/sponsors/dashboard"
              onClick={onCloseAction}
            >
              <span className="text-[16px] font-semibold text-ink">Sponsor Dashboard</span>
            </Link>
          )}
          <button
            className="btn btn-outline justify-center mt-2"
            onClick={() => {
              onCloseAction();
              handleAuthClick("logout");
            }}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary justify-center"
            onClick={() => {
              onCloseAction();
              handleAuthClick("login");
            }}
          >
            Sign In
          </button>
        </>
      )}
    </div>
  );
};

export const NavAuthMobileShortcut = () => {
  const { user, handleAuthClick } = useGlobal();

  return (
    <>
      {user ? (
        <>
          <NotificationBell user={user} />
        </>
      ) : (
        <button className="btn btn-primary btn-sm" onClick={() => handleAuthClick("login")}>
          Sign In
        </button>
      )}
    </>
  );
};
