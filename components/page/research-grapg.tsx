import { SEED_LABS, SEED_PAPERS, SEED_RESEARCHERS } from "@/data/seed";
import { calcARS } from "@/lib/db-helper";
import { useEffect, useRef, useState } from "react";
import WindowCard from "../ui/WindowCard";
import TrafficLights from "../ui/TrafficLights";

// ═══════════════════════════════════════════════════════════
// RESEARCH GRAPH PAGE
// ═══════════════════════════════════════════════════════════
const NODE_CONFIG = {
  paper: { radius: 14, color: "#E8323C", labelColor: "#1C1C27" },
  researcher: { radius: 16, color: "#F5D94E", labelColor: "#1C1C27" },
  lab: { radius: 18, color: "#1C1C27", labelColor: "#F2EFE9" },
  topic: { radius: 20, color: "#EAF0F6", labelColor: "#1C1C27" },
};
const EDGE_CONFIG = {
  authored: { color: "#E8323C", dash: false },
  member_of: { color: "#1C1C27", dash: false },
  covers: { color: "#D8D4CC", dash: true },
  topic: { color: "#D8D4CC", dash: true },
};

type NodeType = "paper" | "researcher" | "lab" | "topic";
interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  meta: any;
}

interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GraphEdge {
  source: string;
  target: string;
  rel: string;
}

interface DragState {
  node: PositionedNode;
  sx: number;
  sy: number;
  ox: number;
  oy: number;
}

interface PanState {
  sx: number;
  sy: number;
  sox: number;
  soy: number;
}

const buildGraphData = () => {
  const nodes: GraphNode[] = [],
    edges: GraphEdge[] = [];
  const topics = Array.from(new Set(SEED_PAPERS.map((p) => p.topic)));
  topics.forEach((t) => nodes.push({ id: `topic_${t}`, type: "topic", label: t, meta: { name: t } }));
  SEED_LABS.forEach((l) => nodes.push({ id: l.id, type: "lab", label: l.name, meta: l }));
  SEED_PAPERS.forEach((p) => {
    nodes.push({ id: `paper_${p.id}`, type: "paper", label: p.title.slice(0, 30) + "…", meta: p });
    edges.push({ source: `paper_${p.id}`, target: `topic_${p.topic}`, rel: "covers" });
    const lab = SEED_LABS.find((l) => l.name === p.lab);
    if (lab) edges.push({ source: `paper_${p.id}`, target: lab.id, rel: "authored" });
  });
  SEED_RESEARCHERS.forEach((r) => {
    nodes.push({ id: r.id, type: "researcher", label: r.name, meta: r });
    const lab = SEED_LABS.find((l) => l.name === r.lab || l.researchers.includes(r.name));
    if (lab) edges.push({ source: r.id, target: lab.id, rel: "member_of" });
  });
  return { nodes, edges };
};

const runForce = (nodes: PositionedNode[], edges: GraphEdge[], W: number, H: number): PositionedNode[] => {
  for (let iter = 0; iter < 200; iter++) {
    const cool = 1 - iter / 200;
    nodes.forEach((a) => {
      nodes.forEach((b) => {
        if (a.id === b.id) return;
        const dx = b.x - a.x,
          dy = b.y - a.y,
          dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = 800 / (dist * dist);
        a.vx -= (dx / dist) * f;
        a.vy -= (dy / dist) * f;
      });
    });
    const nm: Record<string, PositionedNode> = {};
    nodes.forEach((n) => {
      nm[n.id] = n;
    });
    edges.forEach((e) => {
      const a = nm[e.source],
        b = nm[e.target];
      if (!a || !b) return;
      const dx = b.x - a.x,
        dy = b.y - a.y,
        dist = Math.sqrt(dx * dx + dy * dy) || 1,
        f = (dist - 110) * 0.03;
      a.vx += (dx / dist) * f;
      a.vy += (dy / dist) * f;
      b.vx -= (dx / dist) * f;
      b.vy -= (dy / dist) * f;
    });
    const speed = cool * 0.85;
    const pad = 30;
    nodes.forEach((n) => {
      n.x = Math.max(pad, Math.min(W - pad, n.x + (n.vx || 0) * speed));
      n.y = Math.max(pad, Math.min(H - pad, n.y + (n.vy || 0) * speed));
      n.vx = (n.vx || 0) * 0.8;
      n.vy = (n.vy || 0) * 0.8;
    });
  }
  return nodes;
};

