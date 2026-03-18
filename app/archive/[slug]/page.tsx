"use client";
import ContentDetailPage from "@/components/page/content-details";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  return <ContentDetailPage kind="article" slug={slug} />;
}
