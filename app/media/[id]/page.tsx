"use client";
import MediaPage from "@/components/page/media";

export default function Page({ params }: { params: { id: string } }) {
  return <MediaPage mediaId={params.id} />;
}