const ResearchGraphPage = (): React.ReactNode => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    nodes: PositionedNode[];
    edges: GraphEdge[];
    scale: number;
    ox: number;
    oy: number;
    drag: DragState | null;
    pan: PanState | null;
  }>({ nodes: [], edges: [], scale: 1, ox: 0, oy: 0, drag: null, pan: null });
  const [selected, setSelected] = useState<PositionedNode | null>(null);
  const [highlight, setHighlight] = useState<Set<string> | null>(null);
  const [cmd, setCmd] = useState("");
  const [cmdLog, setCmdLog] = useState(["> type 'help' for commands"]);
  const [graphReady, setGraphReady] = useState(false);

  useEffect(() => {
    const { nodes, edges } = buildGraphData();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.offsetWidth || 740,
      H = canvas.offsetHeight || 520;
    canvas.width = W;
    canvas.height = H;
    const positioned = runForce(
      nodes.map((n) => ({ ...n, x: W / 2 + (Math.random() - 0.5) * 300, y: H / 2 + (Math.random() - 0.5) * 300, vx: 0, vy: 0 })) as PositionedNode[],
      edges,
      W,
      H
    );
    stateRef.current = { ...stateRef.current, nodes: positioned, edges };
    setGraphReady(true);
  }, []);

  useEffect(() => {
    if (graphReady) draw();
  }, [graphReady, selected, highlight]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { nodes, edges, scale, ox, oy } = stateRef.current;
    const W = canvas.width,
      H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(scale, scale);
    const nm: Record<string, PositionedNode> = {};
    nodes.forEach((n) => {
      nm[n.id] = n;
    });
    edges.forEach((e) => {
      const a = nm[e.source],
        b = nm[e.target];
      if (!a || !b) return;
      const isHL = highlight && highlight.has(a.id) && highlight.has(b.id);
      const cfg = (EDGE_CONFIG as Record<string, typeof EDGE_CONFIG.topic>)[e.rel] || EDGE_CONFIG.topic;
      ctx.beginPath();
      ctx.strokeStyle = isHL ? cfg.color : "#D8D4CC";
      ctx.lineWidth = isHL ? 2 : 1;
      if (cfg.dash) ctx.setLineDash([4, 4]);
      else ctx.setLineDash([]);
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    nodes.forEach((n) => {
      const cfg = NODE_CONFIG[n.type] || NODE_CONFIG.topic;
      const isHL = highlight ? highlight.has(n.id) : false;
      const isSel = selected?.id === n.id;
      const dim = highlight && !isHL;
      ctx.globalAlpha = dim ? 0.2 : 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, cfg.radius + (isSel ? 3 : 0), 0, Math.PI * 2);
      ctx.fillStyle = cfg.color;
      ctx.fill();
      ctx.strokeStyle = "#1C1C27";
      ctx.lineWidth = isSel ? 3 : 2;
      ctx.stroke();
      ctx.globalAlpha = dim ? 0.15 : 0.85;
      ctx.font = `${isHL ? "700" : "400"} 10px 'Space Grotesk',sans-serif`;
      ctx.fillStyle = "#1C1C27";
      ctx.textAlign = "center";
      ctx.fillText(n.label.slice(0, 18), n.x, n.y + cfg.radius + 13);
      ctx.globalAlpha = 1;
    });
    ctx.restore();
  };

  const hitNode = (cx: number, cy: number): PositionedNode | null => {
    const { nodes, scale, ox, oy } = stateRef.current;
    const wx = (cx - ox) / scale,
      wy = (cy - oy) / scale;
    return (
      nodes.find((n) => {
        const cfg = NODE_CONFIG[n.type] || NODE_CONFIG.topic;
        return Math.sqrt((wx - n.x) ** 2 + (wy - n.y) ** 2) < cfg.radius + 4;
      }) || null
    );
  };

  const getConnected = (nodeId: string): Set<string> => {
    const { edges } = stateRef.current;
    const ids = new Set<string>([nodeId]);
    edges.forEach((e) => {
      if (e.source === nodeId) ids.add(e.target);
      if (e.target === nodeId) ids.add(e.source);
    });
    return ids;
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left,
      cy = e.clientY - rect.top;
    const hit = hitNode(cx, cy);
    if (hit) stateRef.current.drag = { node: hit, sx: cx, sy: cy, ox: hit.x, oy: hit.y };
    else stateRef.current.pan = { sx: cx, sy: cy, sox: stateRef.current.ox, soy: stateRef.current.oy };
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left,
      cy = e.clientY - rect.top;
    const s = stateRef.current;
    if (s.drag) {
      s.drag.node.x = s.drag.ox + (cx - s.drag.sx) / s.scale;
      s.drag.node.y = s.drag.oy + (cy - s.drag.sy) / s.scale;
      draw();
    } else if (s.pan) {
      s.ox = s.pan.sox + (cx - s.pan.sx);
      s.oy = s.pan.soy + (cy - s.pan.sy);
      draw();
    }
  };
  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    if (s.drag) {
      const rect = canvas.getBoundingClientRect();
      const moved = Math.abs(e.clientX - rect.left - s.drag.sx) + Math.abs(e.clientY - rect.top - s.drag.sy) < 5;
      if (moved) {
        const hit = s.drag.node;
        setSelected(hit);
        setHighlight(getConnected(hit.id));
      }
      s.drag = null;
    } else {
      s.pan = null;
    }
    draw();
  };
  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left,
      cy = e.clientY - rect.top;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const ns = Math.max(0.35, Math.min(3, s.scale * delta));
    s.ox = cx - (cx - s.ox) * (ns / s.scale);
    s.oy = cy - (cy - s.oy) * (ns / s.scale);
    s.scale = ns;
    draw();
  };

  const runCmd = (raw: string): void => {
    const c = raw.trim();
    if (!c) return;
    const log = (lines: string[]): void => setCmdLog((p) => [...p.slice(-30), ...lines]);
    const { nodes } = stateRef.current;
    if (c === "help") log(["> Commands: help | reset | top-papers | top-topics | topic [name] | researcher [name]"]);
    else if (c === "reset") {
      setSelected(null);
      setHighlight(null);
      log(["> Reset."]);
    } else if (c === "top-papers") {
      const top = [...SEED_PAPERS].sort((a, b) => b.citations - a.citations).slice(0, 3);
      const ids = new Set(top.map((p) => `paper_${p.id}`));
      setHighlight(ids);
      log(["> Top 3 papers by citations highlighted.", ...top.map((p) => `  ${p.title.slice(0, 40)} — ${p.citations} cites`)]);
    } else if (c === "top-topics") {
      const tm: Record<string, number> = {};
      SEED_PAPERS.forEach((p) => {
        tm[p.topic] = (tm[p.topic] || 0) + 1;
      });
      const top = Object.entries(tm).sort((a, b) => b[1] - a[1]);
      setHighlight(new Set(top.slice(0, 3).map(([t]) => `topic_${t}`)));
      log(["> Top topics:", ...top.slice(0, 3).map(([t, n]) => `  ${t}: ${n} papers`)]);
    } else if (c.startsWith("topic ")) {
      const q = c.slice(6).trim().toLowerCase();
      const m = nodes.filter((n) => n.type === "topic" && n.label.toLowerCase().includes(q));
      setHighlight(new Set(m.map((n) => n.id)));
      log([m.length ? `> Found ${m.length} topic(s) matching "${q}".` : `> No topics matched "${q}".`]);
    } else if (c.startsWith("researcher ")) {
      const q = c.slice(11).trim().toLowerCase();
      const m = nodes.filter((n) => n.type === "researcher" && n.meta?.name?.toLowerCase().includes(q));
      if (m[0]) {
        setSelected(m[0]);
        setHighlight(getConnected(m[0].id));
        log([`> Found: ${m[0].label}`]);
      } else log([`> No researcher matched "${q}".`]);
    } else log([`> Unknown command: ${c}. Type 'help'.`]);
    draw();
  };

  const renderDetail = (): React.ReactNode => {
    if (!selected) return null;
    const m = selected.meta || {};
    const connCount = highlight ? highlight.size - 1 : 0;
    return (
      <div style={{ padding: "18px 20px", borderTop: "2px solid #1C1C27" }}>
        <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, letterSpacing: "0.07em", color: "#6B6B7A", marginBottom: 6 }}>
          {selected.type.toUpperCase()}
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{selected.label}</div>
        {selected.type === "paper" && (
          <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 8 }}>
            {m.university} · {m.year} · {m.citations} citations
          </div>
        )}
        {selected.type === "researcher" && (
          <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 8 }}>
            ARS {calcARS(m).toFixed(1)} · {m.university}
          </div>
        )}
        {selected.type === "lab" && (
          <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 8 }}>
            {m.papers} papers · {m.focus}
          </div>
        )}
        {selected.type === "topic" && (
          <div style={{ fontSize: 13, color: "#6B6B7A", marginBottom: 8 }}>{SEED_PAPERS.filter((p) => p.topic === m.name).length} papers</div>
        )}
        <div style={{ fontSize: 12, color: "#6B6B7A" }}>
          {connCount} connection{connCount !== 1 ? "s" : ""}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/research-graph</div>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>Research Graph</h1>
        <p style={{ fontSize: 17, color: "#6B6B7A", marginBottom: 0 }}>Visual knowledge map. Papers, researchers, labs, topics.</p>
        <hr className="divider" />
        <div className="grid-2" style={{ gap: 22, alignItems: "flex-start" }}>
          <div className="window-card">
            <div className="window-titlebar">
              <TrafficLights />
              <span className="titlebar-label">GRAPH_CANVAS.SYS</span>
            </div>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: 480, cursor: "grab" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onWheel={onWheel}
            />
            {renderDetail()}
          </div>
          <div>
            <WindowCard label=">_ GRAPH_TERMINAL" style={{ marginBottom: 20 }}>
              <div
                style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, minHeight: 140, maxHeight: 180, overflowY: "auto", marginBottom: 12 }}
              >
                {cmdLog.map((l, i) => (
                  <div key={i} style={{ color: l.startsWith(">") ? "#1C1C27" : "#6B6B7A", lineHeight: 1.7, fontSize: 11 }}>
                    {l}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="inp"
                  style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, padding: "8px 12px" }}
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  placeholder="help"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      runCmd(cmd);
                      setCmd("");
                    }
                  }}
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    runCmd(cmd);
                    setCmd("");
                  }}
                >
                  Run
                </button>
              </div>
            </WindowCard>
            <WindowCard label="LEGEND.SYS">
              {Object.entries(NODE_CONFIG).map(([type, cfg]) => (
                <div key={type} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #D8D4CC" }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", background: cfg.color, border: "2px solid #1C1C27", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, textTransform: "capitalize", fontWeight: 500 }}>{type}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, fontSize: 11, color: "#6B6B7A", fontFamily: "'Space Mono',monospace" }}>
                Click node · Drag · Scroll to zoom · Double-click to open
              </div>
            </WindowCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchGraphPage;
