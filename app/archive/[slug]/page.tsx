"use client";

import { useParams } from "next/navigation";
import ContentDetailPage from "@/features/articles/components/Content";
import { useContentBySlug } from "@/hooks/queries/useContent";

const ContentDetailSkeleton = () => (
  <div className="page-wrap section section-stack-md animate-pulse">
    <div className="h-4 w-28 rounded bg-[#E8E4DC]" />
    <div className="space-y-3">
      <div className="h-3 w-20 rounded bg-[#E8E4DC]" />
      <div className="h-8 w-2/3 rounded bg-[#E8E4DC]" />
    </div>
    <div className="space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`h-4 rounded bg-[#E8E4DC] ${i === 5 ? "w-1/2" : "w-full"}`} />
      ))}
    </div>
  </div>
);

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  const { item, kind, loading } = useContentBySlug(slug);

  if (loading) return <ContentDetailSkeleton />;

  return <ContentDetailPage kind={kind} item={item} slug={slug} />;
}
