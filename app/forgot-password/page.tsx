"use client";

import { useState } from "react";
import { useForgotPassword } from "@/hooks/useAuth";

/**
 * /forgot-password
 *
 * Lets a user request a password-reset email.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { mutate: requestReset, isPending, isSuccess, error, data } = useForgotPassword();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="bg-white border-2 border-[#1c1c27] rounded-xl p-9 w-full max-w-md shadow-[5px_5px_0_#1c1c27]">
        <h1 className="font-mono text-xs tracking-widest text-[#1a1a2e] uppercase mb-2">RESET_PASSWORD.SYS</h1>
        <p className="text-xs text-[#6B6B7A] mb-6">Enter your email and we'll send a reset link.</p>

        {isSuccess ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📨</div>
            <p className="text-sm text-[#1a1a2e]">{data?.message || "If that account exists, a password reset email has been sent."}</p>
          </div>
        ) : (
          <>
            <div className="inp-group">
              <label className="inp-label">Email address</label>
              <input
                id="forgot-password-email"
                className="inp"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                onKeyDown={(e) => e.key === "Enter" && requestReset({ email })}
              />
            </div>
            {error && <div className="inp-error">{error.message}</div>}
            <button
              id="forgot-password-submit"
              className="btn btn-primary w-full mt-2 justify-center"
              onClick={() => requestReset({ email })}
              disabled={isPending || !email}
            >
              {isPending ? <span className="spinner" /> : "Send Reset Link →"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
