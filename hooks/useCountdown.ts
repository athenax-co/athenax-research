import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Counts down from `seconds` to 0, calling `onComplete` when it reaches 0.
 * Returns the current remaining seconds and a `start` function to (re)start it.
 */
export function useCountdown(seconds: number, onComplete?: () => void) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [remaining]);

  // Fire onComplete when remaining hits 0 after having been started
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (started && remaining === 0) {
      onComplete?.();
      setStarted(false);
    }
  }, [remaining, started, onComplete]);

  const start = (override?: number) => {
    setStarted(true);
    setRemaining(override ?? seconds);
  };

  return { remaining, start };
}

/** Convenience hook: counts down then redirects to `path`. */
export function useRedirectCountdown(path: string, seconds: number) {
  const router = useRouter();
  const { remaining, start } = useCountdown(seconds, () => router.push(path));
  return { remaining, start };
}
