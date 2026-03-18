"use client";
import ContentDetailPage from "@/components/page/content-details";

export default function Page({ params }: { params: { slug: string } }) {
  return <ContentDetailPage kind="article" slug={params.slug} />;
}
