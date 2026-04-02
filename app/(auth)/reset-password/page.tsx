"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useResetPassword } from "@/hooks/useAuth";

/**
 * /reset-password?token=...
 *
 * Completes the password-reset flow.
 */
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const { mutate: reset, isPending, isSuccess, error } = useResetPassword({
    onSuccess: () => {
      setTimeout(() => router.push("/"), 2000);
    },
  });

  const handleSubmit = () => {
    if (password !== confirm) {
      setConfirmError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setConfirmError("Password must be at least 6 characters.");
      return;
    }
    setConfirmError("");
    reset({ token, password });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="bg-white border-2 border-[#1c1c27] rounded-xl p-9 w-full max-w-md shadow-[5px_5px_0_#1c1c27]">
        <h1 className="font-mono text-xs tracking-widest text-[#1a1a2e] uppercase mb-2">
          NEW_PASSWORD.SYS
        </h1>
        <p className="text-xs text-[#6B6B7A] mb-6">
          Choose a new password for your account.
        </p>

        {isSuccess ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🔐</div>
            <p className="text-sm text-[#1a1a2e]">
              Password reset successfully. Redirecting to home…
            </p>
          </div>
        ) : (
          <>
            {!searchParams.get("token") && (
              <div className="inp-group">
                <label className="inp-label">Reset Token</label>
                <input
                  className="inp"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste the token from your email"
                />
              </div>
            )}
            <div className="inp-group">
              <label className="inp-label">New Password</label>
              <input
                id="reset-password-new"
                className="inp"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6+ characters"
              />
            </div>
            <div className="inp-group">
              <label className="inp-label">Confirm Password</label>
              <input
                id="reset-password-confirm"
                className="inp"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat new password"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            {(confirmError || error) && (
              <div className="inp-error">
                {confirmError || error?.message}
              </div>
            )}
            <button
              id="reset-password-submit"
              className="btn btn-primary w-full mt-2 justify-center"
              onClick={handleSubmit}
              disabled={isPending || !token || !password || !confirm}
            >
              {isPending ? <span className="spinner" /> : "Reset Password →"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
