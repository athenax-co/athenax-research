"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import { useSignup, useResendVerification } from "@/hooks/queries/useAuth";
import { useGlobal } from "@/components/GlobalProvider";
import type { UserRole } from "@/types/auth";

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: any) => void;
  showToast: (text: string, type: string) => void;
}

const ROLE_OPTIONS: { role: UserRole; label: string; sub: string }[] = [
  { role: "researcher", label: "Researcher",  sub: "Publish research, join the network" },
  { role: "founder",    label: "Founder",     sub: "Launch your product, attract users and investors" },
  { role: "investor",   label: "Investor",    sub: "Access Terminal, discover founders early" },
  { role: "user",       label: "Company",     sub: "Post roles, sponsor research, list products" },
  { role: "user",       label: "Developer",   sub: "Browse launches, bookmark products, follow topics" },
  { role: "user",       label: "User",        sub: "Explore research, follow topics, stay informed" },
];

export default function RegisterModal({ open, onOpenChange, showToast }: RegisterDialogProps) {
  const { handleAuthClick } = useGlobal();
  const [step, setStep] = useState<1 | 2 | "verify">(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "researcher" as UserRole,
    selectedCardIndex: 0,
  });

  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const set = (k: string) => (e: { target: { value: any } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const step2Error = (): string | null => {
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
    setTimeout(() => {
      setStep(1);
      resetSignup();
    }, 300);
  };

  const handleNext = () => {
    if (step2Error()) return;
    resetSignup();
    signup({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    });
  };

  const title = step === "verify" ? "VERIFY_EMAIL.SYS" : "JOIN_NETWORK.SYS";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTrafficLights />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogClose />
        </DialogHeader>

        <DialogBody>
          {step === "verify" ? (
            <div className="text-center">
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
            </div>
          ) : (
            <>
              <div className="font-mono text-[11px] text-muted mb-4 tracking-widest">STEP {step} OF 2</div>

              {step === 1 ? (
                <>
                  <p className="text-[13px] text-muted mb-4">Choose your role — this sets up your AthenaX experience.</p>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {ROLE_OPTIONS.map((opt, i) => {
                      const selected = form.selectedCardIndex === i;
                      return (
                        <button
                          key={i}
                          onClick={() => setForm((f) => ({ ...f, role: opt.role, selectedCardIndex: i }))}
                          className="p-3 border-2 rounded-xl text-left transition-all duration-100 cursor-pointer"
                          style={{
                            background: selected ? "#FEF3C7" : "#fff",
                            borderColor: selected ? "#1C1C27" : "rgba(28,28,39,0.2)",
                            boxShadow: selected ? "3px 3px 0 #1C1C27" : "none",
                          }}
                        >
                          <div className="text-[13px] font-bold text-ink mb-0.5">{opt.label}</div>
                          <div className="text-[11px] text-muted leading-snug">{opt.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                  <button className="btn btn-primary w-full justify-center" onClick={() => setStep(2)}>
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
                  {step2Error() && form.confirm && <div className="inp-error">{step2Error()}</div>}
                  {signupError && <div className="inp-error">{signupError.message}</div>}

                  <div className="flex gap-2.5 mt-1">
                    <button className="btn btn-ghost" onClick={() => { setStep(1); resetSignup(); }}>
                      ← Back
                    </button>
                    <button className="btn btn-primary flex-1 justify-center" onClick={handleNext} disabled={signingUp}>
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
            </>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
