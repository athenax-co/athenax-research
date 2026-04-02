"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifySession } from "@/lib/auth-api";
import { useVerifyEmail, useResendVerification } from "@/hooks/useAuth";

/**
 * /verify-email
 *
 * Handles two sub-cases via GET /verify-email?token=...:
 *  1. Auto-verify when /verify-email?token=... is present
 *  2. Manual token paste
 */
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlToken = searchParams.get("token") ?? "";

  const [manualToken, setManualToken] = useState(urlToken);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [autoLoginError, setAutoLoginError] = useState<string | null>(null);

  const {
    mutate: verifyViaPost,
    isPending: verifyingPost,
    error: postError,
  } = useVerifyEmail({
    onSuccess: async () => {
      setAutoLoginError(null);
      try {
        // Refresh auth state immediately after verification in case the cookie was just issued.
        await verifySession();
      } catch {
        setAutoLoginError("Email verified, but auto sign-in could not be confirmed. Please sign in manually.");
      }
      setDone(true);
    },
  });

  const { mutate: resend, isPending: resending, isSuccess: resent } = useResendVerification();

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

  useEffect(() => {
    if (urlToken) verifyViaPost({ token: urlToken });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlToken]);


  const isPending = verifyingPost;
  const error = postError;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-10">
      <div className="bg-white border-2 border-ink rounded-xl p-9 w-full max-w-md shadow-[5px_5px_0_#1c1c27]">
        <h1 className="font-mono text-xs tracking-widest text-[#1a1a2e] uppercase mb-6">VERIFY_EMAIL.SYS</h1>

        {done ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-sm text-[#1a1a2e] mb-5">
              {autoLoginError ? "Email verified successfully." : "Email verified successfully. You are now signed in."}
            </p>
            {autoLoginError && <p className="text-danger text-xs mb-4">{autoLoginError}</p>}
            <button className="btn btn-primary w-full justify-center" onClick={() => router.push("/")}>
              Continue to Home →
            </button>
            <p className="mt-3 text-xs text-muted">Or click above to continue.</p>
          </div>
        ) : urlToken ? (
          <div className="text-center">
            {isPending && (
              <>
                <span className="spinner inline-block" />
                <p className="mt-4 text-xs text-muted">Verifying your email…</p>
              </>
            )}
            {error && (
              <>
                <p className="text-danger text-xs mb-4">{error.message}</p>
                <button
                  className="btn btn-ghost btn-sm w-full justify-center"
                  onClick={() => verifyViaPost({ token: urlToken })}
                  disabled={isPending}
                >
                  Retry
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-muted mb-5">Enter the verification token from your email, or paste the full link&apos;s token here.</p>
            <div className="inp-group">
              <label className="inp-label">Verification Token</label>
              <input className="inp" value={manualToken} onChange={(e) => setManualToken(e.target.value)} placeholder="Paste token here" />
            </div>
            {error && <div className="inp-error">{error.message}</div>}
            <button
              className="btn btn-primary w-full mt-2 justify-center"
              onClick={() => verifyViaPost({ token: manualToken })}
              disabled={isPending || !manualToken}
            >
              {isPending ? <span className="spinner" /> : "Verify Email →"}
            </button>

            <hr className="divider-sm" />

            <p className="text-xs text-muted mb-2">Didn&apos;t receive an email?</p>
            <div className="inp-group">
              <label className="inp-label">Your email address</label>
              <input className="inp" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" />
            </div>
            {resent && <div className="text-green-600 text-xs mb-1.5">Verification email sent!</div>}
            <button
              className="btn btn-ghost btn-sm w-full justify-center"
              onClick={() => {
                resend({ email });
                setResendTimer(60);
              }}
              disabled={resending || !email || resendTimer > 0}
            >
              {resending ? <span className="spinner" /> : resendTimer > 0 ? `Resend code (${resendTimer}s)` : "Resend verification email"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
