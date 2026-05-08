"use client";

import Link from "next/link";
import { extractContentText, formatContentDate, isLexicalContent, extractLexicalHeadings, estimateReadTime } from "@/lib/api";
import { cn } from "@/utils/lib";
import { ContentListState, ContentRow } from "../Content";
import LexicalRenderer from "../LexicalRenderer";
import ArticleTOC from "../ArticleTOC";
import { useGlobal } from "../GlobalProvider";
import { IconShare } from "../Icons";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { useArticles } from "@/hooks/queries/useContent";

const ContentDetailPage = ({ kind, item, slug }: { kind: "article" | "research"; item: any | null; slug: string }) => {
  const { showToast } = useGlobal();
  const { data: articles = [] } = useArticles();

  const contentBlocks = extractContentText(item?.content);
  const headings = isLexicalContent(item?.content) ? extractLexicalHeadings(item.content) : [];
  const readTime = item ? estimateReadTime(item.content) : 0;

  const related = articles.filter((a: any) => a.slug !== (item?.slug ?? slug)).slice(0, 2);

  const handleShare = async () => {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/archive/${item?.slug ?? slug}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied!", "success");
    } catch {
      showToast("Could not copy link.", "error");
    }
  };

  return (
    <div>
      <div className="page-wrap section">
        <Link href="/archive" className="link-arrow mb-0">
          ← Back to Research
        </Link>
        {!item ? (
          <div className="mt-8">
            <ContentListState loading={false} error="Not found." emptyText="Not found." />
          </div>
        ) : (
          <div className="mt-8 max-w-300">
            <div className="section-heading-tight mb-6">
              <div className="path-badge">/root/{kind}/{item.slug || slug}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <ProductBadge label={kind} type="kind" />
                {kind === "research" && item.tag && <span className="ftag">{item.tag}</span>}
                <span className="text-sm text-muted">·</span>
                <span className="text-sm text-muted">{formatContentDate(item.publishedAt)?.toString()}</span>
                <span className="text-sm text-muted">·</span>
                <span className="text-sm text-muted">{readTime} min read</span>
              </div>
              {item.title && (
                <div className="flex items-start justify-between gap-4 mt-4">
                  <h1 className="text-4xl font-bold leading-tight tracking-tight">{item.title}</h1>
                  <button className="btn btn-ghost btn-sm size-9 p-0! shrink-0 mt-1" onClick={handleShare}>
                    <IconShare size={15} />
                  </button>
                </div>
              )}
              <hr className="border-0 border-t border-[#D8D4CC] mt-5" />
            </div>

            <div className="flex gap-10 items-start">
              <div className="flex-1 min-w-0">
                {isLexicalContent(item?.content) ? (
                  <LexicalRenderer content={item.content} skipH1 />
                ) : contentBlocks.length > 0 ? (
                  contentBlocks.map((block, index) => (
                    <p
                      key={index}
                      className={cn("text-base leading-[1.8] text-ink", index < contentBlocks.length - 1 && "mb-5")}
                    >
                      {block}
                    </p>
                  ))
                ) : (
                  <pre
                    className="whitespace-pre-wrap wrap-break-word text-xs text-muted m-0"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {JSON.stringify(item.content, null, 2)}
                  </pre>
                )}

                {related.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-dashed border-[#D8D4CC]">
                    <p className="titlebar-label mb-4">See Also</p>
                    {related.map((a: any) => (
                      <Link key={a.slug} href={`/archive/${a.slug}`}>
                        <ContentRow item={a} kind="article" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {headings.length > 0 && <ArticleTOC headings={headings} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailPage;
