"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_META_BY_PATH, DOCS_NAV } from "@/lib/docs-nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = DOCS_META_BY_PATH[pathname] || DOCS_META_BY_PATH["/docs"];

  return (
    <div className="page-wrap section">
      <div className="mb-4.5">
        <div className="path-badge">{meta.fileTag}</div>
        <h1 className="mb-1.5 text-[42px]">{meta.title}</h1>
        <p className="text-[17px] text-muted">{meta.subtitle}</p>
      </div>

      <hr className="divider" />

      <div className="docs-layout">
        <div className="docs-sidebar">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Documentation</div>
          {DOCS_NAV.map((item) => (
            <Link key={item.id} href={item.href} className={`docs-sidebar-link${meta.current === item.id ? " active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="docs-content">{children}</div>
      </div>
    </div>
  );
}
