"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import WindowCard from "@/components/ui/WindowCard";
import { unsubscribe } from "@/features/subscriber";
import type { UnsubscribeResult } from "@/features/subscriber";

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [result, setResult] = useState<UnsubscribeResult | null>(null);

  useEffect(() => {
    if (!token) return;
    unsubscribe(token).then(setResult);
  }, [token]);

  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/unsubscribe</div>
      <h1 className="mb-2 text-[48px]">Unsubscribe</h1>
      <p className="mb-0 text-[17px] text-muted">Manage your email preferences.</p>
      <hr className="divider" />

      <div className="max-w-lg">
        {!token ? (
          <WindowCard label="UNSUBSCRIBE.SYS">
            <p className="text-sm text-muted">
              No unsubscribe token found. Please use the link from your email.
            </p>
          </WindowCard>
        ) : result === null ? (
          <WindowCard label="UNSUBSCRIBE.SYS">
            <div className="flex items-center gap-3">
              <span className="spinner" />
              <p className="text-sm text-muted">Processing your request…</p>
            </div>
          </WindowCard>
        ) : result.status === "unsubscribed" ? (
          <WindowCard label="UNSUBSCRIBE.SYS" bodyClass="window-body window-body-yellow">
            <p className="mb-1 text-base font-semibold">You&apos;ve been unsubscribed.</p>
            <p className="mb-5 text-sm text-muted">
              You won&apos;t receive any more emails from AthenaX.
            </p>
            <Link className={buttonVariants()} href="/">
              Back to Home →
            </Link>
          </WindowCard>
        ) : result.status === "invalid_token" ? (
          <WindowCard label="UNSUBSCRIBE.SYS">
            <p className="mb-1 text-base font-semibold">Invalid link.</p>
            <p className="text-sm text-muted">
              This unsubscribe link is invalid or has already been used.
            </p>
          </WindowCard>
        ) : (
          <WindowCard label="UNSUBSCRIBE.SYS">
            <p className="mb-4 text-sm text-danger">{result.message}</p>
            <Button variant="outline" onClick={() => unsubscribe(token).then(setResult)}>
              Retry
            </Button>
          </WindowCard>
        )}
      </div>
    </div>
  );
}
