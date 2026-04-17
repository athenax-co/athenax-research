"use client";

import dynamic from "next/dynamic";

const PaperEditor = dynamic(() => import("@/components/editor/PaperEditor"), {
  ssr: false,
  loading: () => (
    <div
    //   style={{
    //     border: "2px solid #1c1c27",
    //     borderRadius: 6,
    //     minHeight: 480,
    //     background: "#fff",
    //   }}
      className="animate-pulse bg-gray-200 w-full rounded-lg border-2 border-gray-300 min-h-120"
    />
  ),
});

export default PaperEditor;
