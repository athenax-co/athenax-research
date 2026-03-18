// ═══════════════════════════════════════════════════════════
// ARCHIVE PAGE

import { useEffect, useState } from "react";
import { ContentListState, ContentRow } from "../Content";
import Footer from "../Footer";
import { normalizeTag } from "@/lib/api";

// ═══════════════════════════════════════════════════════════
const ArchivePage = ({ setPage, articles, research, loading, error, initialTab = "articles" }: { setPage: (page: string) => void; articles: any[]; research: any[]; loading: boolean; error: string; initialTab?: string }) => {
  const [tab, setTab] = useState(initialTab);
  const [researchFilter, setResearchFilter] = useState("all");
  const filteredResearch = researchFilter === "all"
    ? research
    : research.filter((item) => normalizeTag(item.tag) === researchFilter);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/archive</div>
        <h1 style={{fontSize:48,marginBottom:8}}>The Archive</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Artifacts, learnings, and broadcasts.</p>
        <hr className="divider"/>

        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:32}}>
          {[
            ["articles", "Articles"],
            ["research", "Research"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={tab===id ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
              style={tab===id ? {background:"#F5D94E"} : {}}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "articles" && (
          <div>
            {articles.length > 0 ? articles.map((item) => (
              <ContentRow
                key={item.slug}
                item={item}
                kind="article"
                onClick={() => setPage(`article:${item.slug}`)}
              />
            )) : (
              <ContentListState
                loading={loading}
                error={error}
                emptyText="No published articles available yet."
              />
            )}
          </div>
        )}

        {tab === "research" && (
          <div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
              {[
                ["all", "All"],
                ["governance", "Governance"],
                ["treasury", "Treasury"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  className={researchFilter===id ? "btn btn-ghost btn-sm" : "btn btn-outline btn-sm"}
                  style={researchFilter===id ? {background:"#F5D94E"} : {}}
                  onClick={()=>setResearchFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            {filteredResearch.length > 0 ? filteredResearch.map((item) => (
              <ContentRow
                key={item.slug}
                item={item}
                kind="research"
                onClick={() => setPage(`research:${item.slug}`)}
              />
            )) : (
              <ContentListState
                loading={loading}
                error={error}
                emptyText={researchFilter === "all" ? "No published research available yet." : `No ${researchFilter} research available right now.`}
              />
            )}
          </div>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

export default ArchivePage; 