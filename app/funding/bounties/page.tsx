"use client";

import Link from "next/link";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { useGlobal } from "@/components/GlobalProvider";
import { SEED_BOUNTIES } from "@/data/seed";
import { DB_KEYS, dbNow, dbRead, dbUid, dbWrite } from "@/lib/db-helper";

export default function Page() {
  const { user, showToast } = useGlobal();
  const [applying, setApplying] = useState<string | null>(null);

  const handleApply = (b: { id: string; title: string }) => {
    if (!user) {
      showToast("Sign in to apply for bounties.", "error");
      return;
    }

    setApplying(b.id);

    setTimeout(() => {
      const apps = dbRead(DB_KEYS.APPLICATIONS);
      const exists = apps.find((a: { userId: string; bountyId: string }) => a.userId === user.id && a.bountyId === b.id);

      if (exists) {
        showToast("Already applied.", "info");
        setApplying(null);
        return;
      }

      dbWrite(DB_KEYS.APPLICATIONS, [...apps, { id: dbUid("app"), userId: user.id, bountyId: b.id, status: "pending", appliedAt: dbNow() }]);
      showToast(`Applied for: ${b.title}`, "success");
      setApplying(null);
    }, 500);
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/funding/bounties</div>
        <h1 className="mb-2 text-[48px]">Open Bounties</h1>
        <p className="text-[17px] text-muted">Open research challenges posted by protocol sponsors.</p>
        <hr className="divider" />

        <div className="flex flex-col gap-5.5">
          {SEED_BOUNTIES.map((b) => (
            <WindowCard key={b.id} label={`BOUNTY: ${b.id}`} bodyClass="window-body window-body-blue">
              <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="mb-1.5 text-[20px]">{b.title}</h3>
                  <div className="flex gap-2">
                    <span className="topic-pill">{b.topic}</span>
                    <span className="ftag">{b.sponsor}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[28px] font-bold text-[#E8323C]">{b.reward}</div>
                  <div className="text-xs text-muted">Deadline: {b.deadline}</div>
                </div>
              </div>
              <hr className="divider-sm" />
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted">{b.applicants} applicants</span>
                <button className="btn btn-primary btn-sm" onClick={() => handleApply(b)} disabled={applying === b.id}>
                  {applying === b.id ? <span className="spinner" /> : "Apply →"}
                </button>
              </div>
            </WindowCard>
          ))}
        </div>

        <div className="mt-11">
          <WindowCard label="POST_BOUNTY.SYS" bodyClass="window-body window-body-yellow">
            <h3 className="mb-2.5 text-[22px]">Post a Bounty</h3>
            <p className="mb-4.5 text-[15px] leading-[1.6] text-muted">
              Protocols post research challenges. Researchers compete. Best work gets funded.
            </p>
            <Link className="btn btn-primary" href="/funding/bounties/post">
              Post a Bounty →
            </Link>
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
