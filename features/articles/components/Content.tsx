"use client";

import Link from "next/link";
import { formatContentDate, extractMarkdownHeadings, estimateReadTime } from "@/lib/api";
import { ArticleType } from "@/enums";
import WindowCard from "@/components/ui/WindowCard";
import { ContentListState, ContentRow } from "../../../components/Content";
import MarkdownViewer from "../../../components/editor/MarkdownViewer";
import ArticleTOC from "./ArticleTOC";
import { useGlobal } from "../../../components/GlobalProvider";
import { IconShare } from "../../../components/Icons";
import { ProductBadge } from "@/components/ui/ProductBadge";
import { useArticlesList } from "@/features/articles";

function extractMarkdownAbstract(content: string): { abstract: string; remainder: string } {
  const blocks = content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  const firstPara = blocks.find((b) => !b.startsWith("#") && !b.startsWith(">"));
  const firstQuote = blocks.find((b) => b.startsWith(">"));
  const abstractParts = new Set([firstPara, firstQuote].filter(Boolean) as string[]);
  return {
    abstract: [...abstractParts].join("\n\n"),
    remainder: blocks.filter((b) => !abstractParts.has(b)).join("\n\n"),
  };
}

const ContentDetailPage = ({ kind, item, slug }: { kind: "article" | "research"; item: any | null; slug: string }) => {
  const { showToast } = useGlobal();
  const { data: articles = [] } = useArticlesList();

  const content: string = typeof item?.content === "string" ? item.content : "";
  const headings = content ? extractMarkdownHeadings(content) : [];
  const readTime = item ? estimateReadTime(content) : 0;
  const isWhitepaper = kind === "article" && item?.articleType === ArticleType.WHITEPAPER;
  const { abstract, remainder } = isWhitepaper && content
    ? extractMarkdownAbstract(content)
    : { abstract: "", remainder: content };

  const related = articles.filter((a) => a.slug !== (item?.slug ?? slug)).slice(0, 2);

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
                {kind === "article" ? (
                  <>
                    {item.articleType && <ProductBadge label={item.articleType} type="kind" />}
                    {item.categories?.map((cat: string) => (
                      <ProductBadge key={cat} label={cat} type="category" />
                    ))}
                  </>
                ) : (
                  <>
                    <ProductBadge label={kind} type="kind" />
                    {item.tag && <span className="ftag">{item.tag}</span>}
                  </>
                )}
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
                {abstract && (
                  <WindowCard label="Abstract" className="mb-6">
                    <MarkdownViewer content={abstract} />
                  </WindowCard>
                )}

                <MarkdownViewer content={remainder} />

                {related.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-dashed border-[#D8D4CC]">
                    <p className="titlebar-label mb-4">See Also</p>
                    {related.map((a) => (
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
