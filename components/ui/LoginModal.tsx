"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import { useLogin, useResendVerification } from "@/hooks/queries/useAuth";
import { useGlobal } from "@/components/GlobalProvider";
import Link from "next/link";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (user: any) => void;
  showToast: (message: string, type: string) => void;
}

export default function LoginModal({ open, onOpenChange, onSuccess, showToast }: LoginDialogProps) {
  const { handleAuthClick } = useGlobal();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const {
    mutate: login,
    isPending,
    error,
    reset,
  } = useLogin({
    onSuccess: () => {
      // Session query is invalidated by useLogin; keep user source-of-truth there.
      onSuccess(undefined);
      onOpenChange(false);
      showToast("Welcome back!", "success");
      setEmail("");
      setPw("");
      reset();
    },
  });

  const isUnverified = !!error && /verif/i.test(error.message);
  const { mutate: resend, isPending: isResending, isSuccess: resendSent } = useResendVerification();

  const submit = () => {
    if (!email || !pw) return;
    login({ email, password: pw });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTrafficLights />
            <DialogTitle>SIGN_IN.SYS</DialogTitle>
          </div>
          <DialogClose />
        </DialogHeader>

        <DialogBody>
          <div className="inp-group">
            <label className="inp-label">Email</label>
            <input
              className="inp"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
          <div className="inp-group">
            <label className="inp-label">Password</label>
            <input
              className="inp"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          <div className="text-right -mt-1 mb-1">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-ink hover:text-danger transition-colors"
              onClick={() => onOpenChange(false)}
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="inp-error flex gap-2">
              <span>{error.message}</span>
              {isUnverified && (
                <button
                  className="text-ink cursor-pointer text-xs font-semibold hover:text-muted transition-colors"
                  disabled={isResending || resendSent}
                  onClick={() => resend({ email })}
                >
                  {resendSent ? "Sent!" : isResending ? <span className="spinner" /> : "(Resend email)"}
                </button>
              )}
            </div>
          )}

          <button className="btn btn-primary w-full justify-center mt-2" onClick={submit} disabled={isPending || !email || !pw}>
            {isPending ? <span className="spinner" /> : "Sign In →"}
          </button>

          <p className="text-xs text-muted text-center mt-5">
            Don&apos;t have an account?{" "}
            <button
              className="font-semibold text-ink hover:text-danger transition-colors"
              onClick={() => {
                onOpenChange(false);
                setTimeout(() => handleAuthClick("register"), 150);
              }}
            >
              Sign up →
            </button>
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
