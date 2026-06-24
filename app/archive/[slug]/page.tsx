import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BASE_URL } from "@/api/client";
import ContentDetailPage from "@/features/articles/components/Content";

// ISR: archive content is public and shared by all users, so the rendered page
// is safe to cache and rebuild every 5 minutes.
export const revalidate = 300;

type ContentItem = Record<string, unknown>;
type ContentResult = { kind: "article"; item: ContentItem } | null;

// Shared server fetch used by both generateMetadata and the page.
// Identical fetch() calls are deduped by Next's request memoization within a render.
async function getContent(slug: string): Promise<ContentResult> {
  const cache: RequestInit = { next: { revalidate: 300, tags: ["archive", `archive:${slug}`] } };

  // Public article endpoint — no auth cookie, so the response stays cacheable.
  const res = await fetch(`${BASE_URL}/article/slug/${slug}`, cache);
  if (res.ok) {
    const item = await res.json().catch(() => null);
    if (item) return { kind: "article", item };
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent(slug);
  if (!content) return { title: "Not found" };

  const { item } = content;
  const title = (item.title as string) ?? "Research";
  const description = (item.excerpt ?? item.summary ?? item.subtitle) as string | undefined;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getContent(slug);
  if (!content) notFound();

  return <ContentDetailPage kind={content.kind} item={content.item} slug={slug} />;
}
