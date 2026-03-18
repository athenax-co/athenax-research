// ═══════════════════════════════════════════════════════════
// REGISTER MODAL

import { useState } from "react";
import Modal from "./Modal";
import { authSvc } from "@/lib/db-helper";

// ═══════════════════════════════════════════════════════════
const RegisterModal = ({
  onClose,
  onSuccess,
  showToast,
}: {
  onClose: () => void;
  onSuccess: (user: any) => void;
  showToast: (text: string, type: string) => void;
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "researcher",
    university: "",
    lab: "",
    bio: "",
    organization: "",
  });
  const set = (k: string) => (e: { target: { value: any } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const step1ok = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.includes("@")) return "Valid email required.";
    if (form.password.length < 6) return "Password must be 6+ characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const submit = () => {
    if (step === 1) {
      const e = step1ok();
      if (e) {
        setError(e);
        return;
      }
      setError("");
      setStep(2);
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      const r = authSvc.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        university: form.university,
        lab: form.lab,
        bio: form.bio,
        organization: form.organization,
      });
      setLoading(false);
      if (r.error) {
        setError(r.error);
        return;
      }
      onSuccess(r.user);
      onClose();
      showToast(`Welcome to AthenaX, ${r.user.name.split(" ")[0]}!`, "success");
    }, 500);
  };

  return (
    <Modal title="JOIN_NETWORK.SYS" onClose={onClose}>
      <div style={{ fontSize: 11, fontFamily: "'Space Mono',monospace", color: "#6B6B7A", marginBottom: 16, letterSpacing: "0.04em" }}>
        STEP {step} OF 2
      </div>
      {step === 1 ? (
        <>
          <div className="inp-group">
            <label className="inp-label">Full Name</label>
            <input className="inp" value={form.name} onChange={set("name")} placeholder="Dr. Jane Smith" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Email</label>
            <input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="jane@university.edu" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Password</label>
            <input className="inp" type="password" value={form.password} onChange={set("password")} placeholder="6+ characters" />
          </div>
          <div className="inp-group">
            <label className="inp-label">Confirm Password</label>
            <input className="inp" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" />
          </div>
        </>
      ) : (
        <>
          <div className="inp-group">
            <label className="inp-label">I am a</label>
            <select className="inp" value={form.role} onChange={set("role")}>
              <option value="researcher">Researcher</option>
              <option value="sponsor">Protocol Sponsor</option>
              <option value="builder">Builder</option>
            </select>
          </div>
          {form.role === "researcher" && (
            <>
              <div className="inp-group">
                <label className="inp-label">University</label>
                <input className="inp" value={form.university} onChange={set("university")} placeholder="MIT, Oxford, Stanford…" />
              </div>
              <div className="inp-group">
                <label className="inp-label">Research Lab</label>
                <input className="inp" value={form.lab} onChange={set("lab")} placeholder="Your lab or group" />
              </div>
              <div className="inp-group">
                <label className="inp-label">Bio</label>
                <textarea className="inp" value={form.bio} onChange={set("bio")} placeholder="Brief research focus…" rows={3} />
              </div>
            </>
          )}
          {(form.role === "sponsor" || form.role === "builder") && (
            <div className="inp-group">
              <label className="inp-label">Organization</label>
              <input className="inp" value={form.organization} onChange={set("organization")} placeholder="Protocol / company name" />
            </div>
          )}
        </>
      )}
      {error && <div className="inp-error">{error}</div>}
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {step === 2 && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              setStep(1);
              setError("");
            }}
          >
            ← Back
          </button>
        )}
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={submit} disabled={loading}>
          {loading ? <span className="spinner" /> : step === 1 ? "Next →" : "Join Network →"}
        </button>
      </div>
    </Modal>
  );
};

export default RegisterModal;
