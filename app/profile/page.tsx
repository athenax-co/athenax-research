"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NEWSLETTERS } from "@/data/seed";
import WindowCard from "@/components/ui/WindowCard";
import ArsBreakdown from "@/components/ui/ArsBreakdown";
import { authSvc } from "@/lib/db-helper";
import NewsletterCard from "@/components/ui/NewsletterCard";
import ProfileSubmissions from "@/components/ProfileSubmissions";
import { useGlobal } from "@/components/GlobalProvider";
import { useResendVerification } from "@/hooks/queries/useAuth";
import { useUpdateProfile } from "@/hooks/queries/useProfile";

type EditForm = {
  name: string;
  bio: string;
  university: string;
  lab: string;
  organization: string;
};

type Application = {
  id: string;
  bountyId: string;
  appliedAt: string;
  status: string;
};

export default function Page() {
  const { user, showToast } = useGlobal();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const { mutate: resend, isPending: resending, isSuccess: resent } = useResendVerification();
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile(user?.id ?? 0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const researcher = user?.role === "researcher" ? authSvc.getResearcher(user.id) : null;
  const applications: Application[] = user ? authSvc.getApplications(user.id) : [];

  const startEdit = () =>
    setEditForm({
      name: user.name,
      bio: researcher?.bio || "",
      university: researcher?.university || "",
      lab: researcher?.lab || "",
      organization: user.organization || "",
    });
  const cancelEdit = () => {
    setEditing(false);
    setEditForm(null);
  };
  const saveEdit = () => {
    if (!editForm || !user) return;
    updateProfile(
      { name: editForm.name },
      {
        onSuccess: () => {
          setEditing(false);
          setEditForm(null);
          showToast("Profile updated.", "success");
        },
        onError: () => showToast("Failed to update profile.", "error"),
      }
    );
  };

  if (!user)
    return (
      <div className="page-wrap section">
        <p>Please sign in.</p>
      </div>
    );

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/profile</div>
        <h1 className="mb-2 text-[42px]">Profile</h1>
        <hr className="divider" />
        <div className="grid-2 items-start gap-5">
          <div>
            <WindowCard label="IDENTITY.SYS" className="mb-5">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-yellow text-[22px] font-bold">
                  {user.avatar}
                </div>
                <div>
                  <div className="text-xl font-bold">{user.name}</div>
                  <div className="text-[13px] text-muted">{user.email}</div>
                  <span className="ftag mt-1 inline-block">{user.role}</span>
                </div>
              </div>

              {!editing || !editForm ? (
                <>
                  {researcher && <p className="mb-3 text-sm leading-relaxed text-muted">{researcher.bio || "No bio yet."}</p>}
                  {researcher && (
                    <div className="text-[13px] text-muted">
                      {researcher.university} · {researcher.lab}
                    </div>
                  )}
                  {!user.verified && (
                    <div className="mb-3 mt-4 rounded-lg border border-yellow bg-amber-50 px-3 py-2.5">
                      <p className="mb-2 text-xs text-amber-800">Your email is not verified.</p>
                      {resent && <p className="mb-1.5 text-xs text-green-700">Verification email sent!</p>}
                      <button
                        className="btn btn-ghost btn-sm w-full justify-center"
                        onClick={() => {
                          resend({ email: user.email });
                          setResendTimer(60);
                        }}
                        disabled={resending || resendTimer > 0}
                      >
                        {resending ? <span className="spinner" /> : resendTimer > 0 ? `Resend link (${resendTimer}s)` : "Resend verification link"}
                      </button>
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditing(true);
                        startEdit();
                      }}
                    >
                      Edit Profile
                    </button>
                    {/* {user.role === "researcher" && (
                      <Link href="/paper/submit" className="btn btn-primary btn-sm">
                        Submit a Paper →
                      </Link>
                    )} */}
                  </div>
                </>
              ) : (
                <>
                  <div className="inp-group">
                    <label className="inp-label">Name</label>
                    <input className="inp" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="flex gap-2.5">
                    <button className="btn btn-primary btn-sm" onClick={saveEdit} disabled={saving}>
                      {saving ? <span className="spinner" /> : "Save"}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </WindowCard>

            {user.role === "researcher" && researcher && (
              <WindowCard label="ARS_SCORE.SYS" bodyClass="window-body window-body-yellow" className="mb-5">
                <ArsBreakdown r={researcher} />
              </WindowCard>
            )}
            {user.role === "sponsor" && (
              <WindowCard label="SPONSOR_PANEL.SYS" bodyClass="window-body window-body-blue" className="mb-5">
                <h3 className="mb-3 text-lg">Sponsor Actions</h3>
                <Link href="/funding/bounties/post" className="btn btn-primary btn-sm mb-2 flex w-full justify-center">
                  Post a Bounty
                </Link>
                <Link href="/funding/bounties" className="btn btn-ghost btn-sm mb-2 flex w-full justify-center">
                  View Bounties
                </Link>
                <Link href="/sponsors" className="btn btn-ghost btn-sm flex w-full justify-center">
                  Sponsor Overview
                </Link>
              </WindowCard>
            )}
            <WindowCard label="NEWSLETTERS.SYS" bodyClass="window-body window-body-cream" className="mt-5">
              <h3 className="mb-4 text-lg">Your Subscriptions</h3>
              <div className="flex flex-col gap-4">
                {NEWSLETTERS.map((nl) => (
                  <NewsletterCard key={nl.id} nl={nl} email={user.email} />
                ))}
              </div>
            </WindowCard>
          </div>

          <div>
            <ProfileSubmissions user={user} />
            <WindowCard label="APPLICATIONS.SYS" bodyClass="window-body window-body-cream">
              {applications.length === 0 ? (
                <div>
                  <p className="mb-3.5 text-sm text-muted">No applications yet.</p>
                  <Link href="/funding/bounties" className="btn btn-primary btn-sm">
                    Browse Bounties →
                  </Link>
                </div>
              ) : (
                applications.map((a) => (
                  <div key={a.id} className="archive-row">
                    <div className="flex-1">
                      <div className="archive-title text-sm">Bounty {a.bountyId}</div>
                      <div className="archive-meta">
                        {new Date(a.appliedAt).toLocaleDateString()} // {a.status}
                      </div>
                    </div>
                    <span className={`ftag ${a.status === "pending" ? "bg-amber-100" : "bg-success"}`}>{a.status}</span>
                  </div>
                ))
              )}
            </WindowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
