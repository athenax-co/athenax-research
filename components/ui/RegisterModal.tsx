"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import { useSignup, useResendVerification } from "@/hooks/useAuth";
import { useGlobal } from "@/components/GlobalProvider";
import { useUniversities, useLabs } from "@/hooks/useReference";
import type { UserRole, InvestorType } from "@/lib/auth-api";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: any) => void;
  showToast: (text: string, type: string) => void;
}

export default function RegisterModal({ open, onOpenChange, showToast }: RegisterDialogProps) {
  const { handleAuthClick } = useGlobal();
  const [step, setStep] = useState<1 | 2 | "verify">(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "user" as UserRole,
    // researcher
    universityId: "",
    labId: "",
    bio: "",
    // sponsor
    sponsorBio: "",
    amount: "",
    // investor
    investorType: "VC" as InvestorType,
    balance: "",
  });

  const [resendTimer, setResendTimer] = useState(0);

  // ── reference data ────────────────────────────────────────────────────────
  const { data: universities = [] } = useUniversities();
  const { data: allLabs = [] } = useLabs();

  const filteredLabs = form.universityId
    ? allLabs.filter((l) => l.universityId === Number(form.universityId))
    : allLabs;

  // ── resend timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const set = (k: string) => (e: { target: { value: any } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // ── validation ────────────────────────────────────────────────────────────
  const step1Error = (): string | null => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.includes("@")) return "Valid email required.";
    if (form.password.length < 6) return "Password must be 6+ characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  // ── mutations ─────────────────────────────────────────────────────────────
  const {
    mutate: signup,
    isPending: signingUp,
    error: signupError,
    reset: resetSignup,
  } = useSignup({
    onSuccess: () => {
      setStep("verify");
      setResendTimer(60);
      showToast("Account created! Please verify your email.", "success");
    },
  });

  const { mutate: resend, isPending: resending, isSuccess: resent, error: resendError } = useResendVerification();

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      resetSignup();
    }, 300);
  };

  const handleNext = () => {
    if (step1Error()) return;
    resetSignup();
    setStep(2);
  };

  const handleSubmit = () => {
    const base = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    };

    if (form.role === "researcher") {
      signup({
        ...base,
        researcherProfile: {
          labId: form.labId ? Number(form.labId) : null,
          bio: form.bio.trim() || null,
        },
      });
    } else if (form.role === "sponsor") {
      signup({
        ...base,
        sponsorProfile: {
          bio: form.sponsorBio.trim() || null,
          amount: form.amount ? Number(form.amount) : null,
        },
      });
    } else if (form.role === "investor") {
      signup({
        ...base,
        investorProfile: {
          investorType: form.investorType,
          balance: form.balance ? Number(form.balance) : null,
        },
      });
    } else {
      signup(base);
    }
  };

  // ── verify state ─────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-1">
              <DialogTrafficLights />
              <DialogTitle>VERIFY_EMAIL.SYS</DialogTitle>
            </div>
            <DialogClose />
          </DialogHeader>

          <DialogBody className="text-center">
            <div className="text-4xl mb-3">✉️</div>
            <p className="text-sm text-subtle leading-relaxed">
              We&apos;ve sent a verification link to <strong className="text-ink">{form.email}</strong>.
            </p>
            <p className="mt-2 text-xs text-muted">Click the link in the email to activate your account.</p>

            {resendError && <div className="inp-error mt-3">{resendError.message}</div>}
            {resent && <div className="text-green-600 text-xs mt-3">Email resent!</div>}

            <button
              className="btn btn-ghost btn-sm w-full justify-center mt-4"
              onClick={() => { resend({ email: form.email.trim() }); setResendTimer(60); }}
              disabled={resending || resendTimer > 0}
            >
              {resending ? <span className="spinner" /> : resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Resend verification email"}
            </button>
            <button className="btn btn-primary w-full justify-center mt-2.5" onClick={handleClose}>
              Done →
            </button>
          </DialogBody>
        </DialogContent>
      </Dialog>
    );
  }

  // ── step 1 & 2 ────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTrafficLights />
            <DialogTitle>JOIN_NETWORK.SYS</DialogTitle>
          </div>
          <DialogClose />
        </DialogHeader>

        <DialogBody>
          <div className="font-mono text-[11px] text-muted mb-4 tracking-widest">STEP {step} OF 2</div>

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
                <input
                  className="inp"
                  type="password"
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Repeat password"
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                />
              </div>
              {step1Error() && form.confirm && <div className="inp-error">{step1Error()}</div>}
              <button className="btn btn-primary w-full justify-center mt-1" onClick={handleNext}>
                Next →
              </button>
              <p className="text-xs text-muted text-center mt-5">
                Already have an account?{" "}
                <button
                  className="font-semibold text-ink hover:text-danger transition-colors"
                  onClick={() => { handleClose(); setTimeout(() => handleAuthClick("login"), 150); }}
                >
                  Sign in →
                </button>
              </p>
            </>
          ) : (
            <>
              {/* Role */}
              <div className="inp-group">
                <label className="inp-label">I am a</label>
                <select className="inp" value={form.role} onChange={set("role")}>
                  <option value="user">User</option>
                  <option value="researcher">Researcher</option>
                  <option value="sponsor">Protocol Sponsor</option>
                  <option value="founder">Founder</option>
                  <option value="investor">Investor</option>
                </select>
              </div>

              {/* Researcher fields */}
              {form.role === "researcher" && (
                <>
                  <div className="inp-group">
                    <label className="inp-label">University</label>
                    <select
                      className="inp"
                      value={form.universityId}
                      onChange={(e) => setForm((f) => ({ ...f, universityId: e.target.value, labId: "" }))}
                    >
                      <option value="">Select university…</option>
                      {universities.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="inp-group">
                    <label className="inp-label">Research Lab</label>
                    <select className="inp" value={form.labId} onChange={set("labId")} disabled={filteredLabs.length === 0}>
                      <option value="">Select lab…</option>
                      {filteredLabs.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="inp-group">
                    <label className="inp-label">Bio</label>
                    <textarea className="inp" value={form.bio} onChange={set("bio")} placeholder="Brief research focus…" rows={3} />
                  </div>
                </>
              )}

              {/* Sponsor fields */}
              {form.role === "sponsor" && (
                <>
                  <div className="inp-group">
                    <label className="inp-label">Bio</label>
                    <textarea className="inp" value={form.sponsorBio} onChange={set("sponsorBio")} placeholder="About your sponsorship…" rows={3} />
                  </div>
                  <div className="inp-group">
                    <label className="inp-label">Funding Amount (optional)</label>
                    <input className="inp" type="number" min={0} value={form.amount} onChange={set("amount")} placeholder="e.g. 50000" />
                  </div>
                </>
              )}

              {/* Investor fields */}
              {form.role === "investor" && (
                <>
                  <div className="inp-group">
                    <label className="inp-label">Investor Type</label>
                    <select className="inp" value={form.investorType} onChange={set("investorType")}>
                      <option value="VC">VC</option>
                      <option value="Angel">Angel</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Family Office">Family Office</option>
                    </select>
                  </div>
                  <div className="inp-group">
                    <label className="inp-label">Balance (optional)</label>
                    <input className="inp" type="number" min={0} value={form.balance} onChange={set("balance")} placeholder="e.g. 500000" />
                  </div>
                </>
              )}

              {signupError && <div className="inp-error">{signupError.message}</div>}

              <div className="flex gap-2.5 mt-1">
                <button className="btn btn-ghost" onClick={() => { setStep(1); resetSignup(); }}>
                  ← Back
                </button>
                <button className="btn btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={signingUp}>
                  {signingUp ? <span className="spinner" /> : "Join Network →"}
                </button>
              </div>

              <p className="text-xs text-muted text-center mt-5">
                Already have an account?{" "}
                <button
                  className="font-semibold text-ink hover:text-danger transition-colors"
                  onClick={() => { handleClose(); setTimeout(() => handleAuthClick("login"), 150); }}
                >
                  Sign in →
                </button>
              </p>
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
