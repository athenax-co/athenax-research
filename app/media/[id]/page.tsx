"use client";
import MediaPage from "@/components/page/media";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return <MediaPage mediaId={id} />;
}
