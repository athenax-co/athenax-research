// ═══════════════════════════════════════════════════════════
// PROFILE PAGE

import { NEWSLETTERS } from "@/data/seed";
import Footer from "../Footer";
import WindowCard from "../ui/WindowCard";
import ArsBreakdown from "../ui/ArsBreakdown";
import { useState } from "react";
import { authSvc, calcARS } from "@/lib/db-helper";
import { IconPaperSmall } from "../Icons";
import NewsletterCard from "../ui/NewsletterCard";

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

const ProfilePage = ({ user, setPage, showToast, onUserUpdate }: { user: any; setPage: any; showToast: any; onUserUpdate: any }) => {
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
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
        <h1 style={{ fontSize: 42, marginBottom: 8 }}>Profile</h1>
        <hr className="divider" />
        <div className="grid-2" style={{ gap: 22, alignItems: "flex-start" }}>
          <div>
            <WindowCard label="IDENTITY.SYS" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#F5D94E",
                    border: "2px solid #1C1C27",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    fontWeight: 700,
                  }}
                >
                  {user.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</div>
                  <div style={{ fontSize: 13, color: "#6B6B7A" }}>{user.email}</div>
                  <span className="ftag" style={{ marginTop: 4, display: "inline-block" }}>
                    {user.role}
                  </span>
                </div>
              </div>
              {!editing || !editForm ? (
                <>
                  {researcher && (
                    <p style={{ fontSize: 14, color: "#6B6B7A", lineHeight: 1.6, marginBottom: 12 }}>{researcher.bio || "No bio yet."}</p>
                  )}
                  {researcher && (
                    <div style={{ fontSize: 13, color: "#6B6B7A" }}>
                      {researcher.university} · {researcher.lab}
                    </div>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 14 }}
                    onClick={() => {
                      setEditing(true);
                      startEdit();
                    }}
                  >
                    Edit Profile
                  </button>
                  {user.role === "researcher" && (
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => setPage("submit-paper")}>
                      Submit a Paper →
                    </button>
                  )}
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
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-primary btn-sm" onClick={saveEdit}>
                      Save
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                      Cancel
                    </button>
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
                <h3 style={{ fontSize: 18, marginBottom: 12 }}>Sponsor Actions</h3>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", marginBottom: 8, justifyContent: "center" }}
                  onClick={() => setPage("post-bounty")}
                >
                  Post a Bounty
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ width: "100%", marginBottom: 8, justifyContent: "center" }}
                  onClick={() => setPage("bounties")}
                >
                  View Bounties
                </button>
                <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPage("sponsors")}>
                  Sponsor Overview
                </button>
              </WindowCard>
            )}
            <WindowCard label="NEWSLETTERS.SYS" style={{ marginTop: 20 }} bodyClass="window-body window-body-cream">
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>Your Subscriptions</h3>
              {NEWSLETTERS.map((nl) => (
                <NewsletterCard key={nl.id} nl={nl} email={user.email} />
              ))}
            </WindowCard>
          </div>

          <div>
            {papers.length > 0 && (
              <WindowCard label="MY_PAPERS.SYS" style={{ marginBottom: 20 }}>
                {papers.map((p) => (
                  <div key={p.id} className="archive-row" onClick={() => setPage(`paper:${p.id}`)}>
                    <div className="archive-icon" style={{ background: "#F9F5DC" }}>
                      <IconPaperSmall />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="archive-title" style={{ fontSize: 14 }}>
                        {p.title.slice(0, 50)}…
                      </div>
                      <div className="archive-meta">
                        {p.year} // {p.topic}
                      </div>
                    </div>
                  </div>
                ))}
              </WindowCard>
            )}
            <WindowCard label="APPLICATIONS.SYS" bodyClass="window-body window-body-cream">
              {applications.length === 0 ? (
                <div>
                  <p style={{ fontSize: 14, color: "#6B6B7A", marginBottom: 14 }}>No applications yet.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setPage("bounties")}>
                    Browse Bounties →
                  </button>
                </div>
              ) : (
                applications.map((a) => (
                  <div key={a.id} className="archive-row">
                    <div style={{ flex: 1 }}>
                      <div className="archive-title" style={{ fontSize: 14 }}>
                        Bounty {a.bountyId}
                      </div>
                      <div className="archive-meta">
                        {new Date(a.appliedAt).toLocaleDateString()} // {a.status}
                      </div>
                    </div>
                    <span className="ftag" style={{ background: a.status === "pending" ? "#FEF3C7" : "#D4EDDA" }}>
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </WindowCard>
          </div>
        </div>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
};

export default ProfilePage;
