"use client";

import dynamic from "next/dynamic";

const PaperEditor = dynamic(() => import("@/components/editor/PaperEditor"), {
  ssr: false,
  loading: () => (
    <div className="window-card">
      <div className="window-titlebar">
        <div className="flex gap-1.5 px-3">
          <span className="size-3 rounded-full bg-[#FF5F57]" />
          <span className="size-3 rounded-full bg-[#FEBC2E]" />
          <span className="size-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="titlebar-label">PAPER_EDITOR.SYS</span>
      </div>
      <div className="window-body flex items-center justify-center" style={{ minHeight: 480 }}>
        <span className="text-sm font-mono text-ink/50">LOADING_EDITOR.SYS...</span>
      </div>
    </div>
  ),
});

export default function PapersPage() {
  return (
    <div className="page-wrap section">
      <div className="path-badge">/root/papers</div>
      <h1 className="text-5xl mb-2">Papers</h1>
      <p className="text-[17px] mb-8" style={{ color: "#1c1c2799" }}>
        Draft and edit research documents.
      </p>
      <PaperEditor />
    </div>
  );
}
