// ═══════════════════════════════════════════════════════════
// PROFILE PAGE

import Link from "next/link";
import { NEWSLETTERS } from "@/data/seed";
import WindowCard from "../ui/WindowCard";
import ArsBreakdown from "../ui/ArsBreakdown";
import { useState, useEffect } from "react";
import { authSvc, calcARS } from "@/lib/db-helper";
import { IconPaperSmall } from "../Icons";
import NewsletterCard from "../ui/NewsletterCard";
import { useResendVerification } from "@/hooks/useAuth";

// ═══════════════════════════════════════════════════════════
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

const ProfilePage = ({ user, showToast, onUserUpdate }: { user: any; showToast: any; onUserUpdate: any }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const { mutate: resend, isPending: resending, isSuccess: resent } = useResendVerification();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const researcher = user?.role === "researcher" ? authSvc.getResearcher(user.id) : null;
  const papers = user ? authSvc.getPapersByUser(user.id) : [];
  const applications: Application[] = user ? authSvc.getApplications(user.id) : [];
  const ars = researcher ? calcARS(researcher) : 0;

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
    if (!editForm) return;
    const updated = authSvc.updateProfile(user.id, editForm);
    onUserUpdate(updated);
    setEditing(false);
    setEditForm(null);
    showToast("Profile updated.", "success");
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
        <h1 className="text-[42px] mb-2">Profile</h1>
        <hr className="divider" />
        <div className="grid-2 gap-5 items-start">
          <div>
            <WindowCard label="IDENTITY.SYS" style={{ marginBottom: 20 }}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full bg-yellow border-2 border-ink flex items-center justify-center text-[22px] font-bold shrink-0">
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
                  {researcher && (
                    <p className="text-sm text-muted leading-relaxed mb-3">{researcher.bio || "No bio yet."}</p>
                  )}
                  {researcher && (
                    <div className="text-[13px] text-muted">
                      {researcher.university} · {researcher.lab}
                    </div>
                  )}
                  {!user.verified && (
                    <div className="mt-4 mb-3 px-3 py-2.5 bg-amber-50 border border-yellow rounded-lg">
                      <p className="text-xs text-amber-800 mb-2">Your email is not verified.</p>
                      {resent && <p className="text-xs text-green-700 mb-1.5">Verification email sent!</p>}
                      <button
                        className="btn btn-ghost btn-sm w-full justify-center"
                        onClick={() => { resend({ email: user.email }); setResendTimer(60); }}
                        disabled={resending || resendTimer > 0}
                      >
                        {resending ? <span className="spinner" /> : resendTimer > 0 ? `Resend link (${resendTimer}s)` : "Resend verification link"}
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => { setEditing(true); startEdit(); }}
                    >
                      Edit Profile
                    </button>
                    {user.role === "researcher" && (
                      <Link href="/submit-paper" className="btn btn-primary btn-sm">
                        Submit a Paper →
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="inp-group">
                    <label className="inp-label">Name</label>
                    <input className="inp" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  {researcher && (
                    <>
                      <div className="inp-group">
                        <label className="inp-label">Bio</label>
                        <textarea className="inp" rows={3} value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
                      </div>
                      <div className="inp-group">
                        <label className="inp-label">University</label>
                        <input
                          className="inp"
                          value={editForm.university}
                          onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                        />
                      </div>
                      <div className="inp-group">
                        <label className="inp-label">Lab</label>
                        <input className="inp" value={editForm.lab} onChange={(e) => setEditForm({ ...editForm, lab: e.target.value })} />
                      </div>
                    </>
                  )}
                  <div className="flex gap-2.5">
                    <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
                  </div>
                </>
              )}
            </WindowCard>

            {user.role === "researcher" && researcher && (
              <WindowCard label="ARS_SCORE.SYS" bodyClass="window-body window-body-yellow">
                <ArsBreakdown r={researcher} />
              </WindowCard>
            )}
            {user.role === "sponsor" && (
              <WindowCard label="SPONSOR_PANEL.SYS" bodyClass="window-body window-body-blue">
                <h3 className="text-lg mb-3">Sponsor Actions</h3>
                <Link href="/post-bounty" className="btn btn-primary btn-sm w-full justify-center flex mb-2">
                  Post a Bounty
                </Link>
                <Link href="/bounties" className="btn btn-ghost btn-sm w-full justify-center flex mb-2">
                  View Bounties
                </Link>
                <Link href="/sponsors" className="btn btn-ghost btn-sm w-full justify-center flex">
                  Sponsor Overview
                </Link>
              </WindowCard>
            )}
            <WindowCard label="NEWSLETTERS.SYS" style={{ marginTop: 20 }} bodyClass="window-body window-body-cream">
              <h3 className="text-lg mb-4">Your Subscriptions</h3>
              <div className="flex flex-col gap-4">
                {NEWSLETTERS.map((nl) => (
                  <NewsletterCard key={nl.id} nl={nl} email={user.email} />
                ))}
              </div>
            </WindowCard>
          </div>

          <div>
            {papers.length > 0 && (
              <WindowCard label="MY_PAPERS.SYS" style={{ marginBottom: 20 }}>
                {papers.map((p) => (
                  <Link key={p.id} href={`/paper/${p.id}`}>
                    <div className="archive-row">
                      <div className="archive-icon bg-paper">
                        <IconPaperSmall />
                      </div>
                      <div className="flex-1">
                        <div className="archive-title text-sm">{p.title.slice(0, 50)}…</div>
                        <div className="archive-meta">
                          {p.year} // {p.topic}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </WindowCard>
            )}
            <WindowCard label="APPLICATIONS.SYS" bodyClass="window-body window-body-cream">
              {applications.length === 0 ? (
                <div>
                  <p className="text-sm text-muted mb-3.5">No applications yet.</p>
                  <Link href="/bounties" className="btn btn-primary btn-sm">
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
                    <span className={`ftag ${a.status === "pending" ? "bg-amber-100" : "bg-success"}`}>
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </WindowCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
