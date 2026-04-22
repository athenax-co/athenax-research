"use client";

import dynamic from "next/dynamic";

const PaperEditor = dynamic(() => import("@/features/papers/components/PaperEditor"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 w-full rounded-lg border-2 border-gray-300 min-h-120" />,
});

export default function Page() {
  return <PaperEditor />;
}
