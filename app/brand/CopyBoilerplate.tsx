"use client";

import { useState } from "react";

export default function CopyBoilerplate({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy boilerplate"
      className="inline-flex min-h-8 cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-['Space_Mono',monospace] text-xs text-[#1C1C27] underline decoration-[#A8A398] underline-offset-4"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      </svg>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
