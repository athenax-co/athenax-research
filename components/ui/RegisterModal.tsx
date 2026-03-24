"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import { useSignup, useResendVerification } from "@/hooks/useAuth";
import { useGlobal } from "@/components/GlobalProvider";
import { Roles } from "@/lib/auth-api";

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
    role: "user" as Roles,
    university: "",
    lab: "",
    bio: "",
    organization: "",
  });

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const set = (k: string) => (e: { target: { value: any } }) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const step1Error = (): string | null => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.includes("@")) return "Valid email required.";
    if (form.password.length < 6) return "Password must be 6+ characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

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

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after the close animation
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
    signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role as Roles,
    });
  };

  // ── "check your email" state ───────────────────────────────────────────────
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
            <p className="text-sm text-[#3a3a4a] leading-relaxed">
              We&apos;ve sent a verification link to <strong className="text-[#1c1c27]">{form.email}</strong>.
            </p>
            <p className="mt-2 text-xs text-[#6B6B7A]">Click the link in the email to activate your account.</p>

            {resendError && <div className="inp-error mt-3">{resendError.message}</div>}
            {resent && <div className="text-green-600 text-xs mt-3">Email resent!</div>}

            <button
              className="btn btn-ghost btn-sm w-full justify-center mt-4"
              onClick={() => {
                resend({ email: form.email.trim() });
                setResendTimer(60);
              }}
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
          <div className="font-mono text-[11px] text-[#6B6B7A] mb-4 tracking-widest">STEP {step} OF 2</div>

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

              <p className="text-xs text-[#6B6B7A] text-center mt-5">
                Already have an account?{" "}
                <button
                  className="font-semibold text-[#1c1c27] hover:text-[#e8323c] transition-colors"
                  onClick={() => {
                    handleClose();
                    setTimeout(() => handleAuthClick("login"), 150);
                  }}
                >
                  Sign in →
                </button>
              </p>
            </>
          ) : (
            <>
              <div className="inp-group">
                <label className="inp-label">I am a</label>
                <select className="inp" value={form.role} onChange={set("role")}>
                  <option value="user">User</option>
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

              {signupError && <div className="inp-error">{signupError.message}</div>}

              <div className="flex gap-2.5 mt-1">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setStep(1);
                    resetSignup();
                  }}
                >
                  ← Back
                </button>
                <button className="btn btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={signingUp}>
                  {signingUp ? <span className="spinner" /> : "Join Network →"}
                </button>
              </div>

              <p className="text-xs text-[#6B6B7A] text-center mt-5">
                Already have an account?{" "}
                <button
                  className="font-semibold text-[#1c1c27] hover:text-[#e8323c] transition-colors"
                  onClick={() => {
                    handleClose();
                    setTimeout(() => handleAuthClick("login"), 150);
                  }}
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
