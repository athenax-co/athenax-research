"use client";
import ArchivePage from "@/components/page/archive";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { articles, research, archiveLoading, archiveError } = useGlobal();
  return <ArchivePage articles={articles} research={research} loading={archiveLoading} error={archiveError} />;
}
