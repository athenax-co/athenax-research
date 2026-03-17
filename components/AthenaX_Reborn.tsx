// @ts-nocheck

// AthenaX_Reborn — v3 — Terminal page + icon refresh + business model update
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LexicalRenderer from "./LexicalRenderer";
import LaunchPage, {LaunchDetailPage} from "./page/launch";
import Navbar from "./Navbar";
import TrafficLights from "./ui/TrafficLights";
import WindowCard from "./ui/WindowCard";
import {
  IconLabs,
  IconUniversities,
  IconSponsors,
  IconTalent,
  IconResearchers,
  IconProtocols,
  IconBuilders,
  IconSponsoredPrograms,
  IconBounties,
  IconCohortFees,
  IconTerminal,
  IconTalentPlacement,
  IconStartupEquity,
  IconLabsSmall,
  IconTalentSmall,
  IconPaperSmall,
  IconBriefcaseSmall,
} from "./Icons";

const API_BASE_URL = "https://admin.athenax.co/api";
const CONTENT_DEFAULT_PARAMS = {
  limit: "1000",
  "where[_status][equals]": "published",
};

const buildContentUrl = (path, extraParams = {}) => {
  const params = new URLSearchParams({
    ...CONTENT_DEFAULT_PARAMS,
    ...extraParams,
  });

  return `${API_BASE_URL}${path}?${params.toString()}`;
};

const fetchFromAPI = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.docs)) return data.docs;
    if (Array.isArray(data?.data)) return data.data;
    console.error("Unexpected API response structure:", data);
    return [];
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return [];
  }
};

const getArticles = () =>
  fetchFromAPI(
    buildContentUrl("/articles", {
      "select[title]": "true",
      "select[slug]": "true",
      "select[publishedAt]": "true",
    })
  );

const getResearch = () =>
  fetchFromAPI(
    buildContentUrl("/research", {
      "select[title]": "true",
      "select[slug]": "true",
      "select[tag]": "true",
      "select[publishedAt]": "true",
    })
  );

const getArticleBySlug = async (slug) => {
  const items = await fetchFromAPI(
    buildContentUrl("/articles", {
      "where[slug][equals]": slug,
    })
  );
  return items[0] ?? null;
};

const getResearchBySlug = async (slug) => {
  const items = await fetchFromAPI(
    buildContentUrl("/research", {
      "where[slug][equals]": slug,
    })
  );
  return items[0] ?? null;
};

const sortByPublishedAtDesc = (items = []) =>
  [...items].sort(
    (a, b) =>
      new Date(b?.publishedAt || 0).getTime() -
      new Date(a?.publishedAt || 0).getTime()
  );

const formatContentDate = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const normalizeTag = (tag) => (tag || "").trim().toLowerCase();

const extractContentText = (value) => {
  if (!value) return [];
  if (typeof value === "string") {
    return value
      .split(/\n{2,}/)
      .map((chunk) => chunk.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value.flatMap(extractContentText);
  }
  if (typeof value === "object") {
    if (typeof value.text === "string") return [value.text.trim()].filter(Boolean);
    return Object.values(value).flatMap(extractContentText);
  }
  return [];
};

const isLexicalContent = (value) =>
  Boolean(
    value &&
    typeof value === "object" &&
    value.root &&
    typeof value.root === "object"
  );

const useArchiveContent = () => {
  const [articles, setArticles] = useState([]);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [articleItems, researchItems] = await Promise.all([
          getArticles(),
          getResearch(),
        ]);
        if (!mounted) return;
        setArticles(sortByPublishedAtDesc(articleItems));
        setResearch(sortByPublishedAtDesc(researchItems));
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load archive content:", err);
        setError("Could not load archive content right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { articles, research, loading, error };
};

const useContentItem = (kind, slug, initialItem = null) => {
  const [item, setItem] = useState(initialItem);
  const [loading, setLoading] = useState(!initialItem);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      const nextItem =
        kind === "research"
          ? await getResearchBySlug(slug)
          : await getArticleBySlug(slug);
      if (!mounted) return;
      setItem(nextItem);
      setLoading(false);
      if (!nextItem) setError("Not found.");
    };

    load();
    return () => {
      mounted = false;
    };
  }, [kind, slug]);

  return { item, loading, error };
};

const ROUTED_PAGES = {
  "archive": "/archive",
  "home": "/",
  "research": "/research",
};

const getPathForPage = (page) => {
  if (!page) return "/";
  if (page.startsWith("article:")) {
    return `/archive/${page.replace("article:", "")}`;
  }
  if (page.startsWith("research:")) {
    return `/research/${page.replace("research:", "")}`;
  }
  return ROUTED_PAGES[page] ?? null;
};

const getPageForPathname = (pathname) => {
  if (!pathname || pathname === "/") {
    return { page: "home", archiveTab: "articles" };
  }

  const articleMatch = pathname.match(/^\/archive\/([^/]+)$/);
  if (articleMatch) {
    return {
      page: `article:${decodeURIComponent(articleMatch[1])}`,
      archiveTab: "articles",
    };
  }

  const researchMatch = pathname.match(/^\/research\/([^/]+)$/);
  if (researchMatch) {
    return {
      page: `research:${decodeURIComponent(researchMatch[1])}`,
      archiveTab: "research",
    };
  }

  const page = Object.entries(ROUTED_PAGES).find(([, path]) => path === pathname)?.[0];
  if (page) {
    return {
      page: page === "research" ? "archive" : page,
      archiveTab: page === "research" ? "research" : "articles",
    };
  }

  return { page: "home", archiveTab: "articles" };
};

// ═══════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════
const SEED_LABS = [
  { id:"lab_1", name:"IF Labs", focus:"Frontier Infrastructure & Protocol Research", partners:["MIT","Oxford"], papers:14, tags:["DeFi","ZK Proofs","L2 Scaling"], description:"IF Labs is the founding research partner of AthenaX, specializing in applied onchain infrastructure research with a focus on zero-knowledge proofs, Layer 2 scaling, and DeFi protocol design.", researchers:["Dr. Yuki Tanaka","Prof. Amara Osei","Dr. Felix Chen"], active:true },
  { id:"lab_2", name:"MIT DCI", focus:"Digital Currency Initiative", partners:["MIT","Harvard"], papers:89, tags:["Protocol Economics","CBDC","Privacy"], description:"The MIT Digital Currency Initiative bridges academic research and practical implementation of digital currencies and decentralized systems.", researchers:["Prof. Neha Narula","Dr. James McCarthy","Sarah Kim"], active:true },
  { id:"lab_3", name:"Stanford Blockchain", focus:"Blockchain Protocol Research", partners:["Stanford","Caltech"], papers:67, tags:["Consensus","Smart Contracts","Security"], description:"Stanford's Blockchain Research Center conducts fundamental research in distributed systems, cryptography, and decentralized protocol design.", researchers:["Prof. Dan Boneh","Dr. Benedikt Bünz","Pratyush Mishra"], active:true },
  { id:"lab_4", name:"Oxford Internet Institute", focus:"Internet & Society Research", partners:["Oxford","Cambridge"], papers:112, tags:["Governance","DAOs","Digital Nations"], description:"The OII examines the social, economic, and political implications of internet technologies and decentralized governance systems.", researchers:["Prof. Vili Lehdonvirta","Dr. Markus Ante","Clara Jensen"], active:false },
  { id:"lab_5", name:"Ethereum Foundation Research", focus:"Ethereum Protocol Development", partners:["ETH Zurich","Imperial College"], papers:203, tags:["Ethereum","PoS","EVM"], description:"The EF Research team drives the technical evolution of the Ethereum protocol — consensus, data availability, execution, and beyond.", researchers:["Vitalik Buterin","Justin Drake","Dankrad Feist"], active:true },
  { id:"lab_6", name:"Consensys R&D", focus:"Applied Protocol Engineering", partners:["Columbia","Imperial College"], papers:41, tags:["EVM","Dev Tools","Layer 2"], description:"Consensys R&D combines protocol engineering with applied research across the Ethereum ecosystem.", researchers:["Dr. Péter Szilágyi","Danno Ferrin","Antoine Toulme"], active:true },
];

const SEED_PAPERS = [
  { id:"001", title:"ZK-SNARKs in Layer 2 Rollup Systems: A Comprehensive Analysis", authorIds:["user_001"], authors:["Dr. Yuki Tanaka","Prof. Amara Osei"], university:"MIT", lab:"IF Labs", topic:"ZK Proofs", citations:142, downloads:3840, reviewScore:9.2, peerReviews:8, abstract:"A systematic analysis of zero-knowledge proof systems deployed in Layer 2 rollup architectures, evaluating security guarantees, computational overhead, and practical tradeoffs for production deployments.", year:2024, status:"published", votes:234 },
  { id:"002", title:"DAO Governance Mechanisms: Voting Theory Meets Decentralization", authorIds:["user_002"], authors:["Prof. Vili Lehdonvirta","Dr. Clara Jensen"], university:"Oxford", lab:"Oxford Internet Institute", topic:"DAO Governance", citations:98, downloads:2210, reviewScore:8.7, peerReviews:6, abstract:"An interdisciplinary examination of DAO governance structures through the lens of political science and distributed systems theory, proposing a unified framework for evaluation.", year:2024, status:"published", votes:189 },
  { id:"003", title:"Tokenomics Design Patterns for Sustainable DeFi Protocols", authorIds:["user_003"], authors:["Dr. Felix Chen","Sarah Kim"], university:"Stanford", lab:"Stanford Blockchain", topic:"Tokenomics", citations:76, downloads:1950, reviewScore:8.1, peerReviews:4, abstract:"We survey 47 DeFi protocols to identify common tokenomic design patterns and propose a framework for protocol designers seeking long-term sustainability.", year:2024, status:"published", votes:143 },
  { id:"004", title:"AI Agent Coordination in Multi-Chain Environments", authorIds:["user_004"], authors:["Dr. James McCarthy","Elena Rodriguez"], university:"MIT", lab:"MIT DCI", topic:"AI Agents", citations:201, downloads:5670, reviewScore:9.5, peerReviews:11, abstract:"This work investigates the coordination problem for autonomous AI agents operating across heterogeneous blockchain networks, with formal safety guarantees.", year:2025, status:"published", votes:312 },
  { id:"005", title:"Crypto Economic Security: Game Theoretic Models for Validator Incentives", authorIds:["user_005"], authors:["Dankrad Feist","Justin Drake"], university:"ETH Zurich", lab:"Ethereum Foundation Research", topic:"Protocol Economics", citations:315, downloads:8920, reviewScore:9.8, peerReviews:18, abstract:"A rigorous game-theoretic analysis of validator incentive structures in proof-of-stake systems, with formal security proofs under Byzantine fault models.", year:2025, status:"published", votes:487 },
  { id:"006", title:"Digital Nations: Governance Frameworks for Network States", authorIds:["user_002"], authors:["Prof. Vili Lehdonvirta","Dr. Markus Ante"], university:"Oxford", lab:"Oxford Internet Institute", topic:"Digital Nations", citations:54, downloads:1340, reviewScore:7.9, peerReviews:3, abstract:"We examine the emerging concept of digital nations and network states, analysing governance primitives derived from onchain coordination systems and their sociological implications.", year:2024, status:"published", votes:98 },
];

const SEED_SPONSORS = [
  { name:"Ethereum Foundation", category:"Protocol Layer",  amount:"$2.4M", ticker:"ETH",   programs:12, why:"Funding open cryptography and consensus research to advance public goods infrastructure." },
  { name:"Arbitrum",            category:"L2 Network",      amount:"$800K", ticker:"ARB",    programs:4,  why:"Sponsoring research into optimistic rollup security, fraud proofs, and decentralised sequencing." },
  { name:"EigenLayer",          category:"Restaking",       amount:"$1.2M", ticker:"EIGEN",  programs:6,  why:"Funding formal verification and economic security research for restaking infrastructure." },
  { name:"Uniswap Foundation",  category:"DeFi Protocol",   amount:"$400K", ticker:"UNI",    programs:3,  why:"Supporting cross-chain liquidity and MEV research to improve decentralised trading." },
  { name:"Mantle",              category:"L2 Network",      amount:"$600K", ticker:"MNT",    programs:3,  why:"Funding L2 performance, data availability, and modular architecture research." },
  { name:"Coinbase",            category:"Exchange / L2",   amount:"$500K", ticker:"CB",     programs:2,  why:"Sponsoring regulatory research and Base L2 infrastructure studies." },
];

const SEED_BOUNTIES = [
  { id:"B001", title:"ZK Proof Optimization for Mobile Wallets",         sponsor:"Ethereum Foundation", reward:"$45,000", deadline:"2025-03-31", applicants:14, topic:"ZK Proofs",    status:"open" },
  { id:"B002", title:"DAO Voter Participation Incentive Models",          sponsor:"Arbitrum",            reward:"$22,000", deadline:"2025-02-28", applicants:7,  topic:"DAO Governance",status:"open" },
  { id:"B003", title:"Cross-chain Liquidity Protocol Design",            sponsor:"Uniswap Foundation",  reward:"$35,000", deadline:"2025-04-30", applicants:21, topic:"DeFi",         status:"open" },
  { id:"B004", title:"EigenLayer Slashing Conditions Formal Verification",sponsor:"EigenLayer",          reward:"$60,000", deadline:"2025-05-31", applicants:5,  topic:"Security",     status:"open" },
];

// Media archive — matches the real AthenaX site (Essays, Videos, Logs)
const SEED_MEDIA = [
  { id:"m001", title:"The Case for Optimistic Governance",     date:"2024-10-12", type:"Essay", slug:"optimistic-governance",    body:"Optimistic governance assumes good intent and executes proposals unless vetoed. This essay argues that most DAOs spend too much energy on pre-approval and too little on accountability. We propose a framework where any ARS-verified researcher can submit a governance action, which passes after a 72-hour veto window unless challenged by a quorum. The result is faster coordination, higher researcher agency, and a natural filter against spam — because vetoes are public and attach to the challenger's ARS score." },
  { id:"m002", title:"Prop House Round 4: Recap Video",        date:"2024-09-28", type:"Video", slug:"prop-house-round-4",        body:"A 12-minute video recap of AthenaX Prop House Round 4. Six teams competed for $60K in research funding. Topics spanned ZK proof optimization, DAO voter apathy, and cross-chain liquidity design. The round attracted 34 applicants across 11 universities. Winners were announced live on Warpcast. Full results and funded proposals are available in the Archive." },
  { id:"m003", title:"Building Public Goods with Nouns",       date:"2024-09-15", type:"Essay", slug:"public-goods-nouns",        body:"NounsDAO has quietly become one of the most effective public goods funders in crypto — not because of its treasury size, but because of its culture. This essay traces the mechanics behind Nouns' CC0 ethos, its proliferation model, and why AthenaX chose to build on top of it rather than alongside it. The core thesis: culture is infrastructure. When Nouns funds something, it signals legitimacy to the entire ecosystem." },
  { id:"m004", title:"Manifesto: The End of Corp DAOs",        date:"2024-08-30", type:"Essay", slug:"end-of-corp-daos",          body:"Most DAOs are corporations in disguise. They have a treasury, a small group of insiders who control it, and a governance system designed to look decentralized while behaving like a board. This manifesto argues that real DAO governance requires three things: open membership, ARS-weighted voting, and a public veto record. We outline what each means in practice and why the current generation of protocol DAOs fails all three tests." },
  { id:"m005", title:"Community Call #42 Notes",               date:"2024-08-15", type:"Log",   slug:"community-call-42",         body:"Raw notes from AthenaX Community Call #42. Attendees: 84. Topics covered: Cohort 12 kickoff timeline, ARS v2 scoring update (peerReviews weight increased from 0.20 to 0.25), EigenLayer bounty launch ($60K, formal verification), and Prop House Round 5 preview. Open floor: three researchers raised questions about the Talent Marketplace placement fee structure. Decision deferred to async governance vote. Next call: September 1st." },
  { id:"m006", title:"ZK Research Digest — August 2024",       date:"2024-08-01", type:"Essay", slug:"zk-digest-aug-2024",        body:"Monthly digest covering the most significant ZK research published in August 2024. Highlights: Dankrad Feist's new polynomial commitment scheme reducing prover time by 40%, Yuki Tanaka's follow-up to the SNARK rollup analysis with mobile wallet benchmarks, and two new submissions from Stanford Blockchain on recursive STARKs. Includes a curated reading list and citation network for the month's top 10 papers." },
  { id:"m007", title:"Research Terminal: Launch Announcement",  date:"2024-07-20", type:"Log",   slug:"terminal-launch",           body:"The AthenaX Research Terminal is now in closed beta. Terminal gives protocol BD teams and VC analysts access to a queryable database of all AthenaX-indexed papers, researcher ARS scores, citation graphs, and weekly digests. Initial subscribers: Paradigm, Electric Capital, Variant Fund, and three protocol treasury teams. Open access waitlist is live. Terminal pricing: $500/month per seat, $3,500/month unlimited team access." },
  { id:"m008", title:"Cohort 11 Demo Day Recap",               date:"2024-07-10", type:"Video", slug:"cohort-11-demo-day",        body:"Full 47-minute recording of AthenaX Cohort 11 Demo Day. Five teams presented. Highlights: GovernX (on-chain governance toolkit built on Optimistic Architecture research) raised a $1.2M pre-seed from Variant Fund on demo day. StakeFlow (liquid staking analytics) entered private beta with 3 protocols as design partners. The remaining three teams are continuing development with AthenaX builder support." },
];

const SEED_LEADERBOARD = [
  { rank:1, name:"Dankrad Feist",          university:"ETH Zurich", lab:"EF Research",              citations:315, downloads:8920, votes:487 },
  { rank:2, name:"Dr. James McCarthy",     university:"MIT",        lab:"MIT DCI",                  citations:201, downloads:5670, votes:312 },
  { rank:3, name:"Prof. Vili Lehdonvirta", university:"Oxford",     lab:"Oxford Internet Institute", citations:152, downloads:4550, votes:287 },
  { rank:4, name:"Dr. Yuki Tanaka",        university:"MIT",        lab:"IF Labs",                  citations:142, downloads:3840, votes:234 },
  { rank:5, name:"Dr. Felix Chen",         university:"Stanford",   lab:"Stanford Blockchain",      citations:76,  downloads:1950, votes:143 },
];

// ═══════════════════════════════════════════════════════════
// AUTH DATA LAYER
// ═══════════════════════════════════════════════════════════

// DB helpers first — everything else depends on these
const dbRead  = (k, fb=[]) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):fb; } catch{ return fb; } };
const dbWrite = (k,v) => { try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };
const dbUid   = (p="id") => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const dbNow   = () => new Date().toISOString();

const DB_KEYS = { USERS:"ax_users", SESSION:"ax_session", RESEARCHERS:"ax_researchers", PAPERS:"ax_papers", BOUNTIES:"ax_bounties", APPLICATIONS:"ax_applications", SUBSCRIBERS:"ax_subscribers", SEEDED:"ax_seeded_v2" };

const NEWSLETTERS = [
  {
    id:"weekly-digest",
    name:"Weekly Research Digest",
    freq:"Every Monday",
    desc:"The week's top papers, bounty results, and cohort updates. Curated by the AthenaX team.",
    tags:["Research","Bounties","Cohorts"],
    count:1847,
  },
  {
    id:"protocol-briefing",
    name:"Protocol Briefing",
    freq:"Every Thursday",
    desc:"Deep dives for protocol teams. Governance analysis, tokenomics breakdowns, and sponsor spotlights.",
    tags:["Governance","DeFi","Sponsors"],
    count:634,
  },
  {
    id:"builder-dispatch",
    name:"Builder Dispatch",
    freq:"Bi-weekly",
    desc:"New bounties, open cohort applications, and founder stories from AthenaX graduates.",
    tags:["Bounties","Cohorts","Builders"],
    count:912,
  },
];

const subscriberSvc = {
  getAll: () => dbRead(DB_KEYS.SUBSCRIBERS, []),
  isSubscribed: (email, newsletterId) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []);
    return subs.some(s => s.email === email && s.newsletterId === newsletterId);
  },
  subscribe: (email, newsletterId) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []);
    if (subs.some(s => s.email === email && s.newsletterId === newsletterId)) return { error: "Already subscribed." };
    dbWrite(DB_KEYS.SUBSCRIBERS, [...subs, { id: dbUid("sub"), email, newsletterId, subscribedAt: dbNow() }]);
    return { ok: true };
  },
  unsubscribe: (email, newsletterId) => {
    const subs = dbRead(DB_KEYS.SUBSCRIBERS, []).filter(s => !(s.email === email && s.newsletterId === newsletterId));
    dbWrite(DB_KEYS.SUBSCRIBERS, subs);
    return { ok: true };
  },
  getByEmail: (email) => dbRead(DB_KEYS.SUBSCRIBERS, []).filter(s => s.email === email),
};
const SEED_USERS = [
  { id:"user_001", email:"yuki@mit.edu",       password:"demo123",  name:"Dr. Yuki Tanaka",        role:"researcher", university:"MIT",        lab:"IF Labs",             avatar:"Y", researcherId:"res_001", createdAt:"2024-01-01T00:00:00Z" },
  { id:"user_002", email:"vili@ox.ac.uk",       password:"demo123",  name:"Prof. Vili Lehdonvirta", role:"researcher", university:"Oxford",      lab:"OII",                 avatar:"V", researcherId:"res_002", createdAt:"2024-01-05T00:00:00Z" },
  { id:"user_003", email:"felix@stanford.edu",  password:"demo123",  name:"Dr. Felix Chen",         role:"researcher", university:"Stanford",    lab:"Stanford Blockchain", avatar:"F", researcherId:"res_003", createdAt:"2024-02-01T00:00:00Z" },
  { id:"user_004", email:"james@mit.edu",       password:"demo123",  name:"Dr. James McCarthy",     role:"researcher", university:"MIT",         lab:"MIT DCI",             avatar:"J", researcherId:"res_004", createdAt:"2024-01-10T00:00:00Z" },
  { id:"user_005", email:"dankrad@ef.org",      password:"demo123",  name:"Dankrad Feist",          role:"researcher", university:"ETH Zurich",  lab:"EF Research",         avatar:"D", researcherId:"res_005", createdAt:"2023-11-01T00:00:00Z" },
  { id:"user_s01", email:"grants@ethereum.org", password:"demo123",  name:"Ethereum Foundation",    role:"sponsor",    organization:"Ethereum Foundation", avatar:"E", createdAt:"2024-01-01T00:00:00Z" },
  { id:"user_s02", email:"research@arbitrum.io",password:"demo123",  name:"Arbitrum Research",      role:"sponsor",    organization:"Arbitrum",            avatar:"A", createdAt:"2024-02-01T00:00:00Z" },
  { id:"user_adm", email:"admin@athenax.io",    password:"admin123", name:"AthenaX Admin",          role:"admin",                                          avatar:"X", createdAt:"2023-10-01T00:00:00Z" },
];
const SEED_RESEARCHERS = [
  { id:"res_001", userId:"user_001", name:"Dr. Yuki Tanaka",        university:"MIT",       lab:"IF Labs",   bio:"ZK proof systems researcher.",         avatar:"Y", citations:142, peerReviews:12, downloads:3840, votes:234, sponsorEndorsements:3, bountyCompletions:2 },
  { id:"res_002", userId:"user_002", name:"Prof. Vili Lehdonvirta", university:"Oxford",    lab:"OII",       bio:"Internet & Society researcher.",       avatar:"V", citations:152, peerReviews:15, downloads:3550, votes:287, sponsorEndorsements:2, bountyCompletions:1 },
  { id:"res_003", userId:"user_003", name:"Dr. Felix Chen",         university:"Stanford",  lab:"Stanford Blockchain", bio:"DeFi protocol designer.",     avatar:"F", citations:76,  peerReviews:7,  downloads:1950, votes:143, sponsorEndorsements:1, bountyCompletions:3 },
  { id:"res_004", userId:"user_004", name:"Dr. James McCarthy",     university:"MIT",       lab:"MIT DCI",   bio:"AI agents & multi-chain systems.",     avatar:"J", citations:201, peerReviews:18, downloads:5670, votes:312, sponsorEndorsements:4, bountyCompletions:2 },
  { id:"res_005", userId:"user_005", name:"Dankrad Feist",          university:"ETH Zurich",lab:"EF Research",bio:"Ethereum protocol, polynomial commitments.", avatar:"D", citations:315, peerReviews:24, downloads:8920, votes:487, sponsorEndorsements:5, bountyCompletions:4 },
];

const initDB = () => {
  if (localStorage.getItem(DB_KEYS.SEEDED)) return;
  dbWrite(DB_KEYS.USERS, SEED_USERS);
  dbWrite(DB_KEYS.RESEARCHERS, SEED_RESEARCHERS);
  dbWrite(DB_KEYS.APPLICATIONS, []);
  localStorage.setItem(DB_KEYS.SEEDED, "1");
};

const calcARS = (r) => {
  if (!r) return 0;
  const s = (r.citations||0)*0.30 + (r.peerReviews||0)*0.25 +
    Math.min((r.downloads||0)/1000,20)*0.15 + Math.min((r.votes||0)/100,20)*0.15 +
    (r.sponsorEndorsements||0)*0.10 + (r.bountyCompletions||0)*0.05;
  return Math.min(10, parseFloat(s.toFixed(1)));
};

const authSvc = {
  getSession: () => { const s=dbRead(DB_KEYS.SESSION,null); if(!s?.userId) return null; return dbRead(DB_KEYS.USERS).find(u=>u.id===s.userId)||null; },
  login: (email,password) => { const user=dbRead(DB_KEYS.USERS).find(u=>u.email===email&&u.password===password); if(!user) return {error:"Invalid email or password."}; dbWrite(DB_KEYS.SESSION,{userId:user.id,loginAt:dbNow()}); return {user}; },
  logout: () => localStorage.removeItem(DB_KEYS.SESSION),
  register: (data) => {
    const users=dbRead(DB_KEYS.USERS);
    if(users.find(u=>u.email===data.email)) return {error:"An account with this email already exists."};
    const user={id:dbUid("user"),...data,avatar:data.name?.charAt(0).toUpperCase()||"?",createdAt:dbNow()};
    dbWrite(DB_KEYS.USERS,[...users,user]);
    if(data.role==="researcher"){
      const rs=dbRead(DB_KEYS.RESEARCHERS);
      dbWrite(DB_KEYS.RESEARCHERS,[...rs,{id:dbUid("res"),userId:user.id,name:data.name,university:data.university||"",lab:data.lab||"",bio:data.bio||"",avatar:user.avatar,citations:0,peerReviews:0,downloads:0,votes:0,sponsorEndorsements:0,bountyCompletions:0}]);
    }
    dbWrite(DB_KEYS.SESSION,{userId:user.id,loginAt:dbNow()});
    return {user};
  },
  updateProfile: (userId,updates) => {
    const users=dbRead(DB_KEYS.USERS).map(u=>u.id===userId?{...u,...updates,updatedAt:dbNow()}:u);
    dbWrite(DB_KEYS.USERS,users);
    const updated=users.find(u=>u.id===userId);
    if(updated?.role==="researcher"){const rs=dbRead(DB_KEYS.RESEARCHERS);const ri=rs.findIndex(r=>r.userId===userId);if(ri>=0){["name","bio","university","lab"].forEach(k=>{if(updates[k]!==undefined)rs[ri][k]=updates[k];});dbWrite(DB_KEYS.RESEARCHERS,rs);}}
    return updated;
  },
  getResearcher: (userId) => dbRead(DB_KEYS.RESEARCHERS).find(r=>r.userId===userId)||null,
  getPapersByUser: (userId) => SEED_PAPERS.filter(p=>(p.authorIds||[]).includes(userId)),
  getApplications: (userId) => dbRead(DB_KEYS.APPLICATIONS).filter(a=>a.userId===userId),
  DEMO_ACCOUNTS: [
    {label:"Researcher — Dr. Yuki Tanaka",  email:"yuki@mit.edu",        password:"demo123"},
    {label:"Researcher — Dankrad Feist",    email:"dankrad@ef.org",      password:"demo123"},
    {label:"Sponsor — Ethereum Foundation", email:"grants@ethereum.org", password:"demo123"},
    {label:"Admin",                         email:"admin@athenax.io",    password:"admin123"},
  ],
};

// ═══════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Space Grotesk', sans-serif;
      background-color: #F2EFE9;
      color: #1C1C27;
      min-height: 100vh;
    }

    /* Grain texture overlay */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #F2EFE9; }
    ::-webkit-scrollbar-thumb { background: #1C1C27; border-radius: 3px; }

    /* ── Typography ── */
    h1, h2, h3, h4 { font-family: 'Space Grotesk', sans-serif; font-weight: 700; color: #1C1C27; line-height: 1.1; letter-spacing: -0.02em; }

    /* ── Mono ── */
    .mono { font-family: 'Space Mono', monospace; }

    /* ── Layout ── */
    :root {
      --page-max-width: 1280px;
      --page-gutter: 40px;
      --section-space: 72px;
      --section-gap-lg: 52px;
      --section-gap-md: 32px;
      --section-gap-sm: 24px;
      --content-narrow-md: 800px;
      --content-narrow-sm: 720px;
    }
    .page-wrap {
      width: 100%;
      max-width: var(--page-max-width);
      margin: 0 auto;
      padding-inline: var(--page-gutter);
    }
    .page-wrap-narrow-md { max-width: var(--content-narrow-md); }
    .page-wrap-narrow-sm { max-width: var(--content-narrow-sm); }
    .section { padding-block: var(--section-space); }
    .section-stack-lg > * + * { margin-top: var(--section-gap-lg); }
    .section-stack-md > * + * { margin-top: var(--section-gap-md); }
    .section-stack-sm > * + * { margin-top: var(--section-gap-sm); }
    .section-heading > * + * { margin-top: 8px; }
    .section-heading-tight > * + * { margin-top: 6px; }
    .section-heading p:last-child,
    .section-stack-lg > *:last-child,
    .section-stack-md > *:last-child,
    .section-stack-sm > *:last-child { margin-bottom: 0; }
    @media(max-width:1024px) {
      :root {
        --page-gutter: 28px;
        --section-space: 64px;
      }
    }
    @media(max-width:768px) {
      :root {
        --page-gutter: 20px;
        --section-space: 56px;
        --section-gap-lg: 40px;
        --section-gap-md: 24px;
      }
    }

    /* ── Navbar ── */
    .navbar {
      position: sticky; top: 0; z-index: 100;
      background: #F2EFE9;
      border-bottom: 2px solid #1C1C27;
      height: 68px;
      display: flex; align-items: center;
    }
    .navbar-inner {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; max-width: var(--page-max-width); margin: 0 auto; padding-inline: var(--page-gutter);
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      font-weight: 700; font-size: 18px; color: #1C1C27;
      cursor: pointer; text-decoration: none; border: none; background: none;
    }
    .nav-logo svg { width: 28px; height: 28px; }
    .nav-links { display: flex; align-items: center; gap: 8px; }
    .nav-link {
      padding: 7px 18px; font-size: 15px; font-weight: 500; color: #1C1C27;
      background: none; border: none; cursor: pointer; border-radius: 999px;
      transition: all 0.1s;
    }
    .nav-link:hover { background: rgba(28,28,39,0.07); }
    .nav-link.active {
      background: #F5D94E; border: 2px solid #1C1C27;
      font-weight: 600; box-shadow: 2px 2px 0px #1C1C27;
    }
    .nav-link.active:hover { transform: translate(1px,1px); box-shadow: 1px 1px 0 #1C1C27; }
    .nav-right { display: flex; align-items: center; gap: 10px; }

    /* ── Buttons ── */
    .btn {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 15px; font-weight: 600;
      border-radius: 10px; cursor: pointer;
      transition: all 0.1s ease; border: 2px solid #1C1C27;
      padding: 10px 22px; white-space: nowrap;
    }
    .btn-primary { background: #E8323C; color: #fff; box-shadow: 4px 4px 0 #1C1C27; }
    .btn-primary:hover { box-shadow: none; transform: translate(4px,4px); }
    .btn-outline { background: #fff; color: #1C1C27; box-shadow: 4px 4px 0 #1C1C27; }
    .btn-outline:hover { box-shadow: none; transform: translate(4px,4px); }
    .btn-ghost { background: transparent; color: #1C1C27; box-shadow: 3px 3px 0 #1C1C27; }
    .btn-ghost:hover { box-shadow: none; transform: translate(3px,3px); }
    .btn-sm { padding: 7px 16px; font-size: 13px; border-radius: 8px; box-shadow: 3px 3px 0 #1C1C27; }
    .btn-sm:hover { box-shadow: none; transform: translate(3px,3px); }

    /* ── Window Cards ── */
    .window-card {
      border: 2px solid #1C1C27;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 5px 5px 0 #1C1C27;
      background: transparent;
    }
    .window-titlebar {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 14px;
      background: #F2EFE9;
      border-bottom: 2px solid #1C1C27;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
    .dot-r { background: #E8323C; }
    .dot-y { background: #F5D94E; }
    .dot-g { background: #4CAF50; }
    .titlebar-label {
      font-family: 'Space Mono', monospace;
      font-size: 10px; font-weight: 400;
      letter-spacing: 0.07em; text-transform: uppercase;
      color: #1C1C27; margin-left: 6px;
    }
    .window-body { background: #fff; padding: 28px 30px; }
    .window-body-blue   { background: #EAF0F6; }
    .window-body-yellow { background: #F9F5DC; }
    .window-body-cream  { background: #F2EFE9; }

    /* ── Path Badge ── */
    .path-badge {
      display: inline-block;
      font-family: 'Space Mono', monospace;
      font-size: 11px; letter-spacing: 0.05em;
      color: #1C1C27; background: #F2EFE9;
      border: 1.5px solid #1C1C27; border-radius: 6px;
      padding: 4px 11px; margin-bottom: 18px;
    }

    /* ── Feature Tags ── */
    .ftag {
      display: inline-block;
      font-size: 12px; font-weight: 500;
      color: #1C1C27; background: #F2EFE9;
      border: 1.5px solid #1C1C27; border-radius: 6px;
      padding: 4px 10px;
    }

    /* ── Topic Pill ── */
    .topic-pill {
      display: inline-block;
      font-size: 11px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
      color: #1C1C27; background: #F5D94E;
      border: 1.5px solid #1C1C27; border-radius: 999px;
      padding: 3px 10px;
    }

    /* ── Status Badge ── */
    .status-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: #F2EFE9; border: 1.5px solid #1C1C27;
      border-radius: 999px; padding: 5px 14px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.07em; text-transform: uppercase; color: #1C1C27;
      margin-bottom: 28px;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

    /* ── Section Divider ── */
    .divider { height: 1px; background: #D8D4CC; border: none; margin: 28px 0 44px; }
    .divider-sm { height: 1px; background: #D8D4CC; border: none; margin: 18px 0 14px; }

    /* ── Archive Rows ── */
    .archive-row {
      display: flex; align-items: center; gap: 18px;
      padding: 18px 22px;
      background: #fff; border: 2px solid #1C1C27; border-radius: 12px;
      margin-bottom: 10px; cursor: pointer; transition: all 0.1s;
    }
    .archive-row:hover { box-shadow: 4px 4px 0 #1C1C27; transform: translate(-2px,-2px); }
    .archive-row:hover .archive-title { color: #E8323C; }
    .archive-row.active { box-shadow: 4px 4px 0 #1C1C27; transform: translate(-2px,-2px); }
    .archive-row.active .archive-title { color: #E8323C; }
    .archive-icon {
      width: 42px; height: 42px; border-radius: 8px; border: 1.5px solid #1C1C27;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 16px;
    }
    .archive-title { font-size: 16px; font-weight: 700; color: #1C1C27; transition: color 0.1s; }
    .archive-meta { font-size: 12px; color: #6B6B7A; margin-top: 2px; }

    /* ── Link arrow ── */
    .link-arrow { font-size: 14px; font-weight: 600; color: #1C1C27; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; border: none; background: none; padding: 0; }
    .link-arrow:hover { color: #E8323C; }

    /* ── Icon tiles ── */
    .icon-tile { width: 60px; height: 60px; border-radius: 12px; border: 2px solid #1C1C27; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 18px; }
    .icon-tile-green  { background: #D4EDDA; }
    .icon-tile-yellow { background: #FEF3C7; }
    .icon-tile-pink   { background: #F5DDE0; }
    .icon-tile-blue   { background: #DBEAFE; }

    /* ── Footer ── */
    .footer { background: #F2EFE9; border-top: 2px solid #1C1C27; padding: 56px 40px 28px; margin-top: 100px; }
    .footer-inner { max-width: 1280px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-start; gap: 40px; flex-wrap: wrap; }
    .footer-subscribe-inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; width: 100%; }
    .footer-subscribe-copy { flex: 1 1 420px; min-width: 0; max-width: 560px; }
    .footer-subscribe-form { display: flex; align-items: center; gap: 8px; flex: 1 1 520px; min-width: 0; justify-content: flex-end; }
    .footer-subscribe-input { flex: 1 1 320px; min-width: 0; }
    .footer-subscribe-button { flex: 0 0 auto; }
    .footer-subscribe-done { flex: 0 0 auto; }
    .footer-brand { font-size: 26px; font-weight: 700; color: #1C1C27; margin-bottom: 8px; }
    .footer-tagline { font-size: 14px; color: #1C1C27; line-height: 1.6; }
    .footer-col-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #1C1C27; margin-bottom: 14px; }
    .footer-link { font-size: 14px; color: #1C1C27; cursor: pointer; display: block; margin-bottom: 9px; background: none; border: none; padding: 0; text-align: left; }
    .footer-link:hover { color: #E8323C; }
    .footer-legal { font-family: 'Space Mono', monospace; font-size: 11px; color: #6B6B7A; text-align: center; margin-top: 44px; padding-top: 22px; border-top: 1px solid #D8D4CC; letter-spacing: 0.04em; }

    /* ── Toast ── */
    .toast-wrap { position: fixed; bottom: 28px; right: 28px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast {
      display: flex; align-items: center; gap: 12px;
      background: #1C1C27; color: #fff;
      border-radius: 10px; padding: 13px 18px;
      font-size: 14px; font-weight: 500;
      box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
      animation: slideIn 0.2s ease;
    }
    @keyframes slideIn { from{transform:translateX(60px);opacity:0} to{transform:translateX(0);opacity:1} }
    .toast-success .toast-dot { color: #4CAF50; }
    .toast-error   .toast-dot { color: #E8323C; }
    .toast-info    .toast-dot { color: #F5D94E; }

    /* ── Modal ── */
    .modal-overlay { position: fixed; inset: 0; background: rgba(28,28,39,0.55); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-box { background: #F2EFE9; border: 2px solid #1C1C27; border-radius: 14px; box-shadow: 8px 8px 0 #1C1C27; width: 100%; max-width: 500px; overflow: hidden; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 22px; border-bottom: 2px solid #1C1C27; background: #F2EFE9; }
    .modal-title { font-size: 16px; font-weight: 700; }
    .modal-body { padding: 24px 22px; }
    .modal-close { background: none; border: none; cursor: pointer; font-size: 20px; color: #1C1C27; line-height: 1; }

    /* ── Form inputs ── */
    .inp {
      width: 100%; padding: 10px 13px;
      font-family: 'Space Grotesk', sans-serif; font-size: 14px;
      background: #fff; border: 2px solid #1C1C27; border-radius: 8px;
      outline: none; color: #1C1C27; margin-top: 5px;
      transition: box-shadow 0.1s;
    }
    .inp:focus { box-shadow: 3px 3px 0 #1C1C27; }
    .inp-label { font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: #6B6B7A; text-transform: uppercase; display: block; }
    .inp-error { font-size: 12px; color: #E8323C; margin-top: 6px; font-weight: 500; }
    .inp-group { margin-bottom: 16px; }
    select.inp { cursor: pointer; }

    /* ── ARS bar ── */
    .ars-bar-bg { height: 8px; background: #D8D4CC; border-radius: 4px; overflow: hidden; }
    .ars-bar-fill { height: 100%; background: #E8323C; border-radius: 4px; transition: width 0.4s ease; }

    /* ── Stat card ── */
    .stat-card { background: #fff; border: 2px solid #1C1C27; border-radius: 10px; padding: 18px 20px; }
    .stat-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6B7A; margin-bottom: 6px; }
    .stat-value { font-size: 26px; font-weight: 700; color: #1C1C27; }
    .stat-sub { font-size: 12px; color: #6B6B7A; margin-top: 3px; }

    /* ── Grid helpers ── */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
    @media(max-width:900px) { .grid-3 { grid-template-columns: 1fr 1fr; } .grid-4 { grid-template-columns: 1fr 1fr; } }
    @media(max-width:640px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
    @media(max-width:900px) {
      .footer-subscribe-inner { flex-direction: column; align-items: stretch; justify-content: flex-start; gap: 20px; }
      .footer-subscribe-copy { flex: 1 1 auto; max-width: none; }
      .footer-subscribe-form { width: 100%; flex: 1 1 auto; flex-direction: column; align-items: stretch; justify-content: flex-start; }
      .footer-subscribe-input { width: 100%; flex: 1 1 auto; }
      .footer-subscribe-button { width: 100%; }
      .footer-subscribe-button .btn { width: 100%; justify-content: center; }
      .footer-subscribe-done { width: 100%; }
    }

    /* ── Leaderboard ── */
    .lb-row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-bottom: 1px solid #D8D4CC; }
    .lb-row:last-child { border-bottom: none; }
    .lb-rank { font-family: 'Space Mono', monospace; font-size: 13px; font-weight: 700; width: 24px; color: #6B6B7A; }
    .lb-rank.gold { color: #E8323C; }
    .lb-avatar { width: 36px; height: 36px; border-radius: 50%; background: #F5D94E; border: 2px solid #1C1C27; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
    .lb-name { font-weight: 600; font-size: 14px; }
    .lb-meta { font-size: 12px; color: #6B6B7A; }
    .lb-ars { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: #E8323C; margin-left: auto; }

    /* ── Canvas graph ── */
    canvas { display: block; }

    /* ── Docs sidebar ── */
    .docs-sidebar { width: 220px; flex-shrink: 0; }
    .docs-sidebar-link { display: block; padding: 9px 14px; font-size: 14px; font-weight: 500; color: #1C1C27; cursor: pointer; border-radius: 8px; border: none; background: none; width: 100%; text-align: left; transition: background 0.1s; }
    .docs-sidebar-link:hover { background: rgba(28,28,39,0.07); }
    .docs-sidebar-link.active { background: #F5D94E; font-weight: 600; border: 1.5px solid #1C1C27; }
    .docs-layout { display: flex; gap: 48px; }
    .docs-content { flex: 1; min-width: 0; }

    /* ── Spinner ── */
    @keyframes spin { to{ transform:rotate(360deg); } }
    .spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid #D8D4CC; border-top-color: #1C1C27; border-radius: 50%; animation: spin 0.6s linear infinite; }

    /* ── Responsive nav ── */
    @media(max-width:768px) {
      .nav-links { display: none; }
      .footer-inner { flex-direction: column; }
      .docs-layout { flex-direction: column; }
      .docs-sidebar { width: 100%; }
    }
  `}</style>
);

// Funding page icon lookup — maps label key → icon component
const FUNDING_ICONS = {
  SPONSORED_PROGRAMS: IconSponsoredPrograms,
  BOUNTIES:           IconBounties,
  COHORT_FEES:        IconCohortFees,
  TERMINAL_SUBS:      IconTerminal,
  TALENT_PLACEMENT:   IconTalentPlacement,
  STARTUP_EQUITY:     IconStartupEquity,
};

// ═══════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════

const AthenaXMark = ({ size=28 }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="28" height="28" rx="6" fill="#1C1C27"/>
    <path d="M7 14C7 10.134 10.134 7 14 7C17.866 7 21 10.134 21 14C21 17.866 17.866 21 14 21C10.134 21 7 17.866 7 14Z" stroke="#F2EFE9" strokeWidth="2"/>
    <path d="M10 14C10 12.343 11.343 11 13 11H15C16.657 11 18 12.343 18 14C18 15.657 16.657 17 15 17H13C11.343 17 10 15.657 10 14Z" fill="#F5D94E"/>
  </svg>
);

const BrandBlock = ({ compact=false }) => (
  <div style={{display:"flex",alignItems:compact ? "center" : "flex-start",gap:compact ? 12 : 14}}>
    <div>
      <h4
        className={compact ? "text-xl mb-0" : "text-2xl mb-2"}
      >
        AthenaX
      </h4>
      {!compact && (
        <p className="text-sm max-w-xs" style={{color:"#6B6B7A",lineHeight:1.65,margin:0}}>
          Powered by{" "}
          <Link href="https://nouns.wtf" target="_blank" rel="noopener noreferrer">
            <img
              src="https://athenax.mypinx.store/Noggles.png"
              alt="Noggles Logo"
              width={100}
              height={70}
              className="inline-block mb-1 ml-1 h-4 w-auto"
            />
          </Link>
          <br />
          Building public goods on Ethereum.
        </p>
      )}
    </div>
  </div>
);

const Toast = ({ msg, onClose }) => {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return ()=>clearTimeout(t); },[]);
  const icon = msg.type==="success" ? "●" : msg.type==="error" ? "●" : "●";
  return (
    <div className={`toast toast-${msg.type}`}>
      <span className="toast-dot">{icon}</span>
      <span>{msg.text}</span>
      <button onClick={onClose} style={{marginLeft:"auto",background:"none",border:"none",color:"#fff",cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal-box">
      <div className="modal-header">
        <div className="window-titlebar" style={{border:"none",padding:0,background:"none",flex:1}}>
          <TrafficLights/>
          <span className="titlebar-label" style={{marginLeft:8}}>{title}</span>
        </div>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

const StatCard = ({ label, value, sub="" }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

// ═══════════════════════════════════════════════════════════
// LOGIN MODAL
// ═══════════════════════════════════════════════════════════
const LoginModal = ({ onClose, onSuccess, showToast }) => {
  const [email,setEmail] = useState("");
  const [pw,setPw] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const submit = () => {
    if(!email||!pw){setError("Please fill in all fields.");return;}
    setLoading(true); setError("");
    setTimeout(()=>{
      const r=authSvc.login(email,pw); setLoading(false);
      if(r.error){setError(r.error);return;}
      onSuccess(r.user); onClose(); showToast(`Welcome back, ${r.user.name.split(" ")[0]}!`,"success");
    },400);
  };

  return (
    <Modal title="SIGN_IN.SYS" onClose={onClose}>
      <div className="inp-group">
        <label className="inp-label">Email</label>
        <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@university.edu" onKeyDown={e=>e.key==="Enter"&&submit()}/>
      </div>
      <div className="inp-group">
        <label className="inp-label">Password</label>
        <input className="inp" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/>
      </div>
      {error && <div className="inp-error">{error}</div>}
      <button className="btn btn-primary" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={submit} disabled={loading}>
        {loading ? <span className="spinner"/> : "Sign In →"}
      </button>
      <hr className="divider-sm" style={{margin:"18px 0 12px"}}/>
      <div style={{fontSize:11,color:"#6B6B7A",fontFamily:"'Space Mono',monospace",marginBottom:8,letterSpacing:"0.04em"}}>DEMO ACCOUNTS</div>
      {authSvc.DEMO_ACCOUNTS.map(a=>(
        <button key={a.email} className="btn btn-ghost btn-sm" style={{width:"100%",marginBottom:6,justifyContent:"flex-start",fontSize:12}}
          onClick={()=>{setEmail(a.email);setPw(a.password);}}>
          {a.label}
        </button>
      ))}
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════
// REGISTER MODAL
// ═══════════════════════════════════════════════════════════
const RegisterModal = ({ onClose, onSuccess, showToast }) => {
  const [step,setStep] = useState(1);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [form,setForm] = useState({name:"",email:"",password:"",confirm:"",role:"researcher",university:"",lab:"",bio:"",organization:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  const step1ok = () => {
    if(!form.name.trim()) return "Name is required.";
    if(!form.email.includes("@")) return "Valid email required.";
    if(form.password.length<6) return "Password must be 6+ characters.";
    if(form.password!==form.confirm) return "Passwords do not match.";
    return null;
  };

  const submit = () => {
    if(step===1){const e=step1ok();if(e){setError(e);return;}setError("");setStep(2);return;}
    setLoading(true); setError("");
    setTimeout(()=>{
      const r=authSvc.register({name:form.name.trim(),email:form.email.trim(),password:form.password,role:form.role,university:form.university,lab:form.lab,bio:form.bio,organization:form.organization});
      setLoading(false);
      if(r.error){setError(r.error);return;}
      onSuccess(r.user); onClose(); showToast(`Welcome to AthenaX, ${r.user.name.split(" ")[0]}!`,"success");
    },500);
  };

  return (
    <Modal title="JOIN_NETWORK.SYS" onClose={onClose}>
      <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:"#6B6B7A",marginBottom:16,letterSpacing:"0.04em"}}>STEP {step} OF 2</div>
      {step===1 ? (<>
        <div className="inp-group"><label className="inp-label">Full Name</label><input className="inp" value={form.name} onChange={set("name")} placeholder="Dr. Jane Smith"/></div>
        <div className="inp-group"><label className="inp-label">Email</label><input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="jane@university.edu"/></div>
        <div className="inp-group"><label className="inp-label">Password</label><input className="inp" type="password" value={form.password} onChange={set("password")} placeholder="6+ characters"/></div>
        <div className="inp-group"><label className="inp-label">Confirm Password</label><input className="inp" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password"/></div>
      </>) : (<>
        <div className="inp-group">
          <label className="inp-label">I am a</label>
          <select className="inp" value={form.role} onChange={set("role")}>
            <option value="researcher">Researcher</option>
            <option value="sponsor">Protocol Sponsor</option>
            <option value="builder">Builder</option>
          </select>
        </div>
        {form.role==="researcher" && <>
          <div className="inp-group"><label className="inp-label">University</label><input className="inp" value={form.university} onChange={set("university")} placeholder="MIT, Oxford, Stanford…"/></div>
          <div className="inp-group"><label className="inp-label">Research Lab</label><input className="inp" value={form.lab} onChange={set("lab")} placeholder="Your lab or group"/></div>
          <div className="inp-group"><label className="inp-label">Bio</label><textarea className="inp" value={form.bio} onChange={set("bio")} placeholder="Brief research focus…" rows={3}/></div>
        </>}
        {(form.role==="sponsor"||form.role==="builder") && <div className="inp-group"><label className="inp-label">Organization</label><input className="inp" value={form.organization} onChange={set("organization")} placeholder="Protocol / company name"/></div>}
      </>)}
      {error && <div className="inp-error">{error}</div>}
      <div style={{display:"flex",gap:10,marginTop:10}}>
        {step===2 && <button className="btn btn-ghost" onClick={()=>{setStep(1);setError("");}}>← Back</button>}
        <button className="btn btn-primary" style={{flex:1,justifyContent:"center"}} onClick={submit} disabled={loading}>
          {loading ? <span className="spinner"/> : step===1 ? "Next →" : "Join Network →"}
        </button>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════
// ARS BREAKDOWN
// ═══════════════════════════════════════════════════════════
const ArsBreakdown = ({ r }) => {
  const comps = [
    {label:"Citations",            weight:0.30, value:r.citations||0,           max:null},
    {label:"Peer Reviews",         weight:0.25, value:r.peerReviews||0,          max:null},
    {label:"Downloads",            weight:0.15, value:Math.min((r.downloads||0)/1000,20), max:20},
    {label:"Votes",                weight:0.15, value:Math.min((r.votes||0)/100,20),      max:20},
    {label:"Sponsor Endorsements", weight:0.10, value:r.sponsorEndorsements||0,  max:null},
    {label:"Bounty Completions",   weight:0.05, value:r.bountyCompletions||0,    max:null},
  ];
  const ars = calcARS(r);
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,letterSpacing:"0.06em",color:"#6B6B7A"}}>ARS SCORE</span>
        <span style={{fontSize:28,fontWeight:700,color:"#E8323C"}}>{ars}</span>
      </div>
      <div className="ars-bar-bg" style={{marginBottom:18}}><div className="ars-bar-fill" style={{width:`${(ars/10)*100}%`}}/></div>
      {comps.map(c=>{
        const contrib = parseFloat((c.value*c.weight).toFixed(2));
        return (
          <div key={c.label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #D8D4CC",fontSize:13}}>
            <span style={{color:"#6B6B7A"}}>{c.label}</span>
            <span style={{fontFamily:"'Space Mono',monospace",fontWeight:700}}>+{contrib}</span>
          </div>
        );
      })}
      <div style={{fontSize:11,color:"#6B6B7A",marginTop:12,fontFamily:"'Space Mono',monospace",letterSpacing:"0.04em"}}>
        FORMULA: citations×0.30 + peerReviews×0.25 + downloads×0.15 + votes×0.15 + endorsements×0.10 + bounties×0.05
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════════════════
// Global toast ref — lets Footer call showToast without prop drilling
let _globalShowToast = (text, type) => {};

const FooterSubscribe = () => {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = () => {
    if (!email.includes("@")) { _globalShowToast("Enter a valid email.", "error"); return; }
    const r = subscriberSvc.subscribe(email.trim(), "weekly-digest");
    if (r.error) { _globalShowToast("Already subscribed!", "info"); }
    else { setDone(true); _globalShowToast("Subscribed to the Weekly Digest!", "success"); }
  };
  return (
    <div style={{borderBottom:"1px solid #D8D4CC",paddingBottom:40,marginBottom:40}}>
      <div className="page-wrap footer-subscribe-inner">
        <div className="footer-subscribe-copy">
          <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>Weekly Research Digest</div>
          <div style={{fontSize:14,color:"#6B6B7A",lineHeight:1.7}}>Top papers, bounties, and cohort news — every Monday.</div>
        </div>
        {done ? (
          <div className="footer-subscribe-done" style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#15803D",letterSpacing:"0.05em"}}>✓ YOU'RE IN</div>
        ) : (
          <div className="footer-subscribe-form">
            <div className="footer-subscribe-input">
              <input className="inp" style={{padding:"9px 14px",fontSize:14,marginTop:0}} value={email}
              onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
            </div>
            <div className="footer-subscribe-button">
              <button className="btn btn-primary btn-sm" onClick={submit}>Subscribe →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = ({ setPage }) => (
  <footer className="footer" style={{paddingTop:0}}>
    <div style={{paddingTop:48}}>
      <FooterSubscribe/>    </div>
    <div className="footer-inner">
      <BrandBlock />
      <div style={{display:"flex",gap:56,flexWrap:"wrap"}}>
        <div>
          <div className="footer-col-label">Research</div>
          <button className="footer-link" onClick={()=>setPage("archive")}>Archive</button>
          <button className="footer-link" onClick={()=>setPage("leaderboard")}>Leaderboard</button>
          <button className="footer-link" onClick={()=>setPage("submit-paper")}>Submit a Paper</button>
          <button className="footer-link" onClick={()=>setPage("bounties")}>Bounties</button>
          <button className="footer-link" onClick={()=>setPage("cohorts")}>Cohorts</button>
        </div>
        <div>
          <div className="footer-col-label">Network</div>
          <button className="footer-link" onClick={()=>setPage("labs")}>Labs</button>
          <button className="footer-link" onClick={()=>setPage("universities")}>Universities</button>
          <button className="footer-link" onClick={()=>setPage("sponsors")}>Sponsors</button>
          <button className="footer-link" onClick={()=>setPage("talent")}>Talent</button>
        </div>
        <div>
          <div className="footer-col-label">Resources</div>
          <button className="footer-link" onClick={()=>setPage("docs")}>Docs</button>
          <button className="footer-link" onClick={()=>setPage("digest")}>Newsletter</button>
          <button className="footer-link" onClick={()=>setPage("how-it-works")}>How It Works</button>
          <button className="footer-link" onClick={()=>setPage("about")}>About</button>
          <button className="footer-link" onClick={()=>setPage("business-model")}>Business Model</button>
          <button className="footer-link" onClick={()=>setPage("docs-media")}>Media Kit</button>
        </div>
      </div>
    </div>
    <div className="footer-legal">CC0 /// NO RIGHTS RESERVED /// OPEN SOURCE</div>
  </footer>
);

// ═══════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════
const HomePage = ({ setPage, latestArticles, articlesLoading, articlesError }) => {
  const [tick,setTick] = useState(true);
  useEffect(()=>{ const id=setInterval(()=>setTick(t=>!t),800); return ()=>clearInterval(id); },[]);

  return (
    <div>
      <div className="page-wrap section">
        {/* Hero */}
        <div className="grid-2" style={{alignItems:"center",gap:60}}>
          <div>
            <div className="status-badge"><div className="status-dot"/><span>System Online</span></div>
            <h1 style={{fontSize:"clamp(44px,7vw,80px)",lineHeight:1.0,marginBottom:28}}>
              The Research<br/>
              Engine of <span style={{color:"#E8323C"}}>Web3.</span>
            </h1>
            <p style={{fontSize:18,lineHeight:1.6,color:"#1C1C27",marginBottom:32,maxWidth:480}}>
              AthenaX connects universities, research labs, and protocol ecosystems to produce credentialed open research — then turns validated ideas into funded startups.
            </p>
            <p style={{fontSize:14,color:"#6B6B7A",marginBottom:36,fontStyle:"italic"}}>Researchers get paid. Protocols get credibility. Ideas become companies.</p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              <button className="btn btn-primary" style={{fontSize:16,padding:"13px 28px"}} onClick={()=>setPage("how-it-works")}>How It Works →</button>
              <button className="btn btn-outline" style={{fontSize:16,padding:"13px 28px"}} onClick={()=>setPage("archive")}>Research Archive</button>
            </div>
          </div>
          <div>
            <WindowCard label="SYS_MONITOR">
              <div style={{marginBottom:20}}>
                {[{w:"72%",c:"#E8323C"},{w:"45%",c:"#D8D4CC"},{w:"88%",c:"#1C1C27"},{w:"33%",c:"#D8D4CC"},{w:"60%",c:"#E8323C"}].map((l,i)=>(
                  <div key={i} style={{height:7,width:l.w,background:l.c,borderRadius:4,marginBottom:7}}/>
                ))}
              </div>
              <div className="grid-2" style={{gap:12}}>
                <div className="stat-card"><div className="stat-label">Papers Published</div><div className="stat-value">420</div></div>
                <div className="stat-card"><div className="stat-label">Treasury</div><div className="stat-value" style={{fontSize:20,color:"#15803D",fontStyle:"italic"}}>Active</div></div>
                <div className="stat-card"><div className="stat-label">Researchers</div><div className="stat-value">1,847</div></div>
                <div className="stat-card"><div className="stat-label">Prize Pool</div><div className="stat-value">$2.4M</div></div>
              </div>
              <div style={{marginTop:16,padding:"10px 14px",background:"#F2EFE9",borderRadius:8,border:"1.5px solid #1C1C27",fontFamily:"'Space Mono',monospace",fontSize:11,color:"#1C1C27"}}>
                <span style={{color:"#4CAF50"}}>●</span> CURSOR: {tick ? "_" : " "}&nbsp;&nbsp;EPOCH 420.69
              </div>
            </WindowCard>
          </div>
        </div>

        {/* Stats row */}
        <div style={{marginTop:72}}>
          <div className="grid-4">
            {[
              {label:"Active Cohorts",   value:"12"},
              {label:"Partner Labs",     value:"34"},
              {label:"Total Sponsors",   value:"6"},
              {label:"Papers Published", value:"420"},
            ].map(s=><StatCard key={s.label} label={s.label} value={s.value}/>)}
          </div>
        </div>

        {/* START HERE */}
        <div style={{marginTop:72}}>
          <div style={{marginBottom:8}}><div className="path-badge">/root/start</div></div>
          <h2 style={{fontSize:36,marginBottom:8}}>Start Here.</h2>
          <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>Pick your path into the AthenaX network.</p>
          <hr className="divider"/>
          <div className="grid-4">
            <WindowCard label="DIR: /RESEARCH">
              <div className="icon-tile icon-tile-blue"><IconLabs/></div>
              <h3 style={{fontSize:18,marginBottom:8}}>Explore Research</h3>
              <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6,marginBottom:16}}>Browse papers, essays, and the full AthenaX knowledge archive.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("archive")}>Open Archive →</button>
            </WindowCard>
            <WindowCard label="DIR: /TERMINAL" bodyClass="window-body window-body-yellow">
              <div className="icon-tile icon-tile-yellow"><IconTerminal/></div>
              <h3 style={{fontSize:18,marginBottom:8}}>Research Terminal</h3>
              <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6,marginBottom:16}}>Query the research graph. Protocol intelligence, ARS scores, trending topics.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("terminal")}>Open Terminal →</button>
            </WindowCard>
            <WindowCard label="DIR: /BOUNTIES">
              <div className="icon-tile icon-tile-green"><IconBounties/></div>
              <h3 style={{fontSize:18,marginBottom:8}}>Open Bounties</h3>
              <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6,marginBottom:16}}>Funded research challenges from protocol sponsors. Apply and get paid.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("bounties")}>View Bounties →</button>
            </WindowCard>
            <WindowCard label="DIR: /COHORTS">
              <div className="icon-tile icon-tile-pink"><IconBuilders/></div>
              <h3 style={{fontSize:18,marginBottom:8}}>Join Builder Cohort</h3>
              <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6,marginBottom:16}}>Turn validated research into a funded startup with AthenaX backing.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("apply-cohort")}>Apply Now →</button>
            </WindowCard>
          </div>
        </div>

        {/* Audience cards */}
        <div style={{marginTop:72}}>
          <div style={{marginBottom:8}}><div className="path-badge">/root/platform</div></div>
          <h2 style={{fontSize:36,marginBottom:8}}>Built for Three Audiences.</h2>
          <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>Researchers, protocols, and builders. All in one coordination layer.</p>
          <hr className="divider"/>
          <div className="grid-3">
            <WindowCard label="DIR: /RESEARCHERS" bodyClass="window-body window-body-blue">
              <div className="icon-tile icon-tile-green"><IconResearchers/></div>
              <h3 style={{fontSize:22,marginBottom:10}}>For Researchers</h3>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Funded cohort positions. AthenaX Reputation Scores. Direct access to protocol ecosystems.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("apply-cohort")}>Join as Researcher →</button>
            </WindowCard>
            <WindowCard label="DIR: /PROTOCOLS" bodyClass="window-body window-body-yellow">
              <div className="icon-tile icon-tile-yellow"><IconProtocols/></div>
              <h3 style={{fontSize:22,marginBottom:10}}>For Protocols</h3>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Sponsor credentialed academic work. Open-access papers from top labs. Fund what matters.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("bounties")}>Sponsor Research →</button>
            </WindowCard>
            <WindowCard label="DIR: /BUILDERS" bodyClass="window-body">
              <div className="icon-tile icon-tile-pink"><IconBuilders/></div>
              <h3 style={{fontSize:22,marginBottom:10}}>For Builders</h3>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Take validated research through the builder pipeline into funded startups.</p>
              <hr className="divider-sm"/>
              <button className="link-arrow" onClick={()=>setPage("cohorts")}>Join as Builder →</button>
            </WindowCard>
          </div>
        </div>

        {/* Recent Archive */}
        <div style={{marginTop:72}}>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8}}>
            <div>
              <div className="path-badge">/root/archive</div>
              <h2 style={{fontSize:32}}>The Archive</h2>
            </div>
            <button className="link-arrow" onClick={()=>setPage("archive")}>View Full Archive →</button>
          </div>
          <hr className="divider"/>
          {latestArticles.length > 0 ? latestArticles.map((item) => (
            <ContentRow
              key={item.slug}
              item={item}
              kind="article"
              onClick={()=>setPage(`article:${item.slug}`)}
            />
          )) : (
            <ContentListState
              loading={articlesLoading}
              error={articlesError}
              emptyText="No published articles available yet."
            />
          )}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════
const HowItWorksPage = ({ setPage }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/how-it-works</div>
      <h1 style={{fontSize:48,marginBottom:12}}>How AthenaX Works</h1>
      <p style={{fontSize:18,color:"#6B6B7A",maxWidth:640,lineHeight:1.6,marginBottom:0}}>AthenaX is the coordination layer between academic research and protocol ecosystem development. Ideas enter as papers and exit as protocols, products, and companies.</p>
      <hr className="divider"/>

      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        {[
          {step:"01",label:"RESEARCH",title:"Academic Research",desc:"Researchers submit papers through the AthenaX network. Labs produce open-access research, funded by protocol sponsors and AthenaX grants."},
          {step:"02",label:"VALIDATE",title:"Peer Review + ARS",desc:"Papers undergo peer review. The AthenaX Reputation Score (ARS) is computed from citations, downloads, reviews, votes, endorsements, and bounty completions."},
          {step:"03",label:"FUND",title:"Protocol Funding",desc:"Sponsors post bounties. Protocols fund specific research tracks. Grants flow directly to validated researchers and labs."},
          {step:"04",label:"BUILD",title:"Builder Cohorts",desc:"Top research enters Builder Cohorts — structured programs where developers turn validated ideas into protocol-ready products."},
          {step:"05",label:"LAUNCH",title:"Ecosystem Impact",desc:"Cohort graduates launch with distribution, community, and backing. Research becomes infrastructure. Ideas become protocols."},
          {step:"06",label:"REPEAT",title:"Flywheel",desc:"New protocols become sponsors. Researchers get reputation. The network compounds. Every cycle makes the next one stronger."},
        ].map(s=>(
          <WindowCard key={s.step} label={`>_ STEP_${s.step}: ${s.label}`}>
            <h3 style={{fontSize:20,marginBottom:10}}>{s.title}</h3>
            <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6}}>{s.desc}</p>
          </WindowCard>
        ))}
      </div>

      <WindowCard label="FLYWHEEL.SYS" bodyClass="window-body window-body-yellow">
        <h3 style={{fontSize:22,marginBottom:16}}>The AthenaX Flywheel</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",justifyContent:"center"}}>
          {["Research Submitted","Peer Reviewed","ARS Computed","Sponsor Matched","Bounty Funded","Builder Cohort","Protocol Launched","New Sponsor Joins"].map((s,i)=>(
            <span key={s} style={{display:"flex",alignItems:"center",gap:8}}>
              <span className="ftag">{s}</span>
              {i<7 && <span style={{color:"#6B6B7A"}}>→</span>}
            </span>
          ))}
        </div>
      </WindowCard>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MEDIA ICON — matches real AthenaX icon style per type
// ═══════════════════════════════════════════════════════════
const MediaIcon = ({ type }) => {
  if (type === "Video") return (
    <div className="archive-icon" style={{background:"#EAF0F6"}}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <polygon points="5,3 13,8 5,13" fill="#1C1C27"/>
      </svg>
    </div>
  );
  if (type === "Log") return (
    <div className="archive-icon" style={{background:"#1C1C27"}}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <text x="2" y="12" fontSize="11" fill="#F2EFE9" fontFamily="monospace">&gt;_</text>
      </svg>
    </div>
  );
  // Essay / default
  return (
    <div className="archive-icon" style={{background:"#F9F5DC"}}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="1" width="10" height="14" rx="1" stroke="#1C1C27" strokeWidth="1.5"/>
        <line x1="5" y1="5" x2="11" y2="5" stroke="#1C1C27" strokeWidth="1.2"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke="#1C1C27" strokeWidth="1.2"/>
        <line x1="5" y1="11" x2="9" y2="11" stroke="#1C1C27" strokeWidth="1.2"/>
      </svg>
    </div>
  );
};

const ContentIcon = ({ kind }) => (
  <div className="archive-icon" style={{background:kind === "research" ? "#EAF0F6" : "#F9F5DC"}}>
    {kind === "research" ? <IconLabsSmall/> : (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="1" width="10" height="14" rx="1" stroke="#1C1C27" strokeWidth="1.5"/>
        <line x1="5" y1="5" x2="11" y2="5" stroke="#1C1C27" strokeWidth="1.2"/>
        <line x1="5" y1="8" x2="11" y2="8" stroke="#1C1C27" strokeWidth="1.2"/>
        <line x1="5" y1="11" x2="9" y2="11" stroke="#1C1C27" strokeWidth="1.2"/>
      </svg>
    )}
  </div>
);

const ContentRow = ({ item, kind, onClick }) => (
  <div className="archive-row" onClick={onClick}>
    <ContentIcon kind={kind}/>
    <div style={{flex:1,minWidth:0}}>
      <div className="archive-title">{item.title}</div>
      <div className="archive-meta">
        {formatContentDate(item.publishedAt)}
        {kind === "research" && item.tag ? `  //  ${item.tag}` : ""}
      </div>
    </div>
    <span style={{color:"#6B6B7A",fontSize:18}}>→</span>
  </div>
);

const ContentListState = ({ loading, error, emptyText }) => {
  if (loading) {
    return (
      <div style={{padding:"18px 0",fontSize:14,color:"#6B6B7A"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,fontSize:14,color:"#6B6B7A"}}>
          <span className="spinner"/>
          Loading latest content...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <p style={{fontSize:14,color:"#E8323C",margin:"18px 0 0"}}>{error}</p>
    );
  }
  return (
    <p style={{fontSize:14,color:"#6B6B7A",margin:"18px 0 0"}}>{emptyText}</p>
  );
};

// ═══════════════════════════════════════════════════════════
// MEDIA DETAIL PAGE
// ═══════════════════════════════════════════════════════════
const MediaPage = ({ mediaId, setPage }) => {
  const item = SEED_MEDIA.find(m => m.id === mediaId);
  if (!item) return <div className="page-wrap section"><p>Not found.</p></div>;
  return (
    <div>
      <div className="page-wrap section">
        <button className="link-arrow" onClick={()=>setPage("archive")} style={{marginBottom:20}}>← Back to Archive</button>
        <div className="path-badge">/root/archive/{item.slug}</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <MediaIcon type={item.type}/>
          <span className="topic-pill">{item.type}</span>
          <span style={{fontSize:13,color:"#6B6B7A",fontFamily:"'Space Mono',monospace"}}>{item.date}</span>
        </div>
        <h1 style={{fontSize:42,marginBottom:28}}>{item.title}</h1>
        {item.type === "Video" && (
          <div style={{marginBottom:28,background:"#1C1C27",borderRadius:14,border:"2px solid #1C1C27",
            aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"5px 5px 0 #1C1C27"}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.4)",
                display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <polygon points="8,5 20,12 8,19" fill="white"/>
                </svg>
              </div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"rgba(255,255,255,0.5)",letterSpacing:"0.06em"}}>CLICK TO PLAY (DEMO)</div>
            </div>
          </div>
        )}
        <WindowCard label={`${item.type.toUpperCase()}_CONTENT.TXT`}>
          <p style={{fontSize:16,lineHeight:1.8,color:"#1C1C27"}}>{item.body}</p>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

const ContentDetailPage = ({ kind, slug, setPage, initialItem }) => {
  const { item, loading, error } = useContentItem(kind, slug, initialItem);
  const contentBlocks = extractContentText(item?.content);

  return (
    <div>
      <div className="page-wrap section section-stack-md">
        <button className="link-arrow" onClick={()=>setPage("archive")} style={{marginBottom:0}}>← Back to Research</button>
        {loading && !item ? (
          <ContentListState loading={true} error="" emptyText="" />
        ) : error || !item ? (
          <ContentListState loading={false} error={error || "Not found."} emptyText="Not found." />
        ) : (
          <>
            <div className="section-heading-tight">
              <div className="path-badge">/root/{kind}/{item.slug}</div>
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span className="topic-pill" style={kind === "research" ? {background:"#EAF0F6"} : {}}>
                  {kind === "research" ? "Research" : "Article"}
                </span>
                {kind === "research" && item.tag && <span className="ftag">{item.tag}</span>}
                <span style={{fontSize:13,color:"#6B6B7A",fontFamily:"'Space Mono',monospace"}}>
                  {formatContentDate(item.publishedAt)}
                </span>
              </div>
            </div>
            <div>
              {isLexicalContent(item?.content) ? (
                <LexicalRenderer content={item.content} />
              ) : contentBlocks.length > 0 ? contentBlocks.map((block, index) => (
                <p key={index} style={{fontSize:16,lineHeight:1.8,color:"#1C1C27",marginBottom:index === contentBlocks.length - 1 ? 0 : 18}}>
                  {block}
                </p>
              )) : (
                <pre style={{whiteSpace:"pre-wrap",wordBreak:"break-word",fontFamily:"'Space Mono',monospace",fontSize:12,color:"#6B6B7A",margin:0}}>
                  {JSON.stringify(item.content, null, 2)}
                </pre>
              )}
            </div>
          </>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ARCHIVE PAGE
// ═══════════════════════════════════════════════════════════
const ArchivePage = ({ setPage, articles, research, loading, error, initialTab = "articles" }) => {
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

// ═══════════════════════════════════════════════════════════
// PAPER PAGE
// ═══════════════════════════════════════════════════════════
const PaperPage = ({ paperId, setPage, user, showToast }) => {
  const paper = SEED_PAPERS.find(p=>p.id===paperId);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  useEffect(()=>{ if(paper) setVoteCount(paper.votes); },[paperId]);
  if(!paper) return <div className="page-wrap section"><p>Paper not found.</p></div>;

  const handleVote = () => {
    if(!user){showToast("Sign in to vote.","error");return;}
    if(voted){showToast("Already voted.","info");return;}
    setVoted(true); setVoteCount(v=>v+1);
    showToast("Vote recorded!","success");
  };

  return (
    <div>
      <div className="page-wrap section">
        <button className="link-arrow" onClick={()=>setPage("archive")} style={{marginBottom:20}}>← Back to Archive</button>
        <div className="path-badge">/root/archive/{paper.id}</div>
        <h1 style={{fontSize:36,marginBottom:16,letterSpacing:"-0.02em"}}>{paper.title}</h1>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:28}}>
          <button className="topic-pill" style={{cursor:"pointer",border:"none",fontFamily:"'Space Grotesk',sans-serif"}} onClick={()=>setPage(`terminal:topic:${paper.topic}`)}>{paper.topic}</button>
          <span className="ftag">{paper.year}</span>
          <span className="ftag">{paper.lab}</span>
          <span className="ftag">{paper.university}</span>
        </div>
        <div className="grid-2" style={{gap:22}}>
          <WindowCard label="ABSTRACT.TXT">
            <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27"}}>{paper.abstract}</p>
            <hr className="divider-sm"/>
            <div style={{fontSize:13,color:"#6B6B7A",marginBottom:16}}>Authors: {paper.authors.join(", ")}</div>
            <button
              className={voted?"btn btn-ghost btn-sm":"btn btn-outline btn-sm"}
              onClick={handleVote}
              style={voted?{background:"#D4EDDA"}:{}}
            >
              {voted?"✓ Voted":"▲ Upvote"} &nbsp;·&nbsp; {voteCount.toLocaleString()}
            </button>
          </WindowCard>
          <div>
            <WindowCard label="METRICS.SYS" style={{marginBottom:20}}>
              <div className="grid-2" style={{gap:12}}>
                <div className="stat-card"><div className="stat-label">Citations</div><div className="stat-value">{paper.citations}</div></div>
                <div className="stat-card"><div className="stat-label">Downloads</div><div className="stat-value">{paper.downloads.toLocaleString()}</div></div>
                <div className="stat-card"><div className="stat-label">Peer Reviews</div><div className="stat-value">{paper.peerReviews}</div></div>
                <div className="stat-card"><div className="stat-label">Review Score</div><div className="stat-value" style={{color:"#E8323C"}}>{paper.reviewScore}</div></div>
              </div>
            </WindowCard>
            <WindowCard label="ARS_SCORE.SYS" bodyClass="window-body window-body-yellow">
              <ArsBreakdown r={{citations:paper.citations,peerReviews:paper.peerReviews||0,downloads:paper.downloads,votes:paper.votes,sponsorEndorsements:2,bountyCompletions:1}}/>
            </WindowCard>
          </div>
        </div>

        {/* Related research */}
        {(()=>{
          const sameTopic = SEED_PAPERS.filter(p=>p.id!==paper.id && p.topic===paper.topic);
          const sameLab   = SEED_PAPERS.filter(p=>p.id!==paper.id && p.lab===paper.lab && p.topic!==paper.topic);
          const related   = [...sameTopic, ...sameLab].slice(0,4);
          if(related.length===0) return null;
          return (
            <div style={{marginTop:36}}>
              <WindowCard label="RELATED_RESEARCH.SYS" bodyClass="window-body window-body-blue">
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:14}}>PAPERS ON SAME TOPIC OR FROM SAME LAB</div>
                {related.map(p=>(
                  <div key={p.id} className="archive-row" onClick={()=>setPage(`paper:${p.id}`)}>
                    <MediaIcon type="Essay"/>
                    <div style={{flex:1}}>
                      <div className="archive-title">{p.title}</div>
                      <div className="archive-meta">{p.year} // {p.topic} // {p.lab}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:"#E8323C"}}>{p.citations}</div>
                      <div style={{fontSize:10,color:"#6B6B7A"}}>cites</div>
                    </div>
                  </div>
                ))}
              </WindowCard>
            </div>
          );
        })()}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// NETWORK PAGE
// ═══════════════════════════════════════════════════════════
const NetworkPage = ({ setPage }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/network</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Research Network</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>Universities, labs, and protocol ecosystems.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        <WindowCard label="DIR: /LABS" bodyClass="window-body window-body-blue">
          <div className="icon-tile icon-tile-blue"><IconLabs/></div>
          <h3 style={{fontSize:22,marginBottom:10}}>Research Labs</h3>
          <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Partner labs producing credentialed open research. From MIT DCI to EF Research.</p>
          <hr className="divider-sm"/>
          <button className="link-arrow" onClick={()=>setPage("labs")}>Open Directory →</button>
        </WindowCard>
        <WindowCard label="DIR: /UNIVERSITIES" bodyClass="window-body window-body-yellow">
          <div className="icon-tile icon-tile-yellow"><IconUniversities/></div>
          <h3 style={{fontSize:22,marginBottom:10}}>Universities</h3>
          <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Institutional partnerships with the world's leading crypto-research universities.</p>
          <hr className="divider-sm"/>
          <button className="link-arrow" onClick={()=>setPage("universities")}>Open Directory →</button>
        </WindowCard>
        <WindowCard label="DIR: /SPONSORS" bodyClass="window-body">
          <div className="icon-tile icon-tile-green"><IconSponsors/></div>
          <h3 style={{fontSize:22,marginBottom:10}}>Protocol Sponsors</h3>
          <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Protocols funding the research that shapes their ecosystems.</p>
          <hr className="divider-sm"/>
          <button className="link-arrow" onClick={()=>setPage("sponsors")}>Open Directory →</button>
        </WindowCard>
        <WindowCard label="DIR: /TALENT" bodyClass="window-body">
          <div className="icon-tile icon-tile-pink"><IconTalent/></div>
          <h3 style={{fontSize:22,marginBottom:10}}>Talent Marketplace</h3>
          <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Roles and fellowships. Match researchers with protocol teams.</p>
          <hr className="divider-sm"/>
          <button className="link-arrow" onClick={()=>setPage("talent")}>Open Directory →</button>
        </WindowCard>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// LABS PAGE
// ═══════════════════════════════════════════════════════════
const LabsPage = ({ setPage, setSelectedLab }) => {
  const sorted = [...SEED_LABS].sort((a,b) => (b.active?1:0)-(a.active?1:0));
  // Compute real paper counts from SEED_PAPERS
  const paperCount = (labName) => SEED_PAPERS.filter(p=>p.lab===labName).length;
  return (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/network/labs</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Research Labs</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>Partner institutions producing open research.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22}}>
        {sorted.map(lab=>(
          <div key={lab.id} className="archive-row" style={{flexDirection:"column",alignItems:"flex-start",cursor:"pointer",opacity:lab.active?1:0.55}} onClick={()=>{setSelectedLab(lab);setPage("lab-profile");}}>
            <div style={{display:"flex",alignItems:"center",gap:12,width:"100%"}}>
              <div className="archive-icon" style={{background:"#EAF0F6"}}><IconLabsSmall/></div>
              <div style={{flex:1}}>
                <div className="archive-title">{lab.name}</div>
                <div className="archive-meta">{lab.focus}</div>
              </div>
              <span className={`ftag`} style={{background:lab.active?"#D4EDDA":"#F5DDE0"}}>{lab.active?"Active":"Inactive"}</span>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:10}}>
              {lab.tags.map(t=><span key={t} className="ftag">{t}</span>)}
            </div>
            <div style={{fontSize:13,color:"#6B6B7A",marginTop:8}}>
              {paperCount(lab.name) || lab.papers} papers indexed
              {!lab.active && <span style={{marginLeft:8,color:"#E8323C",fontWeight:600}}>· Not accepting new research</span>}
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:44}}>
        <WindowCard label="JOIN_NETWORK.SYS" bodyClass="window-body window-body-yellow">
          <h3 style={{fontSize:22,marginBottom:10}}>Is Your Lab on AthenaX?</h3>
          <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:18}}>We partner with research labs worldwide. Apply to join the network — get access to protocol sponsors, bounty funding, and the builder cohort pipeline.</p>
          <button className="btn btn-primary" onClick={()=>setPage("apply-lab")}>Apply as a Lab →</button>
        </WindowCard>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
  );
};

// ═══════════════════════════════════════════════════════════
// LAB PROFILE
// ═══════════════════════════════════════════════════════════
const LabProfilePage = ({ lab, setPage }) => {
  if(!lab) return null;
  const labPapers = SEED_PAPERS.filter(p=>p.lab===lab.name);
  const realCount = labPapers.length || lab.papers;
  return (
    <div>
      <div className="page-wrap section">
        <button className="link-arrow" onClick={()=>setPage("labs")} style={{marginBottom:20}}>← Back to Labs</button>
        <div className="path-badge">/root/network/labs/{lab.id}</div>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}>
          <h1 style={{fontSize:42}}>{lab.name}</h1>
          <span className="ftag" style={{background:lab.active?"#D4EDDA":"#F5DDE0"}}>{lab.active?"Active":"Inactive"}</span>
        </div>
        <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>{lab.focus}</p>
        <hr className="divider"/>
        <div className="grid-2" style={{gap:22}}>
          <div>
            <WindowCard label="LAB_OVERVIEW.SYS">
              <p style={{fontSize:15,lineHeight:1.7,marginBottom:20}}>{lab.description}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                {lab.tags.map(t=><span key={t} className="topic-pill">{t}</span>)}
              </div>
              <hr className="divider-sm"/>
              <div style={{fontSize:13,color:"#6B6B7A"}}>Partners: {lab.partners.join(", ")}</div>
            </WindowCard>
            <WindowCard label="RESEARCHERS.SYS" style={{marginTop:20}}>
              {lab.researchers.map(r=>(
                <div key={r} className="lb-row">
                  <div className="lb-avatar">{r.charAt(0)}</div>
                  <div className="lb-name">{r}</div>
                </div>
              ))}
            </WindowCard>
          </div>
          <div>
            <WindowCard label="METRICS.SYS" style={{marginBottom:20}}>
              <div className="grid-2" style={{gap:12}}>
                <div className="stat-card"><div className="stat-label">Papers Indexed</div><div className="stat-value">{realCount}</div></div>
                <div className="stat-card"><div className="stat-label">Researchers</div><div className="stat-value">{lab.researchers.length}</div></div>
                <div className="stat-card"><div className="stat-label">Partners</div><div className="stat-value">{lab.partners.length}</div></div>
                <div className="stat-card"><div className="stat-label">Status</div><div className="stat-value" style={{fontSize:18,color:lab.active?"#15803D":"#E8323C"}}>{lab.active?"Online":"Offline"}</div></div>
              </div>
            </WindowCard>
            <WindowCard label="LAB_PAPERS.SYS" bodyClass="window-body window-body-blue">
              {labPapers.length===0
                ? <p style={{color:"#6B6B7A",fontSize:14}}>No indexed papers yet.</p>
                : labPapers.map(p=>(
                  <div key={p.id} className="archive-row" style={{marginBottom:8}} onClick={()=>setPage(`paper:${p.id}`)}>
                    <div style={{flex:1}}>
                      <div className="archive-title" style={{fontSize:14}}>{p.title}</div>
                      <div className="archive-meta">{p.year} // {p.topic}</div>
                    </div>
                  </div>
                ))
              }
              {lab.active && (
                <button className="btn btn-primary btn-sm" style={{width:"100%",marginTop:12,justifyContent:"center"}} onClick={()=>setPage("cohorts")}>
                  View Open Cohorts →
                </button>
              )}
            </WindowCard>
          </div>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// UNIVERSITIES PAGE
// ═══════════════════════════════════════════════════════════
const UniversitiesPage = ({ setPage }) => {
  const unis = [
    {name:"MIT",            country:"USA",     labs:2, focus:"Digital currencies, AI agents"},
    {name:"Stanford",       country:"USA",     labs:1, focus:"Blockchain protocols, cryptography"},
    {name:"Oxford",         country:"UK",      labs:1, focus:"Governance, internet & society"},
    {name:"ETH Zurich",     country:"CH",      labs:1, focus:"Consensus, formal verification"},
    {name:"Imperial College",country:"UK",     labs:1, focus:"Applied protocol engineering"},
    {name:"Harvard",        country:"USA",     labs:1, focus:"Digital currency, economics"},
    {name:"Columbia",       country:"USA",     labs:1, focus:"EVM, developer tooling"},
    {name:"Caltech",        country:"USA",     labs:1, focus:"Distributed systems"},
  ];
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/network/universities</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Universities</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Institutional academic partners.</p>
        <hr className="divider"/>
        <div className="grid-3" style={{gap:20}}>
          {unis.map(u=>(
            <WindowCard key={u.name} label={`UNI: ${u.name.toUpperCase()}`}>
              <h3 style={{fontSize:20,marginBottom:6}}>{u.name}</h3>
              <div style={{fontSize:13,color:"#6B6B7A",marginBottom:12}}>{u.country} · {u.labs} lab{u.labs>1?"s":""}</div>
              <p style={{fontSize:14,color:"#1C1C27",lineHeight:1.5}}>{u.focus}</p>
            </WindowCard>
          ))}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SPONSORS PAGE
// ═══════════════════════════════════════════════════════════
const SponsorOnboardingPage = ({ setPage, user, showToast }) => {
  const [form,setForm] = useState({org:user?.organization||"",contact:user?.name||"",email:user?.email||"",model:"Sponsored Program",budget:"",focus:"",why:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.org||!form.email||!form.why){showToast("Please fill in all required fields.","error");return;}
    showToast("Sponsorship enquiry submitted! We'll be in touch within 48 hours.","success");
    setPage("sponsors");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/sponsor/apply</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Become a Sponsor</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Fund credentialed research. Get academic credibility. Access top talent.</p>
        <hr className="divider"/>
        <WindowCard label="SPONSOR_ENQUIRY.FORM">
          <div className="inp-group"><label className="inp-label">Protocol / Organisation *</label><input className="inp" value={form.org} onChange={set("org")} placeholder="e.g. Scroll, Aztec, Starknet"/></div>
          <div className="inp-group"><label className="inp-label">Contact Name *</label><input className="inp" value={form.contact} onChange={set("contact")} placeholder="Your name"/></div>
          <div className="inp-group"><label className="inp-label">Email *</label><input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="you@protocol.io"/></div>
          <div className="inp-group">
            <label className="inp-label">Funding Model</label>
            <select className="inp" value={form.model} onChange={set("model")}>
              <option>Sponsored Program</option>
              <option>Research Bounty</option>
              <option>Cohort Sponsor</option>
              <option>Pilot ($20K–50K)</option>
            </select>
          </div>
          <div className="inp-group"><label className="inp-label">Estimated Budget</label><input className="inp" value={form.budget} onChange={set("budget")} placeholder="e.g. $50,000"/></div>
          <div className="inp-group"><label className="inp-label">Research Focus Area</label><input className="inp" value={form.focus} onChange={set("focus")} placeholder="e.g. ZK proofs, DAO governance, tokenomics"/></div>
          <div className="inp-group"><label className="inp-label">Why do you want to sponsor research? *</label><textarea className="inp" rows={3} value={form.why} onChange={set("why")} placeholder="What problem are you trying to solve or understand?"/></div>
          <div style={{background:"#F2EFE9",border:"1.5px solid #D8D4CC",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#6B6B7A",marginBottom:16}}>
            Typical turnaround: 48-hour response, 2-week scoping call, 30-day pilot launch.
          </div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Submit Enquiry →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

const SponsorsPage = ({ setPage }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/network/sponsors</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Protocol Sponsors</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>Protocols funding the research that shapes their ecosystems.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        {SEED_SPONSORS.map(s=>(
          <WindowCard key={s.name} label={`SPONSOR: ${s.ticker}`}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <h3 style={{fontSize:20,marginBottom:4}}>{s.name}</h3>
                <span className="ftag">{s.category}</span>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:22,fontWeight:700,color:"#E8323C"}}>{s.amount}</div>
                <div style={{fontSize:12,color:"#6B6B7A"}}>{s.programs} programs</div>
              </div>
            </div>
            <hr className="divider-sm"/>
            <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{s.why}</p>
          </WindowCard>
        ))}
      </div>

      {/* Sponsor ROI panel */}
      <WindowCard label="SPONSOR_ROI.SYS" bodyClass="window-body window-body-blue" style={{marginBottom:22}}>
        <h3 style={{fontSize:22,marginBottom:16}}>What Sponsors Get</h3>
        <div className="grid-3" style={{gap:16,marginBottom:20}}>
          {[
            {label:"Avg. Paper Downloads",value:"3,200",sub:"per sponsored paper"},
            {label:"Avg. Citations (12mo)",value:"84",   sub:"across indexed papers"},
            {label:"Researcher Reach",    value:"1,847", sub:"active network members"},
          ].map(s=><div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:22}}>{s.value}</div><div className="stat-sub">{s.sub}</div></div>)}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Open-access papers under your brand","ARS-verified researcher talent","Real-time citation & download metrics","Cohort co-branding","Talent pipeline access","Protocol Briefing newsletter spotlight"].map(b=>(
            <span key={b} className="ftag" style={{fontSize:12}}>✓ {b}</span>
          ))}
        </div>
      </WindowCard>

      <WindowCard label="BECOME_SPONSOR.SYS" bodyClass="window-body window-body-yellow">
        <h3 style={{fontSize:24,marginBottom:12}}>Ready to Sponsor?</h3>
        <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:20}}>Pilots start at $20K. Full research tracks from $100K. Cohort sponsorship from $250K. We'll match you to the right researchers within two weeks.</p>
        <button className="btn btn-primary" onClick={()=>setPage("sponsor-onboarding")}>Start a Conversation →</button>
      </WindowCard>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// TALENT PAGE
// ═══════════════════════════════════════════════════════════
const TalentPage = ({ setPage, user, showToast }) => {
  const roles = [
    {id:"r1", title:"Research Fellow",       org:"Ethereum Foundation", type:"Fellowship", stipend:"$6K/mo",   topic:"Protocol Economics", desc:"Six-month fellowship working directly with EF Research on consensus economics and validator incentive design."},
    {id:"r2", title:"ZK Engineer",           org:"EigenLayer",          type:"Full-time",  stipend:"$180K/yr", topic:"ZK Proofs",          desc:"Build and audit ZK proof systems for EigenLayer's restaking infrastructure. Requires ARS 6.0+."},
    {id:"r3", title:"DAO Governance Lead",   org:"Arbitrum",            type:"Contract",   stipend:"$50K/6mo", topic:"DAO Governance",     desc:"Design and implement governance improvements for Arbitrum DAO based on AthenaX-indexed research."},
    {id:"r4", title:"Research Scientist",    org:"Uniswap Foundation",  type:"Fellowship", stipend:"$5K/mo",   topic:"DeFi",               desc:"Research MEV, cross-chain liquidity, and AMM design. Work published open-access via AthenaX."},
    {id:"r5", title:"Protocol Economist",    org:"Mantle",              type:"Full-time",  stipend:"$160K/yr", topic:"Tokenomics",         desc:"Design tokenomics and incentive systems for Mantle's L2 ecosystem. Prior research output required."},
  ];
  const types = ["All","Fellowship","Full-time","Contract"];
  const [filter, setFilter] = useState("All");
  const [applying, setApplying] = useState(null);
  const [applyNote, setApplyNote] = useState("");
  const [openToWork, setOpenToWork] = useState(user?.openToWork||false);

  const filtered = filter==="All" ? roles : roles.filter(r=>r.type===filter);

  const submitApply = () => {
    showToast(`Application sent for: ${applying.title}`, "success");
    setApplying(null); setApplyNote("");
  };

  const toggleOpenToWork = () => {
    if(!user){showToast("Sign in to set your availability.","error");return;}
    const next=!openToWork; setOpenToWork(next);
    showToast(next?"You're now visible to protocol hiring teams.":"Removed from talent listings.","success");
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/network/talent</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Talent Marketplace</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Roles and fellowships for vetted researchers. Free for protocol sponsors and AthenaX-incubated startups. External companies pay a placement fee on first-year compensation.</p>
        <hr className="divider"/>

        {/* Open-to-work toggle for researchers */}
        {user?.role==="researcher" && (
          <WindowCard label="AVAILABILITY.SYS" bodyClass="window-body window-body-blue" style={{marginBottom:32}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
              <div>
                <h3 style={{fontSize:17,marginBottom:4}}>Open to Opportunities</h3>
                <p style={{fontSize:14,color:"#6B6B7A"}}>When enabled, protocol teams can see your profile in talent searches.</p>
              </div>
              <button className={openToWork?"btn btn-primary btn-sm":"btn btn-ghost btn-sm"} onClick={toggleOpenToWork}>
                {openToWork?"✓ Available — Turn Off":"Set as Available →"}
              </button>
            </div>
          </WindowCard>
        )}

        {/* Filter bar */}
        <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>
          {types.map(t=>(
            <button key={t}
              className={filter===t?"btn btn-ghost btn-sm":"btn btn-outline btn-sm"}
              style={filter===t?{background:"#F5D94E"}:{}}
              onClick={()=>setFilter(t)}>{t}</button>
          ))}
        </div>

        {filtered.map(r=>(
          <div key={r.id} className="archive-row" style={{flexDirection:"column",alignItems:"flex-start",cursor:"default"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14,width:"100%"}}>
              <div className="archive-icon" style={{background:"#EAF0F6",flexShrink:0}}><IconBriefcaseSmall/></div>
              <div style={{flex:1}}>
                <div className="archive-title">{r.title}</div>
                <div className="archive-meta">{r.org} &nbsp;//&nbsp; {r.type} &nbsp;//&nbsp; {r.topic}</div>
                <p style={{fontSize:13,color:"#6B6B7A",marginTop:6,lineHeight:1.5}}>{r.desc}</p>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontWeight:700,fontSize:15,color:"#15803D",marginBottom:8}}>{r.stipend}</div>
                <button className="btn btn-primary btn-sm" onClick={()=>{if(!user){showToast("Sign in to apply.","error");return;}setApplying(r);}}>Apply →</button>
              </div>
            </div>
          </div>
        ))}

        {/* For protocols */}
        <div style={{marginTop:44}}>
          <WindowCard label="POST_ROLE.SYS" bodyClass="window-body window-body-yellow">
            <h3 style={{fontSize:22,marginBottom:10}}>Hiring a Researcher?</h3>
            <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:4}}>Post a role and reach ARS-verified researchers directly. Free for active protocol sponsors and AthenaX-incubated startups. External companies pay a placement fee on successful hire.</p>
            <p style={{fontSize:13,color:"#6B6B7A",marginBottom:18}}>Average time-to-hire: 3 weeks. All candidates are ARS-scored.</p>
            <button className="btn btn-primary" onClick={()=>setPage("sponsor-onboarding")}>Post a Role →</button>
          </WindowCard>
        </div>
      </div>

      {/* Apply modal */}
      {applying && (
        <Modal title={`APPLY: ${applying.title.toUpperCase()}`} onClose={()=>{setApplying(null);setApplyNote("");}}>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:600,marginBottom:4}}>{applying.title}</div>
            <div style={{fontSize:13,color:"#6B6B7A",marginBottom:12}}>{applying.org} · {applying.type} · {applying.stipend}</div>
            <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{applying.desc}</p>
          </div>
          <hr className="divider-sm"/>
          <div className="inp-group">
            <label className="inp-label">Cover Note</label>
            <textarea className="inp" rows={4} value={applyNote} onChange={e=>setApplyNote(e.target.value)} placeholder="Briefly describe your research background and why you're a fit…"/>
          </div>
          <div style={{fontSize:12,color:"#6B6B7A",marginBottom:14}}>Your ARS score and published papers will be shared automatically with {applying.org}.</div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submitApply}>Submit Application →</button>
        </Modal>
      )}

      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// FUNDING PAGE
// ═══════════════════════════════════════════════════════════
const FundingPage = ({ setPage }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/funding</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Research Funding Engine</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>How money flows through AthenaX.</p>
      <hr className="divider"/>
      <div className="grid-3" style={{gap:20,marginBottom:44}}>
        {[
          {label:"SPONSORED_PROGRAMS",title:"Sponsored Programs",   pct:"45%",  desc:"Protocols fund multi-month research tracks. Researchers get grants. Papers get published. Both win."},
          {label:"BOUNTIES",          title:"Research Bounties",    pct:"25%",  desc:"One-off challenges posted by sponsors. Open to all ARS-verified researchers. Fast capital for fast ideas."},
          {label:"COHORT_FEES",       title:"Builder Cohort Fees",  pct:"15%",  desc:"Sponsors pay to participate in Builder Cohorts. Access to pre-vetted research and builder talent."},
          {label:"TERMINAL_SUBS",     title:"Terminal Subscriptions",pct:"10%", desc:"VCs and protocol BD teams subscribe for access to the Research Terminal and private digests."},
          {label:"TALENT_PLACEMENT",  title:"Talent Placement",     pct:"3%",   desc:"Fee when researchers are placed in protocol roles via the Talent Marketplace."},
          {label:"STARTUP_EQUITY",    title:"Startup Equity",       pct:"5–8%", desc:"AthenaX takes a 5–8% equity stake in cohort-incubated startups. Long-term upside aligned with the network."},
        ].map(s=>{ const FundingIcon = FUNDING_ICONS[s.label]; return (
          <WindowCard key={s.label} label={`>_ ${s.label}`}>
            <div className="icon-tile icon-tile-yellow">{FundingIcon && <FundingIcon/>}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h3 style={{fontSize:18}}>{s.title}</h3>
              <span style={{fontFamily:"'Space Mono',monospace",fontSize:16,fontWeight:700,color:"#E8323C"}}>{s.pct}</span>
            </div>
            <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{s.desc}</p>
          </WindowCard>
        ); })}
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <button className="btn btn-primary" onClick={()=>setPage("bounties")}>View Bounties →</button>
        <button className="btn btn-outline" onClick={()=>setPage("business-model")}>Business Model</button>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// BOUNTIES PAGE
// ═══════════════════════════════════════════════════════════
const BountiesPage = ({ setPage, user, showToast }) => {
  const [applying,setApplying] = useState(null);
  const handleApply = (b) => {
    if(!user){showToast("Sign in to apply for bounties.","error");return;}
    setApplying(b.id);
    setTimeout(()=>{
      const apps=dbRead(DB_KEYS.APPLICATIONS);
      const exists=apps.find(a=>a.userId===user.id&&a.bountyId===b.id);
      if(exists){showToast("Already applied.","info");setApplying(null);return;}
      dbWrite(DB_KEYS.APPLICATIONS,[...apps,{id:dbUid("app"),userId:user.id,bountyId:b.id,status:"pending",appliedAt:dbNow()}]);
      showToast(`Applied for: ${b.title}`,"success"); setApplying(null);
    },500);
  };
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/funding/bounties</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Open Bounties</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Open research challenges posted by protocol sponsors.</p>
        <hr className="divider"/>
        <div style={{display:"flex",gap:22,flexDirection:"column"}}>
          {SEED_BOUNTIES.map(b=>(
            <WindowCard key={b.id} label={`BOUNTY: ${b.id}`} bodyClass="window-body window-body-blue">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
                <div>
                  <h3 style={{fontSize:20,marginBottom:6}}>{b.title}</h3>
                  <div style={{display:"flex",gap:8}}>
                    <span className="topic-pill">{b.topic}</span>
                    <span className="ftag">{b.sponsor}</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:28,fontWeight:700,color:"#E8323C"}}>{b.reward}</div>
                  <div style={{fontSize:12,color:"#6B6B7A"}}>Deadline: {b.deadline}</div>
                </div>
              </div>
              <hr className="divider-sm"/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:"#6B6B7A"}}>{b.applicants} applicants</span>
                <button className="btn btn-primary btn-sm" onClick={()=>handleApply(b)} disabled={applying===b.id}>
                  {applying===b.id?<span className="spinner"/>:"Apply →"}
                </button>
              </div>
            </WindowCard>
          ))}
        </div>
        <div style={{marginTop:44}}>
          <WindowCard label="POST_BOUNTY.SYS" bodyClass="window-body window-body-yellow">
            <h3 style={{fontSize:22,marginBottom:10}}>Post a Bounty</h3>
            <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:18}}>Protocols post research challenges. Researchers compete. Best work gets funded.</p>
            <button className="btn btn-primary" onClick={()=>setPage("post-bounty")}>Post a Bounty →</button>
          </WindowCard>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// POST BOUNTY PAGE
// ═══════════════════════════════════════════════════════════
const PostBountyPage = ({ setPage, user, showToast }) => {
  const [form,setForm] = useState({title:"",sponsor:"",reward:"",deadline:"",topic:"ZK Proofs"});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!user||user.role!=="sponsor"){showToast("Only sponsors can post bounties.","error");return;}
    if(!form.title||!form.reward){showToast("Please fill in all fields.","error");return;}
    showToast("Bounty posted! (Demo — not persisted)","success"); setPage("bounties");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/funding/post-bounty</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Post a Bounty</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Sponsors only. Define a research challenge and reward.</p>
        <hr className="divider"/>
        <WindowCard label="NEW_BOUNTY.FORM">
          <div className="inp-group"><label className="inp-label">Bounty Title</label><input className="inp" value={form.title} onChange={set("title")} placeholder="ZK proof optimization for…"/></div>
          <div className="inp-group"><label className="inp-label">Sponsor Name</label><input className="inp" value={form.sponsor} onChange={set("sponsor")} placeholder="Your protocol name"/></div>
          <div className="inp-group"><label className="inp-label">Reward (USD)</label><input className="inp" value={form.reward} onChange={set("reward")} placeholder="$25,000"/></div>
          <div className="inp-group"><label className="inp-label">Deadline</label><input className="inp" type="date" value={form.deadline} onChange={set("deadline")}/></div>
          <div className="inp-group">
            <label className="inp-label">Research Topic</label>
            <select className="inp" value={form.topic} onChange={set("topic")}>
              {["ZK Proofs","DAO Governance","DeFi","Tokenomics","AI Agents","Protocol Economics","Security","Digital Nations"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={submit}>Post Bounty →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// COHORTS PAGE
// ═══════════════════════════════════════════════════════════
const CohortsPage = ({ setPage }) => {
  const topics = ["AI Agents","DAO Governance","Protocol Economics","Tokenomics","DeFi Systems","Digital Nations"];
  const [sel,setSel] = useState(null);
  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/funding/cohorts</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Builder Cohorts</h1>
        <p style={{fontSize:17,color:"#6B6B7A"}}>Research meets product. Ideas become protocols.</p>
        <hr className="divider"/>
        <WindowCard label="COHORT_01: CURRENT" bodyClass="window-body window-body-yellow" style={{marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:16}}>
            <div>
              <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:4}}>NOW RUNNING</div>
              <h3 style={{fontSize:28,marginBottom:8}}>Cohort 12 — Crypto Native AI</h3>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,maxWidth:480}}>Six teams building AI-powered protocol tooling. Funded by Ethereum Foundation, EigenLayer, and Arbitrum. 12-week intensive.</p>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",color:"#6B6B7A",marginBottom:4}}>PRIZE POOL</div>
              <div style={{fontSize:36,fontWeight:700,color:"#E8323C"}}>$240K</div>
            </div>
          </div>
          <hr className="divider-sm"/>
          <button className="btn btn-primary" onClick={()=>setPage("apply-cohort")}>Apply to Cohort →</button>
        </WindowCard>

        <h2 style={{fontSize:28,marginBottom:18}}>Research Tracks</h2>
        <div className="grid-3" style={{gap:18}}>
          {topics.map(t=>(
            <div key={t} className={`archive-row${sel===t?" active":""}`} style={{cursor:"pointer"}} onClick={()=>setSel(sel===t?null:t)}>
              <div style={{flex:1}}>
                <div className="archive-title" style={{fontSize:15}}>{t}</div>
                {sel===t && <div className="archive-meta">12 weeks · $20K prize · Open applications</div>}
              </div>
              <span>{sel===t?"▲":"▼"}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APPLY COHORT PAGE
// ═══════════════════════════════════════════════════════════
const ApplyCohortPage = ({ setPage, user, showToast }) => {
  const [form,setForm] = useState({name:user?.name||"",email:user?.email||"",track:"AI Agents",why:"",project:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.why||!form.project){showToast("Please complete all fields.","error");return;}
    showToast("Application submitted! (Demo)","success"); setPage("cohorts");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/apply</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Apply to AthenaX</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Researchers, builders, and cohort applicants.</p>
        <hr className="divider"/>
        <WindowCard label="APPLICATION.FORM">
          <div className="inp-group"><label className="inp-label">Full Name</label><input className="inp" value={form.name} onChange={set("name")} placeholder="Dr. Jane Smith"/></div>
          <div className="inp-group"><label className="inp-label">Email</label><input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="jane@university.edu"/></div>
          <div className="inp-group">
            <label className="inp-label">Research Track</label>
            <select className="inp" value={form.track} onChange={set("track")}>
              {["AI Agents","DAO Governance","Protocol Economics","Tokenomics","DeFi Systems","Digital Nations"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="inp-group"><label className="inp-label">Project Idea</label><textarea className="inp" rows={3} value={form.project} onChange={set("project")} placeholder="What are you building?"/></div>
          <div className="inp-group"><label className="inp-label">Why AthenaX?</label><textarea className="inp" rows={3} value={form.why} onChange={set("why")} placeholder="Why do you want to join?"/></div>
          <button className="btn btn-primary" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={submit}>Submit Application →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};



// ═══════════════════════════════════════════════════════════
// BUSINESS MODEL PAGE
// ═══════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════
// TERMINAL PAGE
// ═══════════════════════════════════════════════════════════
const TerminalPage = ({ setPage, user, showToast, initialQuery="" }) => {
  const [query,       setQuery]       = useState(initialQuery);
  const [results,     setResults]     = useState(null);
  const [activeProto, setActiveProto] = useState("Ethereum");
  const [cmdInput,    setCmdInput]    = useState("");
  const [cmdLog,      setCmdLog]      = useState([
    "> AthenaX Research Terminal v2.0",
    "> Type 'help' for available commands.",
  ]);
  const [tab, setTab] = useState(initialQuery ? "search" : "search");

  // ── auto-run initialQuery on mount ─────────────────────
  useEffect(()=>{ if(initialQuery) runSearch(initialQuery); },[]);

  // ── search ──────────────────────────────────────────────
  const runSearch = (raw) => {
    const q = (raw||query).trim().toLowerCase();
    if (!q) return;
    let hits = [];
    if (q.startsWith("topic:")) {
      const t = q.replace("topic:","").trim();
      hits = SEED_PAPERS.filter(p=>p.topic.toLowerCase().includes(t)).map(p=>({kind:"paper",item:p}));
    } else if (q.startsWith("lab:")) {
      const l = q.replace("lab:","").trim();
      hits = SEED_LABS.filter(x=>x.name.toLowerCase().includes(l)).map(x=>({kind:"lab",item:x}));
    } else if (q.startsWith("researcher:")) {
      const r = q.replace("researcher:","").trim();
      hits = SEED_RESEARCHERS.filter(x=>x.name.toLowerCase().includes(r)).map(x=>({kind:"researcher",item:x}));
    } else {
      const pHits = SEED_PAPERS.filter(p=>p.title.toLowerCase().includes(q)||p.topic.toLowerCase().includes(q)||p.authors.join(" ").toLowerCase().includes(q)).map(p=>({kind:"paper",item:p}));
      const lHits = SEED_LABS.filter(x=>x.name.toLowerCase().includes(q)||x.tags.join(" ").toLowerCase().includes(q)).map(x=>({kind:"lab",item:x}));
      const rHits = SEED_RESEARCHERS.filter(x=>x.name.toLowerCase().includes(q)).map(x=>({kind:"researcher",item:x}));
      hits = [...pHits,...lHits,...rHits];
    }
    setResults(hits);
  };

  // ── terminal cmd ────────────────────────────────────────
  const runCmd = (raw) => {
    const c = raw.trim().toLowerCase();
    if (!c) return;
    const log = lines => setCmdLog(p=>[...p.slice(-40),...lines]);
    if (c==="help") {
      log(["> Commands:","  search <query>    — full-text search","  topic <name>      — filter by topic","  lab <name>        — filter by lab","  researcher <name> — find researcher","  top papers        — highest cited","  top topics        — most covered","  top researchers   — highest ARS","  clear             — clear log"]);
    } else if (c==="clear") {
      setCmdLog(["> Terminal cleared."]);
    } else if (c==="top papers") {
      const top=[...SEED_PAPERS].sort((a,b)=>b.citations-a.citations).slice(0,3);
      log(["> Top 3 papers by citations:",...top.map(p=>`  [${p.citations} cites] ${p.title.slice(0,50)}`)]);
      setResults(top.map(p=>({kind:"paper",item:p}))); setTab("search");
    } else if (c==="top topics") {
      const tm={}; SEED_PAPERS.forEach(p=>{tm[p.topic]=(tm[p.topic]||0)+1;});
      const top=Object.entries(tm).sort((a,b)=>b[1]-a[1]).slice(0,5);
      log(["> Top topics by paper count:",...top.map(([t,n])=>`  ${t}: ${n} papers`)]);
    } else if (c==="top researchers") {
      const top=[...SEED_RESEARCHERS].sort((a,b)=>calcARS(b)-calcARS(a)).slice(0,3);
      log(["> Top 3 researchers by ARS:",...top.map(r=>`  ARS ${calcARS(r).toFixed(1)} — ${r.name}`)]);
      setResults(top.map(r=>({kind:"researcher",item:r}))); setTab("search");
    } else if (c.startsWith("topic ")) {
      const t=c.slice(6).trim();
      const hits=SEED_PAPERS.filter(p=>p.topic.toLowerCase().includes(t));
      log([`> ${hits.length} paper(s) on "${t}".`,...hits.map(p=>`  ${p.title.slice(0,50)}`)]);
      setResults(hits.map(p=>({kind:"paper",item:p}))); setTab("search");
    } else if (c.startsWith("lab ")) {
      const l=c.slice(4).trim();
      const hits=SEED_LABS.filter(x=>x.name.toLowerCase().includes(l));
      log([`> ${hits.length} lab(s) matching "${l}".`,...hits.map(x=>`  ${x.name} — ${x.focus}`)]);
      setResults(hits.map(x=>({kind:"lab",item:x}))); setTab("search");
    } else if (c.startsWith("researcher ")) {
      const r=c.slice(11).trim();
      const hits=SEED_RESEARCHERS.filter(x=>x.name.toLowerCase().includes(r));
      log([`> ${hits.length} researcher(s) matching "${r}".`,...hits.map(x=>`  ARS ${calcARS(x).toFixed(1)} — ${x.name}, ${x.university}`)]);
      setResults(hits.map(x=>({kind:"researcher",item:x}))); setTab("search");
    } else if (c.startsWith("search ")) {
      const sq=c.slice(7).trim(); setQuery(sq); runSearch(sq); setTab("search");
      log([`> Searching for "${sq}"…`]);
    } else {
      log([`> Unknown command: "${c}". Type 'help'.`]);
    }
  };

  // ── trending data ────────────────────────────────────────
  const topPapers      = [...SEED_PAPERS].sort((a,b)=>b.citations-a.citations).slice(0,4);
  const topResearchers = [...SEED_RESEARCHERS].sort((a,b)=>calcARS(b)-calcARS(a)).slice(0,4);
  const topicCounts    = {};
  SEED_PAPERS.forEach(p=>{topicCounts[p.topic]=(topicCounts[p.topic]||0)+1;});
  const topTopics      = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1]);

  // ── protocol intelligence ────────────────────────────────
  const PROTOCOLS = ["Ethereum","Arbitrum","EigenLayer","Uniswap"];
  const protoData  = {
    Ethereum:  { papers: SEED_PAPERS.filter(p=>p.lab==="Ethereum Foundation Research"||p.topic==="Protocol Economics"), labs: ["Ethereum Foundation Research","MIT DCI"], researchers: ["Dankrad Feist","Dr. James McCarthy"] },
    Arbitrum:  { papers: SEED_PAPERS.filter(p=>p.topic==="DAO Governance"||p.topic==="Protocol Economics"), labs: ["Oxford Internet Institute"], researchers: ["Prof. Vili Lehdonvirta"] },
    EigenLayer:{ papers: SEED_PAPERS.filter(p=>p.topic==="Protocol Economics"||p.topic==="ZK Proofs"), labs: ["Ethereum Foundation Research","IF Labs"], researchers: ["Dankrad Feist","Dr. Yuki Tanaka"] },
    Uniswap:   { papers: SEED_PAPERS.filter(p=>p.topic==="DeFi"||p.topic==="Tokenomics"), labs: ["Stanford Blockchain","MIT DCI"], researchers: ["Dr. Felix Chen","Dr. James McCarthy"] },
  };
  const proto = protoData[activeProto] || {papers:[],labs:[],researchers:[]};

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/terminal</div>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:8}}>
          <h1 style={{fontSize:48,marginBottom:0}}>Research Terminal</h1>
          <span className="status-badge" style={{marginBottom:0}}><div className="status-dot"/>Live Data Feed</span>
        </div>
        <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>Query the AthenaX research knowledge graph. Protocol intelligence, researcher scores, trending topics.</p>
        <hr className="divider"/>

        {/* ── Onboarding guide ── */}
        <WindowCard label="TERMINAL_GUIDE.SYS" bodyClass="window-body window-body-blue" style={{marginBottom:28}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:24,flexWrap:"wrap"}}>
            <div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:10}}>QUICK START — CLICK ANY EXAMPLE TO RUN</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[
                  {label:"topic: zk proofs",    q:"topic: zk proofs"},
                  {label:"researcher: Dankrad",  q:"researcher: Dankrad"},
                  {label:"lab: MIT",             q:"lab: MIT"},
                  {label:"top papers",           q:"top papers"},
                  {label:"top researchers",      q:"top researchers"},
                ].map(ex=>(
                  <button key={ex.label} className="ftag" style={{cursor:"pointer",fontFamily:"'Space Mono',monospace",fontSize:11,border:"1.5px solid #1C1C27"}}
                    onClick={()=>{
                      setTab("search");
                      if(ex.q==="top papers"){ setResults(topPapers.map(p=>({kind:"paper",item:p}))); setQuery("top papers"); return; }
                      if(ex.q==="top researchers"){ setResults(topResearchers.map(r=>({kind:"researcher",item:r}))); setQuery("top researchers"); return; }
                      setQuery(ex.q); runSearch(ex.q);
                    }}>
                    &gt; {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6B6B7A",lineHeight:1.8,flexShrink:0}}>
              <div>topic: &lt;name&gt;      — filter papers</div>
              <div>lab: &lt;name&gt;        — find a lab</div>
              <div>researcher: &lt;name&gt; — find researcher</div>
              <div>top papers / top researchers</div>
            </div>
          </div>
        </WindowCard>

        {/* ── Tab bar ── */}
        <div style={{display:"flex",gap:8,marginBottom:32,flexWrap:"wrap"}}>
          {[["search","Search"],["trending","Trending"],["protocols","Protocol Intel"],["graph","Graph Explorer"],["access","Terminal Access"]].map(([id,label])=>(
            <button key={id}
              className={tab===id?"btn btn-ghost btn-sm":"btn btn-outline btn-sm"}
              style={tab===id?{background:"#F5D94E"}:{}}
              onClick={()=>setTab(id)}>{label}</button>
          ))}
        </div>

        {/* ══════════════ SEARCH TAB ══════════════ */}
        {tab==="search" && (
          <div>
            {/* Search bar */}
            <WindowCard label=">_ QUERY.SYS" style={{marginBottom:22}}>
              <div style={{display:"flex",gap:10}}>
                <input
                  className="inp"
                  style={{flex:1,fontFamily:"'Space Mono',monospace",fontSize:13}}
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                  placeholder="topic: zk proofs  |  lab: MIT  |  researcher: Vitalik  |  or free text…"
                  onKeyDown={e=>{if(e.key==="Enter")runSearch();}}
                />
                <button className="btn btn-primary" onClick={()=>runSearch()}>Search →</button>
              </div>
              <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                {["topic: ZK Proofs","topic: DAO Governance","lab: MIT","researcher: Dankrad","top papers"].map(s=>(
                  <button key={s} className="ftag" style={{cursor:"pointer",border:"1.5px solid #1C1C27"}} onClick={()=>{if(s==="top papers"){setResults(topPapers.map(p=>({kind:"paper",item:p})));return;}setQuery(s);runSearch(s);}}>{s}</button>
                ))}
              </div>
            </WindowCard>

            {/* Results */}
            {results===null && (
              <WindowCard label="AWAITING_QUERY.SYS" bodyClass="window-body window-body-blue">
                <p style={{color:"#6B6B7A",fontSize:14,fontFamily:"'Space Mono',monospace"}}>Enter a query above or use the quick filters to explore the research graph.</p>
              </WindowCard>
            )}
            {results!==null && results.length===0 && (
              <WindowCard label="NO_RESULTS.SYS">
                <p style={{color:"#6B6B7A",fontSize:14}}>No results matched your query. Try broader terms or a different prefix.</p>
              </WindowCard>
            )}
            {results!==null && results.length>0 && (
              <div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,letterSpacing:"0.06em",color:"#6B6B7A",marginBottom:12}}>{results.length} RESULT{results.length!==1?"S":""}</div>
                {results.map((r,i)=>{
                  if (r.kind==="paper") return (
                    <div key={i} className="archive-row" onClick={()=>setPage(`paper:${r.item.id}`)}>
                      <MediaIcon type="Essay"/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span className="topic-pill" style={{fontSize:10,padding:"2px 8px"}}>PAPER</span></div>
                        <div className="archive-title">{r.item.title}</div>
                        <div className="archive-meta">{r.item.year} // {r.item.topic} // {r.item.authors[0]}</div>
                      </div>
                      <div style={{display:"flex",gap:16,alignItems:"center",flexShrink:0}}>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:"#E8323C"}}>{r.item.citations}</div><div style={{fontSize:10,color:"#6B6B7A"}}>cites</div></div>
                        <div style={{textAlign:"right"}}><div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700}}>{r.item.reviewScore}</div><div style={{fontSize:10,color:"#6B6B7A"}}>score</div></div>
                      </div>
                    </div>
                  );
                  if (r.kind==="lab") return (
                    <div key={i} className="archive-row">
                      <div className="archive-icon" style={{background:"#EAF0F6"}}><IconLabsSmall/></div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span className="topic-pill" style={{fontSize:10,padding:"2px 8px",background:"#EAF0F6"}}>LAB</span></div>
                        <div className="archive-title">{r.item.name}</div>
                        <div className="archive-meta">{r.item.focus}</div>
                      </div>
                      <span className="ftag" style={{background:r.item.active?"#D4EDDA":"#F5DDE0"}}>{r.item.active?"Active":"Inactive"}</span>
                    </div>
                  );
                  if (r.kind==="researcher") return (
                    <div key={i} className="archive-row">
                      <div className="lb-avatar">{r.item.name.charAt(0)}</div>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><span className="topic-pill" style={{fontSize:10,padding:"2px 8px",background:"#F9F5DC"}}>RESEARCHER</span></div>
                        <div className="archive-title">{r.item.name}</div>
                        <div className="archive-meta">{r.item.university} // {r.item.lab}</div>
                      </div>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:13,fontWeight:700,color:"#E8323C"}}>ARS {calcARS(r.item).toFixed(1)}</div>
                    </div>
                  );
                  return null;
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TRENDING TAB ══════════════ */}
        {tab==="trending" && (
          <div className="grid-2" style={{gap:22}}>
            <div>
              <WindowCard label="TOP_PAPERS.SYS" style={{marginBottom:22}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:14}}>HIGHEST CITED — ALL TIME</div>
                {topPapers.map((p,i)=>(
                  <div key={p.id} className="lb-row" style={{cursor:"pointer"}} onClick={()=>setPage(`paper:${p.id}`)}>
                    <div className="lb-rank">{i+1}</div>
                    <div style={{flex:1}}><div className="lb-name" style={{fontSize:13}}>{p.title.slice(0,44)}…</div><div className="lb-meta">{p.topic}</div></div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:"#E8323C"}}>{p.citations}</div>
                      <div style={{fontSize:10,color:"#6B6B7A"}}>cites</div>
                    </div>
                  </div>
                ))}
              </WindowCard>
              <WindowCard label="TOP_RESEARCHERS.SYS">
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:14}}>HIGHEST ARS SCORE — CLICK TO EXPLORE</div>
                {topResearchers.map((r,i)=>(
                  <div key={r.id} className="lb-row" style={{cursor:"pointer"}}
                    onClick={()=>{ const q=`researcher: ${r.name.split(" ").pop()}`; setQuery(q); runSearch(q); setTab("search"); }}>
                    <div className={`lb-rank${i===0?" gold":""}`}>{i+1}</div>
                    <div className="lb-avatar">{r.name.charAt(0)}</div>
                    <div style={{flex:1}}><div className="lb-name">{r.name}</div><div className="lb-meta">{r.university}</div></div>
                    <div className="lb-ars">{calcARS(r).toFixed(1)}</div>
                  </div>
                ))}
              </WindowCard>
            </div>
            <div>
              <WindowCard label="TOPIC_VELOCITY.SYS" style={{marginBottom:22}} bodyClass="window-body window-body-blue">
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:14}}>PAPERS PER TOPIC</div>
                {topTopics.map(([topic,count])=>(
                  <div key={topic} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:13,fontWeight:600}}>{topic}</span>
                      <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#E8323C",fontWeight:700}}>{count}</span>
                    </div>
                    <div className="ars-bar-bg"><div className="ars-bar-fill" style={{width:`${(count/SEED_PAPERS.length)*100}%`}}/></div>
                  </div>
                ))}
              </WindowCard>
              <WindowCard label="TOPICS_INDEX.SYS" bodyClass="window-body window-body-yellow" style={{marginBottom:22}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:12}}>CLICK A TOPIC TO EXPLORE</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {topTopics.map(([topic])=>(
                    <button key={topic} className="topic-pill" style={{cursor:"pointer",border:"none",fontFamily:"'Space Grotesk',sans-serif"}}
                      onClick={()=>{ const q=`topic: ${topic}`; setQuery(q); runSearch(q); setTab("search"); }}>
                      {topic}
                    </button>
                  ))}
                </div>
              </WindowCard>
              <WindowCard label="NETWORK_STATS.SYS" bodyClass="window-body window-body-yellow">
                <div className="grid-2" style={{gap:12}}>
                  {[
                    {label:"Indexed Papers",value:SEED_PAPERS.length},
                    {label:"Active Researchers",value:SEED_RESEARCHERS.length},
                    {label:"Partner Labs",value:SEED_LABS.filter(l=>l.active).length},
                    {label:"Avg. ARS",value:(SEED_RESEARCHERS.reduce((a,r)=>a+calcARS(r),0)/SEED_RESEARCHERS.length).toFixed(1)},
                  ].map(s=>(
                    <div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:22}}>{s.value}</div></div>
                  ))}
                </div>
              </WindowCard>
            </div>
          </div>
        )}

        {/* ══════════════ PROTOCOLS TAB ══════════════ */}
        {tab==="protocols" && (
          <div>
            <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
              {PROTOCOLS.map(p=>(
                <button key={p}
                  className={activeProto===p?"btn btn-ghost btn-sm":"btn btn-outline btn-sm"}
                  style={activeProto===p?{background:"#F5D94E"}:{}}
                  onClick={()=>setActiveProto(p)}>{p}</button>
              ))}
            </div>
            <div className="grid-2" style={{gap:22}}>
              <div>
                <WindowCard label={`PAPERS: ${activeProto.toUpperCase()}`} style={{marginBottom:22}}>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:14}}>RELEVANT RESEARCH</div>
                  {proto.papers.length===0
                    ? <p style={{color:"#6B6B7A",fontSize:13}}>No indexed papers yet for this protocol.</p>
                    : proto.papers.slice(0,3).map(p=>(
                      <div key={p.id} className="archive-row" style={{marginBottom:8}} onClick={()=>setPage(`paper:${p.id}`)}>
                        <MediaIcon type="Essay"/>
                        <div style={{flex:1}}><div className="archive-title" style={{fontSize:13}}>{p.title.slice(0,48)}…</div><div className="archive-meta">{p.topic} // {p.citations} cites</div></div>
                      </div>
                    ))
                  }
                </WindowCard>
                <WindowCard label={`RESEARCHERS: ${activeProto.toUpperCase()}`}>
                  {proto.researchers.map(name=>{
                    const r=SEED_RESEARCHERS.find(x=>x.name===name);
                    if(!r) return null;
                    return (
                      <div key={name} className="lb-row">
                        <div className="lb-avatar">{name.charAt(0)}</div>
                        <div style={{flex:1}}><div className="lb-name">{name}</div><div className="lb-meta">{r.university}</div></div>
                        <div className="lb-ars">{calcARS(r).toFixed(1)}</div>
                      </div>
                    );
                  })}
                </WindowCard>
              </div>
              <div>
                <WindowCard label={`LABS: ${activeProto.toUpperCase()}`} bodyClass="window-body window-body-blue" style={{marginBottom:22}}>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:14}}>RESEARCH INFRASTRUCTURE</div>
                  {proto.labs.map(name=>{
                    const l=SEED_LABS.find(x=>x.name===name);
                    if(!l) return null;
                    return (
                      <div key={name} className="archive-row" style={{marginBottom:8}}>
                        <div className="archive-icon" style={{background:"#fff"}}><IconLabsSmall/></div>
                        <div style={{flex:1}}><div className="archive-title" style={{fontSize:13}}>{name}</div><div className="archive-meta">{l.focus}</div></div>
                        <span className="ftag" style={{background:l.active?"#D4EDDA":"#F5DDE0",flexShrink:0}}>{l.active?"Active":"Inactive"}</span>
                      </div>
                    );
                  })}
                </WindowCard>
                <WindowCard label="SPONSOR_INTEL.SYS" bodyClass="window-body window-body-yellow">
                  {SEED_SPONSORS.filter(s=>s.name.toLowerCase().includes(activeProto.toLowerCase())||activeProto==="Ethereum"&&s.name==="Ethereum Foundation").map(s=>(
                    <div key={s.name}>
                      <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{s.name}</div>
                      <div style={{fontSize:13,color:"#6B6B7A",marginBottom:8}}>{s.category} · {s.programs} programs · {s.amount}</div>
                      <p style={{fontSize:13,color:"#6B6B7A",lineHeight:1.6}}>{s.why}</p>
                    </div>
                  ))}
                  {!SEED_SPONSORS.some(s=>s.name.toLowerCase().includes(activeProto.toLowerCase())||activeProto==="Ethereum"&&s.name==="Ethereum Foundation") && (
                    <p style={{color:"#6B6B7A",fontSize:13}}>No sponsor data indexed for {activeProto} yet.</p>
                  )}
                </WindowCard>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ GRAPH TAB ══════════════ */}
        {tab==="graph" && (
          <div>
            <WindowCard label="GRAPH_EXPLORER.SYS" bodyClass="window-body window-body-blue" style={{marginBottom:22}}>
              <h3 style={{fontSize:22,marginBottom:10}}>Research Graph Explorer</h3>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.6,marginBottom:16}}>
                The AthenaX knowledge graph maps the full relationship network of Web3 research.
              </p>
              <div className="grid-2" style={{gap:16,marginBottom:20}}>
                <div style={{padding:"12px 14px",background:"#fff",border:"1.5px solid #1C1C27",borderRadius:8}}>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.06em",color:"#6B6B7A",marginBottom:8}}>NODES</div>
                  {[{c:"#E8323C",label:"Papers — indexed research"},
                    {c:"#F5D94E",label:"Researchers — ARS-scored"},
                    {c:"#1C1C27",label:"Labs — partner institutions"},
                    {c:"#EAF0F6",label:"Topics — research areas"},
                  ].map(n=>(
                    <div key={n.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:13}}>
                      <div style={{width:12,height:12,borderRadius:"50%",background:n.c,border:"1.5px solid #1C1C27",flexShrink:0}}/>
                      {n.label}
                    </div>
                  ))}
                </div>
                <div style={{padding:"12px 14px",background:"#fff",border:"1.5px solid #1C1C27",borderRadius:8}}>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.06em",color:"#6B6B7A",marginBottom:8}}>EDGES</div>
                  {[{label:"authored — paper ↔ lab"},
                    {label:"covers — paper ↔ topic"},
                    {label:"member_of — researcher ↔ lab"},
                  ].map(e=>(
                    <div key={e.label} style={{fontSize:13,color:"#1C1C27",marginBottom:6}}>{e.label}</div>
                  ))}
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.05em",color:"#6B6B7A",marginTop:10}}>Drag · Scroll to zoom · Click to inspect</div>
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.06em",color:"#6B6B7A",marginBottom:8}}>TRY THESE COMMANDS IN THE GRAPH TERMINAL</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["topic zk","researcher Dankrad","top topics","reset"].map(cmd=>(
                    <button key={cmd} className="ftag" style={{cursor:"pointer",fontFamily:"'Space Mono',monospace",fontSize:11,border:"1.5px solid #1C1C27"}}
                      onClick={()=>{ runCmd(cmd); }}>
                      &gt; {cmd}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button className="btn btn-primary" onClick={()=>setPage("research-graph")}>Open Full Graph →</button>
                <button className="btn btn-outline" onClick={()=>setPage("archive")}>Browse Archive</button>
              </div>
            </WindowCard>
            <div className="grid-3" style={{gap:20}}>
              {[
                {label:"Total Nodes",value:SEED_PAPERS.length+SEED_RESEARCHERS.length+SEED_LABS.length+Object.keys(topicCounts).length,sub:"papers + researchers + labs + topics"},
                {label:"Total Edges",value:SEED_PAPERS.length*2,sub:"authored + covers relationships"},
                {label:"Topics Mapped",value:Object.keys(topicCounts).length,sub:"unique research areas"},
              ].map(s=>(
                <div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div><div className="stat-sub">{s.sub}</div></div>
              ))}
            </div>
            <div style={{marginTop:22}}>
              <WindowCard label=">_ GRAPH_TERMINAL" bodyClass="window-body window-body-yellow">
                <p style={{fontSize:13,color:"#6B6B7A",marginBottom:12}}>
                  Run queries from the terminal below — results will highlight the corresponding nodes when you open the full graph.
                </p>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,minHeight:80,maxHeight:120,overflowY:"auto",marginBottom:12,padding:"10px 12px",background:"#F2EFE9",borderRadius:8,border:"1.5px solid #1C1C27"}}>
                  {cmdLog.slice(-6).map((l,i)=>(
                    <div key={i} style={{color:l.startsWith(">")?"#1C1C27":"#6B6B7A",lineHeight:1.7}}>{l}</div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input className="inp" style={{fontFamily:"'Space Mono',monospace",fontSize:12,padding:"8px 12px",flex:1}} value={cmdInput} onChange={e=>setCmdInput(e.target.value)} placeholder="top papers" onKeyDown={e=>{if(e.key==="Enter"){runCmd(cmdInput);setCmdInput("");}}}/>
                  <button className="btn btn-ghost btn-sm" onClick={()=>{runCmd(cmdInput);setCmdInput("");}}>Run</button>
                </div>
              </WindowCard>
            </div>
          </div>
        )}

        {/* ══════════════ ACCESS TAB ══════════════ */}
        {tab==="access" && (
          <div>
            <div className="grid-3" style={{gap:22,marginBottom:22}}>
              {[
                {plan:"Individual",price:"$500",period:"/month per seat",features:["Full paper search","Researcher ARS scores","Protocol intelligence","Citation & download data","Weekly digest access"],highlight:false},
                {plan:"Team",price:"$3,500",period:"/month unlimited seats",features:["Everything in Individual","Team workspace","Saved searches & alerts","Custom protocol watchlists","Priority support","API access (beta)"],highlight:true},
                {plan:"Enterprise",price:"Custom",period:"pricing",features:["Everything in Team","Custom data exports","Direct researcher introductions","White-label reports","SLA & dedicated support","Governance analytics"],highlight:false},
              ].map(t=>(
                <WindowCard key={t.plan} label={`PLAN: ${t.plan.toUpperCase()}`} bodyClass={t.highlight?"window-body window-body-yellow":"window-body"}>
                  <div style={{marginBottom:16}}>
                    <div style={{fontSize:32,fontWeight:700,color:t.highlight?"#E8323C":"#1C1C27"}}>{t.price}</div>
                    <div style={{fontSize:13,color:"#6B6B7A",fontFamily:"'Space Mono',monospace"}}>{t.period}</div>
                  </div>
                  <hr className="divider-sm"/>
                  {t.features.map(f=>(
                    <div key={f} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:8,fontSize:13}}>
                      <span style={{color:"#4CAF50",fontWeight:700,flexShrink:0}}>✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                  <hr className="divider-sm"/>
                  <button className={t.highlight?"btn btn-primary btn-sm":"btn btn-outline btn-sm"} style={{width:"100%",justifyContent:"center"}} onClick={()=>{if(!user){showToast("Sign in to subscribe.","error");return;}showToast(`${t.plan} plan inquiry submitted!`,"success");}}>
                    {t.price==="Custom"?"Get in Touch →":"Subscribe →"}
                  </button>
                </WindowCard>
              ))}
            </div>
            <WindowCard label="SUBSCRIBERS.SYS" bodyClass="window-body window-body-blue">
              <h3 style={{fontSize:20,marginBottom:12}}>Who Uses the Terminal</h3>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Paradigm","Electric Capital","Variant Fund","Delphi Digital","Multicoin","a16z crypto","Protocol treasury teams","Independent researchers"].map(s=>(
                  <span key={s} className="ftag">{s}</span>
                ))}
              </div>
            </WindowCard>
          </div>
        )}

        {/* ══════════════ PERSISTENT CMD STRIP ══════════════ */}
        {tab!=="graph" && (
          <div style={{marginTop:32}}>
            <WindowCard label=">_ TERMINAL_CMD">
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:11,minHeight:60,maxHeight:100,overflowY:"auto",marginBottom:10}}>
                {cmdLog.slice(-4).map((l,i)=>(
                  <div key={i} style={{color:l.startsWith(">")?"#1C1C27":"#6B6B7A",lineHeight:1.7}}>{l}</div>
                ))}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input className="inp" style={{fontFamily:"'Space Mono',monospace",fontSize:12,padding:"8px 12px",flex:1}} value={cmdInput} onChange={e=>setCmdInput(e.target.value)} placeholder="help | top papers | topic zk | researcher Dankrad…" onKeyDown={e=>{if(e.key==="Enter"){runCmd(cmdInput);setCmdInput("");if(["top papers","top researchers"].includes(cmdInput.toLowerCase())||cmdInput.toLowerCase().startsWith("topic ")||cmdInput.toLowerCase().startsWith("researcher ")||cmdInput.toLowerCase().startsWith("search "))setTab("search");}}}/>
                <button className="btn btn-ghost btn-sm" onClick={()=>{runCmd(cmdInput);setCmdInput("");}}>Run</button>
              </div>
            </WindowCard>
          </div>
        )}
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// BUSINESS MODEL PAGE
// ═══════════════════════════════════════════════════════════
const BusinessModelPage = ({ setPage }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/business-model</div>
      <h1 style={{fontSize:48,marginBottom:8}}>Business Model</h1>
      <p style={{fontSize:17,color:"#6B6B7A"}}>How AthenaX sustains itself and the network it powers.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        <WindowCard label="REVENUE.SYS" bodyClass="window-body window-body-yellow">
          <h3 style={{fontSize:22,marginBottom:18}}>Revenue Projections</h3>
          <div className="grid-2" style={{gap:12}}>
            {[{label:"Year 1",value:"$1.84M"},{label:"Year 2",value:"$6.18M"},{label:"Year 3",value:"$18.6M"},{label:"CAGR",value:"218%"}].map(s=>(
              <div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:20}}>{s.value}</div></div>
            ))}
          </div>
        </WindowCard>
        <WindowCard label="MARGINS.SYS">
          <h3 style={{fontSize:22,marginBottom:18}}>Unit Economics</h3>
          <div className="grid-2" style={{gap:12}}>
            {[{label:"Gross Margin",value:"78%"},{label:"EBITDA (Y3)",value:"48%"},{label:"Break-even",value:"Mo. 26"},{label:"EBITDA+",value:"Mo. 22"}].map(s=>(
              <div key={s.label} className="stat-card"><div className="stat-label">{s.label}</div><div className="stat-value" style={{fontSize:20}}>{s.value}</div></div>
            ))}
          </div>
        </WindowCard>
      </div>
      <WindowCard label="FUNDRAISE.SYS" bodyClass="window-body window-body-blue">
        <h3 style={{fontSize:22,marginBottom:16}}>Fundraising Roadmap</h3>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {[{round:"Seed",amount:"$3M",use:"MVP + first 6 researchers + 2 sponsor pilots"},{round:"Series A",amount:"$12M",use:"Scale network, 3 regional hubs, full Terminal product"},{round:"Series B",amount:"$35–50M",use:"Global expansion, startup fund, protocol acquisitions"}].map(r=>(
            <div key={r.round} style={{flex:1,minWidth:200,padding:"16px",background:"#fff",border:"2px solid #1C1C27",borderRadius:10}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:4}}>{r.round.toUpperCase()}</div>
              <div style={{fontSize:24,fontWeight:700,color:"#E8323C",marginBottom:6}}>{r.amount}</div>
              <div style={{fontSize:13,color:"#6B6B7A",lineHeight:1.5}}>{r.use}</div>
            </div>
          ))}
        </div>
      </WindowCard>
      <div style={{marginTop:22}}>
        <WindowCard label="INVESTOR_TARGETS.SYS">
          <h3 style={{fontSize:20,marginBottom:14}}>Target Investors</h3>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Paradigm","a16z crypto","Multicoin","Electric Capital","PL Ventures","Variant Fund","Delphi Digital"].map(i=>(
              <span key={i} className="ftag">{i}</span>
            ))}
          </div>
        </WindowCard>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// RESEARCH GRAPH PAGE
// ═══════════════════════════════════════════════════════════
const NODE_CONFIG = {
  paper:      {radius:14, color:"#E8323C",    labelColor:"#1C1C27"},
  researcher: {radius:16, color:"#F5D94E",    labelColor:"#1C1C27"},
  lab:        {radius:18, color:"#1C1C27",    labelColor:"#F2EFE9"},
  topic:      {radius:20, color:"#EAF0F6",    labelColor:"#1C1C27"},
};
const EDGE_CONFIG = {
  authored:  {color:"#E8323C",   dash:false},
  member_of: {color:"#1C1C27",   dash:false},
  covers:    {color:"#D8D4CC",   dash:true},
  topic:     {color:"#D8D4CC",   dash:true},
};

const buildGraphData = () => {
  const nodes=[], edges=[];
  const topics = Array.from(new Set(SEED_PAPERS.map(p=>p.topic)));
  topics.forEach(t=>nodes.push({id:`topic_${t}`,type:"topic",label:t,meta:{name:t}}));
  SEED_LABS.forEach(l=>nodes.push({id:l.id,type:"lab",label:l.name,meta:l}));
  SEED_PAPERS.forEach(p=>{
    nodes.push({id:`paper_${p.id}`,type:"paper",label:p.title.slice(0,30)+"…",meta:p});
    edges.push({source:`paper_${p.id}`,target:`topic_${p.topic}`,rel:"covers"});
    const lab=SEED_LABS.find(l=>l.name===p.lab);
    if(lab) edges.push({source:`paper_${p.id}`,target:lab.id,rel:"authored"});
  });
  SEED_RESEARCHERS.forEach(r=>{
    nodes.push({id:r.id,type:"researcher",label:r.name,meta:r});
    const lab=SEED_LABS.find(l=>l.name===r.lab||l.researchers.includes(r.name));
    if(lab) edges.push({source:r.id,target:lab.id,rel:"member_of"});
  });
  return {nodes,edges};
};

const runForce = (nodes,edges,W,H) => {
  for(let iter=0;iter<200;iter++){
    const cool=1-iter/200;
    nodes.forEach(a=>{ nodes.forEach(b=>{ if(a.id===b.id)return; const dx=b.x-a.x,dy=b.y-a.y,dist=Math.sqrt(dx*dx+dy*dy)||1; const f=800/(dist*dist); a.vx-=(dx/dist)*f; a.vy-=(dy/dist)*f; }); });
    const nm={};nodes.forEach(n=>{nm[n.id]=n;});
    edges.forEach(e=>{ const a=nm[e.source],b=nm[e.target]; if(!a||!b)return; const dx=b.x-a.x,dy=b.y-a.y,dist=Math.sqrt(dx*dx+dy*dy)||1,f=(dist-110)*0.03; a.vx+=(dx/dist)*f;a.vy+=(dy/dist)*f; b.vx-=(dx/dist)*f;b.vy-=(dy/dist)*f; });
    const speed=cool*0.85; const pad=30;
    nodes.forEach(n=>{ n.x=Math.max(pad,Math.min(W-pad,n.x+(n.vx||0)*speed)); n.y=Math.max(pad,Math.min(H-pad,n.y+(n.vy||0)*speed)); n.vx=(n.vx||0)*0.8;n.vy=(n.vy||0)*0.8; });
  }
  return nodes;
};

const ResearchGraphPage = ({ setPage }) => {
  const canvasRef = useRef(null);
  const stateRef  = useRef({nodes:[],edges:[],scale:1,ox:0,oy:0,drag:null,pan:null});
  const [selected,setSelected] = useState(null);
  const [highlight,setHighlight] = useState(null);
  const [cmd,setCmd] = useState("");
  const [cmdLog,setCmdLog] = useState(["> type 'help' for commands"]);
  const [graphReady,setGraphReady] = useState(false);

  useEffect(()=>{
    const {nodes,edges}=buildGraphData();
    const canvas=canvasRef.current; if(!canvas)return;
    const W=canvas.offsetWidth||740,H=canvas.offsetHeight||520;
    canvas.width=W; canvas.height=H;
    const positioned=runForce(nodes.map(n=>({...n,x:W/2+(Math.random()-0.5)*300,y:H/2+(Math.random()-0.5)*300,vx:0,vy:0})),edges,W,H);
    stateRef.current={...stateRef.current,nodes:positioned,edges}; setGraphReady(true);
  },[]);

  useEffect(()=>{ if(graphReady) draw(); },[graphReady,selected,highlight]);

  const draw = () => {
    const canvas=canvasRef.current; if(!canvas)return;
    const ctx=canvas.getContext("2d");
    const {nodes,edges,scale,ox,oy}=stateRef.current;
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.save(); ctx.translate(ox,oy); ctx.scale(scale,scale);
    const nm={}; nodes.forEach(n=>{nm[n.id]=n;});
    edges.forEach(e=>{
      const a=nm[e.source],b=nm[e.target]; if(!a||!b)return;
      const isHL=highlight&&(highlight.has(a.id)&&highlight.has(b.id));
      const cfg=EDGE_CONFIG[e.rel]||EDGE_CONFIG.topic;
      ctx.beginPath(); ctx.strokeStyle=isHL?cfg.color:"#D8D4CC"; ctx.lineWidth=isHL?2:1;
      if(cfg.dash)ctx.setLineDash([4,4]); else ctx.setLineDash([]);
      ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
    });
    nodes.forEach(n=>{
      const cfg=NODE_CONFIG[n.type]||NODE_CONFIG.topic;
      const isHL=highlight?highlight.has(n.id):false;
      const isSel=selected?.id===n.id;
      const dim=highlight&&!isHL;
      ctx.globalAlpha=dim?0.2:1;
      ctx.beginPath(); ctx.arc(n.x,n.y,cfg.radius+(isSel?3:0),0,Math.PI*2);
      ctx.fillStyle=cfg.color; ctx.fill();
      ctx.strokeStyle="#1C1C27"; ctx.lineWidth=isSel?3:2; ctx.stroke();
      ctx.globalAlpha=dim?0.15:0.85;
      ctx.font=`${isHL?"700":"400"} 10px 'Space Grotesk',sans-serif`;
      ctx.fillStyle="#1C1C27"; ctx.textAlign="center";
      ctx.fillText(n.label.slice(0,18),n.x,n.y+cfg.radius+13);
      ctx.globalAlpha=1;
    });
    ctx.restore();
  };

  const hitNode = (cx,cy) => {
    const {nodes,scale,ox,oy}=stateRef.current;
    const wx=(cx-ox)/scale,wy=(cy-oy)/scale;
    return nodes.find(n=>{ const cfg=NODE_CONFIG[n.type]||NODE_CONFIG.topic; return Math.sqrt((wx-n.x)**2+(wy-n.y)**2)<cfg.radius+4; })||null;
  };

  const getConnected = (nodeId) => {
    const {edges}=stateRef.current;
    const ids=new Set([nodeId]);
    edges.forEach(e=>{ if(e.source===nodeId)ids.add(e.target); if(e.target===nodeId)ids.add(e.source); });
    return ids;
  };

  const onMouseDown = (e) => {
    const rect=canvasRef.current.getBoundingClientRect();
    const cx=e.clientX-rect.left,cy=e.clientY-rect.top;
    const hit=hitNode(cx,cy);
    if(hit) stateRef.current.drag={node:hit,sx:cx,sy:cy,ox:hit.x,oy:hit.y};
    else stateRef.current.pan={sx:cx,sy:cy,sox:stateRef.current.ox,soy:stateRef.current.oy};
  };
  const onMouseMove = (e) => {
    const rect=canvasRef.current.getBoundingClientRect();
    const cx=e.clientX-rect.left,cy=e.clientY-rect.top;
    const s=stateRef.current;
    if(s.drag){
      s.drag.node.x=s.drag.ox+(cx-s.drag.sx)/s.scale;
      s.drag.node.y=s.drag.oy+(cy-s.drag.sy)/s.scale;
      draw();
    } else if(s.pan){
      s.ox=s.pan.sox+(cx-s.pan.sx); s.oy=s.pan.soy+(cy-s.pan.sy); draw();
    }
  };
  const onMouseUp = (e) => {
    const s=stateRef.current;
    if(s.drag){
      const rect=canvasRef.current.getBoundingClientRect();
      const moved=Math.abs(e.clientX-rect.left-s.drag.sx)+Math.abs(e.clientY-rect.top-s.drag.sy)<5;
      if(moved){const hit=s.drag.node;setSelected(hit);setHighlight(getConnected(hit.id));}
      s.drag=null;
    } else {s.pan=null;}
    draw();
  };
  const onWheel = (e) => {
    e.preventDefault();
    const s=stateRef.current;
    const rect=canvasRef.current.getBoundingClientRect();
    const cx=e.clientX-rect.left,cy=e.clientY-rect.top;
    const delta=e.deltaY>0?0.9:1.1;
    const ns=Math.max(0.35,Math.min(3,s.scale*delta));
    s.ox=cx-(cx-s.ox)*(ns/s.scale); s.oy=cy-(cy-s.oy)*(ns/s.scale); s.scale=ns; draw();
  };

  const runCmd = (raw) => {
    const c=raw.trim(); if(!c)return;
    const log=lines=>setCmdLog(p=>[...p.slice(-30),...lines]);
    const {nodes}=stateRef.current;
    if(c==="help") log(["> Commands: help | reset | top-papers | top-topics | topic [name] | researcher [name]"]);
    else if(c==="reset"){setSelected(null);setHighlight(null);log(["> Reset."]);}
    else if(c==="top-papers"){const top=[...SEED_PAPERS].sort((a,b)=>b.citations-a.citations).slice(0,3);const ids=new Set(top.map(p=>`paper_${p.id}`));setHighlight(ids);log(["> Top 3 papers by citations highlighted.",...top.map(p=>`  ${p.title.slice(0,40)} — ${p.citations} cites`)]);}
    else if(c==="top-topics"){const tm={};SEED_PAPERS.forEach(p=>{tm[p.topic]=(tm[p.topic]||0)+1;});const top=Object.entries(tm).sort((a,b)=>b[1]-a[1]);setHighlight(new Set(top.slice(0,3).map(([t])=>`topic_${t}`)));log(["> Top topics:",...top.slice(0,3).map(([t,n])=>`  ${t}: ${n} papers`)]);}
    else if(c.startsWith("topic ")){const q=c.slice(6).trim().toLowerCase();const m=nodes.filter(n=>n.type==="topic"&&n.label.toLowerCase().includes(q));setHighlight(new Set(m.map(n=>n.id)));log([m.length?`> Found ${m.length} topic(s) matching "${q}".`:`> No topics matched "${q}".`]);}
    else if(c.startsWith("researcher ")){const q=c.slice(11).trim().toLowerCase();const m=nodes.filter(n=>n.type==="researcher"&&n.meta?.name?.toLowerCase().includes(q));if(m[0]){setSelected(m[0]);setHighlight(getConnected(m[0].id));log([`> Found: ${m[0].label}`]);}else log([`> No researcher matched "${q}".`]);}
    else log([`> Unknown command: ${c}. Type 'help'.`]);
    draw();
  };

  const renderDetail = () => {
    if(!selected) return null;
    const m=selected.meta||{};
    const connCount=highlight?highlight.size-1:0;
    return (
      <div style={{padding:"18px 20px",borderTop:"2px solid #1C1C27"}}>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.07em",color:"#6B6B7A",marginBottom:6}}>{selected.type.toUpperCase()}</div>
        <div style={{fontWeight:700,fontSize:16,marginBottom:4}}>{selected.label}</div>
        {selected.type==="paper" && <div style={{fontSize:13,color:"#6B6B7A",marginBottom:8}}>{m.university} · {m.year} · {m.citations} citations</div>}
        {selected.type==="researcher" && <div style={{fontSize:13,color:"#6B6B7A",marginBottom:8}}>ARS {calcARS(m).toFixed(1)} · {m.university}</div>}
        {selected.type==="lab" && <div style={{fontSize:13,color:"#6B6B7A",marginBottom:8}}>{m.papers} papers · {m.focus}</div>}
        {selected.type==="topic" && <div style={{fontSize:13,color:"#6B6B7A",marginBottom:8}}>{SEED_PAPERS.filter(p=>p.topic===m.name).length} papers</div>}
        <div style={{fontSize:12,color:"#6B6B7A"}}>{connCount} connection{connCount!==1?"s":""}</div>
      </div>
    );
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/research-graph</div>
        <h1 style={{fontSize:48,marginBottom:8}}>Research Graph</h1>
        <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>Visual knowledge map. Papers, researchers, labs, topics.</p>
        <hr className="divider"/>
        <div className="grid-2" style={{gap:22,alignItems:"flex-start"}}>
          <div className="window-card">
            <div className="window-titlebar"><TrafficLights/><span className="titlebar-label">GRAPH_CANVAS.SYS</span></div>
            <canvas ref={canvasRef} style={{width:"100%",height:480,cursor:"grab"}}
              onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onWheel={onWheel}/>
            {renderDetail()}
          </div>
          <div>
            <WindowCard label=">_ GRAPH_TERMINAL" style={{marginBottom:20}}>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,minHeight:140,maxHeight:180,overflowY:"auto",marginBottom:12}}>
                {cmdLog.map((l,i)=><div key={i} style={{color:l.startsWith(">")?"#1C1C27":"#6B6B7A",lineHeight:1.7,fontSize:11}}>{l}</div>)}
              </div>
              <div style={{display:"flex",gap:8}}>
                <input className="inp" style={{fontFamily:"'Space Mono',monospace",fontSize:12,padding:"8px 12px"}} value={cmd} onChange={e=>setCmd(e.target.value)}
                  placeholder="help" onKeyDown={e=>{if(e.key==="Enter"){runCmd(cmd);setCmd("");}}}/>
                <button className="btn btn-ghost btn-sm" onClick={()=>{runCmd(cmd);setCmd("");}}>Run</button>
              </div>
            </WindowCard>
            <WindowCard label="LEGEND.SYS">
              {Object.entries(NODE_CONFIG).map(([type,cfg])=>(
                <div key={type} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid #D8D4CC"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",background:cfg.color,border:"2px solid #1C1C27",flexShrink:0}}/>
                  <span style={{fontSize:13,textTransform:"capitalize",fontWeight:500}}>{type}</span>
                </div>
              ))}
              <div style={{marginTop:12,fontSize:11,color:"#6B6B7A",fontFamily:"'Space Mono',monospace"}}>Click node · Drag · Scroll to zoom · Double-click to open</div>
            </WindowCard>
          </div>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// PROFILE PAGE
// ═══════════════════════════════════════════════════════════
const ProfilePage = ({ user, setPage, showToast, onUserUpdate }) => {
  const [editing,setEditing] = useState(false);
  const [editForm,setEditForm] = useState(null);
  const researcher = user?.role==="researcher" ? authSvc.getResearcher(user.id) : null;
  const papers     = user ? authSvc.getPapersByUser(user.id) : [];
  const applications = user ? authSvc.getApplications(user.id) : [];
  const ars        = researcher ? calcARS(researcher) : 0;

  const startEdit = () => setEditForm({name:user.name,bio:researcher?.bio||"",university:researcher?.university||"",lab:researcher?.lab||"",organization:user.organization||""});
  const cancelEdit = () => {setEditing(false);setEditForm(null);};
  const saveEdit = () => {
    const updated=authSvc.updateProfile(user.id,editForm);
    onUserUpdate(updated); setEditing(false); setEditForm(null);
    showToast("Profile updated.","success");
  };

  if(!user) return <div className="page-wrap section"><p>Please sign in.</p></div>;

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/profile</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Profile</h1>
        <hr className="divider"/>
        <div className="grid-2" style={{gap:22,alignItems:"flex-start"}}>
          <div>
            <WindowCard label="IDENTITY.SYS" style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                <div style={{width:56,height:56,borderRadius:"50%",background:"#F5D94E",border:"2px solid #1C1C27",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700}}>{user.avatar}</div>
                <div>
                  <div style={{fontSize:20,fontWeight:700}}>{user.name}</div>
                  <div style={{fontSize:13,color:"#6B6B7A"}}>{user.email}</div>
                  <span className="ftag" style={{marginTop:4,display:"inline-block"}}>{user.role}</span>
                </div>
              </div>
              {!editing ? (<>
                {researcher && <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6,marginBottom:12}}>{researcher.bio||"No bio yet."}</p>}
                {researcher && <div style={{fontSize:13,color:"#6B6B7A"}}>{researcher.university} · {researcher.lab}</div>}
                <button className="btn btn-ghost btn-sm" style={{marginTop:14}} onClick={()=>{setEditing(true);startEdit();}}>Edit Profile</button>
                {user.role==="researcher" && <button className="btn btn-primary btn-sm" style={{marginTop:8}} onClick={()=>setPage("submit-paper")}>Submit a Paper →</button>}
              </>) : (<>
                <div className="inp-group"><label className="inp-label">Name</label><input className="inp" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}/></div>
                {researcher && <>
                  <div className="inp-group"><label className="inp-label">Bio</label><textarea className="inp" rows={3} value={editForm.bio} onChange={e=>setEditForm(f=>({...f,bio:e.target.value}))}/></div>
                  <div className="inp-group"><label className="inp-label">University</label><input className="inp" value={editForm.university} onChange={e=>setEditForm(f=>({...f,university:e.target.value}))}/></div>
                  <div className="inp-group"><label className="inp-label">Lab</label><input className="inp" value={editForm.lab} onChange={e=>setEditForm(f=>({...f,lab:e.target.value}))}/></div>
                </>}
                <div style={{display:"flex",gap:10}}>
                  <button className="btn btn-primary btn-sm" onClick={saveEdit}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>Cancel</button>
                </div>
              </>)}
            </WindowCard>

            {user.role==="researcher" && researcher && (
              <WindowCard label="ARS_SCORE.SYS" bodyClass="window-body window-body-yellow">
                <ArsBreakdown r={researcher}/>
              </WindowCard>
            )}
            {user.role==="sponsor" && (
              <WindowCard label="SPONSOR_PANEL.SYS" bodyClass="window-body window-body-blue">
                <h3 style={{fontSize:18,marginBottom:12}}>Sponsor Actions</h3>
                <button className="btn btn-primary btn-sm" style={{width:"100%",marginBottom:8,justifyContent:"center"}} onClick={()=>setPage("post-bounty")}>Post a Bounty</button>
                <button className="btn btn-ghost btn-sm" style={{width:"100%",marginBottom:8,justifyContent:"center"}} onClick={()=>setPage("bounties")}>View Bounties</button>
                <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>setPage("sponsors")}>Sponsor Overview</button>
              </WindowCard>
            )}
            <WindowCard label="NEWSLETTERS.SYS" style={{marginTop:20}} bodyClass="window-body window-body-cream">
              <h3 style={{fontSize:18,marginBottom:16}}>Your Subscriptions</h3>
              {NEWSLETTERS.map(nl => (
                <NewsletterCard key={nl.id} nl={nl} email={user.email}/>
              ))}
            </WindowCard>
          </div>

          <div>
            {papers.length>0 && (
              <WindowCard label="MY_PAPERS.SYS" style={{marginBottom:20}}>
                {papers.map(p=>(
                  <div key={p.id} className="archive-row" onClick={()=>setPage(`paper:${p.id}`)}>
                    <div className="archive-icon" style={{background:"#F9F5DC"}}><IconPaperSmall/></div>
                    <div style={{flex:1}}>
                      <div className="archive-title" style={{fontSize:14}}>{p.title.slice(0,50)}…</div>
                      <div className="archive-meta">{p.year} // {p.topic}</div>
                    </div>
                  </div>
                ))}
              </WindowCard>
            )}
            <WindowCard label="APPLICATIONS.SYS" bodyClass="window-body window-body-cream">
              {applications.length===0 ? (
                <div>
                  <p style={{fontSize:14,color:"#6B6B7A",marginBottom:14}}>No applications yet.</p>
                  <button className="btn btn-primary btn-sm" onClick={()=>setPage("bounties")}>Browse Bounties →</button>
                </div>
              ) : applications.map(a=>(
                <div key={a.id} className="archive-row">
                  <div style={{flex:1}}>
                    <div className="archive-title" style={{fontSize:14}}>Bounty {a.bountyId}</div>
                    <div className="archive-meta">{new Date(a.appliedAt).toLocaleDateString()} // {a.status}</div>
                  </div>
                  <span className="ftag" style={{background:a.status==="pending"?"#FEF3C7":"#D4EDDA"}}>{a.status}</span>
                </div>
              ))}
            </WindowCard>
          </div>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// DOCS
// ═══════════════════════════════════════════════════════════
const DOCS_NAV = [
  {id:"docs",              label:"Overview"},
  {id:"docs-researchers",  label:"For Researchers"},
  {id:"docs-protocols",    label:"For Protocols"},
  {id:"docs-builders",     label:"For Builders"},
  {id:"docs-standards",    label:"ARS Standards"},
  {id:"docs-governance",   label:"Governance"},
  {id:"docs-media",        label:"Media Kit"},
];

const DocsSidebar = ({ current, setPage }) => (
  <div className="docs-sidebar">
    <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.08em",color:"#6B6B7A",textTransform:"uppercase",marginBottom:12}}>Documentation</div>
    {DOCS_NAV.map(item=>(
      <button key={item.id} className={`docs-sidebar-link${current===item.id?" active":""}`} onClick={()=>setPage(item.id)}>{item.label}</button>
    ))}
  </div>
);

const DocsShell = ({ current, setPage, children, title, subtitle, fileTag }) => (
  <div>
    <div className="page-wrap section">
      <div style={{marginBottom:18}}>
        {fileTag && <div className="path-badge">{fileTag}</div>}
        <h1 style={{fontSize:42,marginBottom:6}}>{title}</h1>
        {subtitle && <p style={{fontSize:17,color:"#6B6B7A"}}>{subtitle}</p>}
      </div>
      <hr className="divider"/>
      <div className="docs-layout">
        <DocsSidebar current={current} setPage={setPage}/>
        <div className="docs-content">{children}</div>
      </div>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

const DocSection = ({ title, children }) => (
  <div style={{marginBottom:36}}>
    <h3 style={{fontSize:22,marginBottom:14,paddingBottom:10,borderBottom:"2px solid #1C1C27"}}>{title}</h3>
    {children}
  </div>
);

const DocStep = ({ n, title, desc }) => (
  <div style={{display:"flex",gap:16,marginBottom:16}}>
    <div style={{width:32,height:32,borderRadius:8,background:"#F5D94E",border:"2px solid #1C1C27",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,flexShrink:0}}>{n}</div>
    <div><div style={{fontWeight:600,marginBottom:4}}>{title}</div><div style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{desc}</div></div>
  </div>
);

const DocsHomePage = ({ setPage }) => (
  <DocsShell current="docs" setPage={setPage} title="Documentation" subtitle="Everything you need to know about AthenaX." fileTag="/root/docs">
    <DocSection title="What is AthenaX?">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:14}}>AthenaX is a research coordination network that connects academic researchers, protocol sponsors, and builders in a single flywheel. Research gets funded. Ideas get built. Protocols get credibility.</p>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {["Researchers","Protocol Sponsors","Builders"].map(a=>(
          <span key={a} className="ftag">{a}</span>
        ))}
      </div>
    </DocSection>
    <DocSection title="Quick Start">
      <DocStep n="1" title="Choose your role" desc="Are you a researcher, protocol sponsor, or builder? Each has a different onboarding path."/>
      <DocStep n="2" title="Create an account" desc="Sign up and verify your affiliation — university, lab, or protocol."/>
      <DocStep n="3" title="Start contributing" desc="Submit papers, apply for bounties, or join a cohort."/>
      <DocStep n="4" title="Build reputation" desc="Your ARS score grows with each paper, review, citation, and bounty completion."/>
    </DocSection>
    <DocSection title="Explore Docs">
      <div className="grid-2" style={{gap:14}}>
        {DOCS_NAV.slice(1).map(d=>(
          <div key={d.id} className="archive-row" style={{cursor:"pointer"}} onClick={()=>setPage(d.id)}>
            <div className="archive-title" style={{fontSize:14}}>{d.label}</div>
          </div>
        ))}
      </div>
    </DocSection>
  </DocsShell>
);

const DocsResearchersPage = ({ setPage }) => (
  <DocsShell current="docs-researchers" setPage={setPage} title="For Researchers" subtitle="Get paid to do research." fileTag="/root/docs/researchers">
    <DocSection title="How Researchers Participate">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>Researchers submit papers, earn ARS scores, receive sponsor endorsements, and compete for bounties. Top researchers get placed in protocol roles via the Talent Marketplace.</p>
      <DocStep n="1" title="Submit a Paper" desc="Upload your research. It enters peer review immediately."/>
      <DocStep n="2" title="Earn ARS" desc="Citations, downloads, peer reviews, votes, and endorsements all contribute to your ARS score."/>
      <DocStep n="3" title="Apply for Bounties" desc="Compete for protocol-funded research challenges. Win by producing the best work."/>
      <DocStep n="4" title="Join a Cohort" desc="Top researchers join Builder Cohorts to turn their research into products."/>
    </DocSection>
    <DocSection title="ARS Formula">
      <WindowCard label="ARS_FORMULA.SYS" bodyClass="window-body window-body-yellow">
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:12,lineHeight:1.8}}>
          ARS = (citations × 0.30)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;+ (peerReviews × 0.25)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;+ (min(downloads/1000, 20) × 0.15)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;+ (min(votes/100, 20) × 0.15)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;+ (sponsorEndorsements × 0.10)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;+ (bountyCompletions × 0.05)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;— max 10.0
        </div>
      </WindowCard>
    </DocSection>
  </DocsShell>
);

const DocsProtocolsPage = ({ setPage }) => (
  <DocsShell current="docs-protocols" setPage={setPage} title="For Protocols" subtitle="Fund research that matters." fileTag="/root/docs/protocols">
    <DocSection title="How Protocols Participate">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>Protocols fund research tracks, post bounties, sponsor cohorts, and access the Research Terminal. You get credentialed academic work on your protocol's specific research needs.</p>
      <DocStep n="1" title="Choose a funding model" desc="Sponsored programs, one-off bounties, or cohort sponsorship. Mix and match."/>
      <DocStep n="2" title="Define research scope" desc="Work with AthenaX to design a research track that addresses your protocol's needs."/>
      <DocStep n="3" title="Fund and monitor" desc="Track paper progress, ARS scores, and download metrics in real time."/>
      <DocStep n="4" title="Receive deliverables" desc="Open-access papers published under your protocol's sponsorship. Real academic credibility."/>
    </DocSection>
    <DocSection title="Pricing">
      <div className="grid-2" style={{gap:14}}>
        {[{name:"Pilot",price:"$20K–50K",desc:"90-day research pilot. One topic. 3–5 researchers."},{name:"Track",price:"$100K–300K",desc:"6-month full research track. Lab partnership."},{name:"Cohort Sponsor",price:"$250K+",desc:"Co-brand an entire Builder Cohort cycle."}].map(p=>(
          <div key={p.name} className="stat-card">
            <div className="stat-label">{p.name}</div>
            <div className="stat-value" style={{fontSize:20,color:"#E8323C",marginBottom:6}}>{p.price}</div>
            <div style={{fontSize:13,color:"#6B6B7A"}}>{p.desc}</div>
          </div>
        ))}
      </div>
    </DocSection>
  </DocsShell>
);

const DocsBuilderPage = ({ setPage }) => (
  <DocsShell current="docs-builders" setPage={setPage} title="For Builders" subtitle="Turn research into products." fileTag="/root/docs/builders">
    <DocSection title="The Builder Pipeline">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>Builders take validated research from the AthenaX archive and turn it into protocol-ready products. Each cohort runs 12 weeks with structured support, sponsor access, and prize pools.</p>
      <DocStep n="1" title="Browse Research" desc="Find validated papers with high ARS scores in your technical area."/>
      <DocStep n="2" title="Apply to a Cohort" desc="Submit a product concept based on existing AthenaX research."/>
      <DocStep n="3" title="Build in public" desc="12-week intensive. Weekly demos. Sponsor feedback."/>
      <DocStep n="4" title="Launch" desc="Graduate with distribution, funding, and community."/>
    </DocSection>
    <DocSection title="What You Get">
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["$20K stipend","Protocol introductions","Legal wrapper","Community distribution","12 weeks mentorship","Pitch day","Equity-free grants"].map(b=><span key={b} className="ftag">{b}</span>)}
      </div>
    </DocSection>
  </DocsShell>
);

const DocsStandardsPage = ({ setPage }) => (
  <DocsShell current="docs-standards" setPage={setPage} title="ARS Standards" subtitle="How reputation is calculated." fileTag="/root/docs/ars-standards">
    <DocSection title="AthenaX Reputation Score">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>The ARS is a composite score calculated from six verified data points. It is immutable once computed for a given snapshot, and updates every 24 hours.</p>
      <WindowCard label="ARS_WEIGHTS.SYS" bodyClass="window-body window-body-blue">
        {[["Citations","0.30","Number of citations from indexed papers"],["Peer Reviews","0.25","Number of completed peer reviews as reviewer"],["Downloads","0.15","Capped at 20k downloads"],["Votes","0.15","Community votes, capped at 2000"],["Sponsor Endorsements","0.10","Direct endorsements from verified protocol sponsors"],["Bounty Completions","0.05","Number of successfully completed bounties"]].map(([label,weight,desc])=>(
          <div key={label} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #D8D4CC",alignItems:"center"}}>
            <div style={{width:40,fontFamily:"'Space Mono',monospace",fontSize:13,fontWeight:700,color:"#E8323C"}}>{weight}</div>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{label}</div><div style={{fontSize:12,color:"#6B6B7A"}}>{desc}</div></div>
          </div>
        ))}
      </WindowCard>
    </DocSection>
  </DocsShell>
);

const DocsGovernancePage = ({ setPage }) => (
  <DocsShell current="docs-governance" setPage={setPage} title="Governance" subtitle="How decisions get made." fileTag="/root/docs/governance">
    <DocSection title="Governance Model">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>AthenaX uses an optimistic governance model inspired by NounsDAO. High-ARS researchers and verified sponsors have voting weight on protocol decisions.</p>
      <div className="grid-2" style={{gap:14}}>
        {[{title:"Optimistic Execution",desc:"Proposals pass unless vetoed. Reduces coordination friction."},{title:"ARS-Weighted Voting",desc:"Voting weight is proportional to ARS score — not token holdings."},{title:"Sponsor Councils",desc:"Sponsors form councils with advisory rights, not veto power."},{title:"Builder Assembly",desc:"Cohort graduates form a builder assembly that votes on research tracks."}].map(g=>(
          <WindowCard key={g.title} label={`GOV: ${g.title.toUpperCase().replace(/ /g,"_")}`}>
            <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{g.desc}</p>
          </WindowCard>
        ))}
      </div>
    </DocSection>
  </DocsShell>
);

const DocsMediaPage = ({ setPage }) => {
  const mediaLogos = [
    { title:"Primary Lockup", src:"Logo_Dark.svg", bg:"#F2EFE9", bodyClass:"window-body" },
    { title:"Inverse Lockup", src:"Logo_White.svg", bg:"#1C1C27", bodyClass:"window-body", dark:true },
    { title:"Accent Lockup", src:"Logo_Yellow.svg", bg:"#1C1C27", bodyClass:"window-body", dark:true },
    { title:"Icon Mark", src:"Logo.svg", bg:"#F2EFE9", bodyClass:"window-body" },
  ];

  const palette = [
    { name:"Primary Red", hex:"#E8323C", bg:"#E8323C", fg:"#F2EFE9", use:"Primary accents, calls to action, and key emphasis" },
    { name:"Near-Black", hex:"#1C1C27", bg:"#1C1C27", fg:"#F2EFE9", use:"Primary text, strokes, dark surfaces" },
    { name:"Cream", hex:"#F2EFE9", bg:"#F2EFE9", fg:"#1C1C27", use:"Page fields, neutral canvas, and brand background" },
    { name:"Yellow", hex:"#F5D94E", bg:"#F5D94E", fg:"#1C1C27", use:"Labels, highlights, and category markers" },
  ];

  const usageGood = [
    "Use the supplied lockups and icon files without distortion.",
    "Keep generous clear space around the mark in crowded layouts.",
    "Pair the brand with high-contrast surfaces and strong typography.",
    "Attribute AthenaX accurately when describing sponsorship or partnership.",
  ];

  const usageBad = [
    "Do not redraw, stretch, skew, or rotate the symbol.",
    "Do not invent gradients, shadows, or alternate colorways.",
    "Do not imply endorsement, investment, or partnership unless confirmed.",
    "Do not combine the mark with unrelated icons into a new hybrid logo.",
  ];

  return (
    <DocsShell current="docs-media" setPage={setPage} title="Media Kit" subtitle="Press-ready assets, voice notes, and brand usage for partners, media, and ecosystem teams." fileTag="/root/docs/media-kit">
      <div className="section-stack-lg">
        <WindowCard label="MEDIA_KIT_OVERVIEW" bodyClass="window-body window-body-yellow">
          <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:24,alignItems:"start"}}>
            <div>
              <div className="path-badge" style={{marginBottom:14}}>CC0 / OPEN BRAND SYSTEM</div>
              <h2 style={{fontSize:34,lineHeight:1.02,marginBottom:12}}>AthenaX Press & Brand Pack</h2>
              <p style={{fontSize:15,color:"#6B6B7A",lineHeight:1.7,marginBottom:18}}>
                AthenaX is a research coordination system for frontier technology. This media kit gives editors, sponsors, and builders a clean way to talk about the project and use the brand responsibly.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
                {["CC0 assets","Logo lockups","Palette","Voice notes","Usage rules"].map((item)=>(
                  <span key={item} className="ftag">{item}</span>
                ))}
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <Link href="https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary">Download Brand PDF</button>
                </Link>
                <button className="btn btn-outline" onClick={()=>setPage("launch")}>See Product Surface</button>
              </div>
            </div>
            <div className="stat-card" style={{background:"#fff"}}>
              <div className="stat-label">Boilerplate</div>
              <div style={{fontSize:14,lineHeight:1.75,color:"#1C1C27"}}>
                AthenaX connects researchers, builders, and protocol ecosystems so validated ideas can move from paper to product. It is designed to make open research fundable, legible, and easier to build on.
              </div>
            </div>
          </div>
        </WindowCard>

        <DocSection title="Logo System">
          <div className="grid-2" style={{gap:18}}>
            {mediaLogos.map((logo)=>(
              <WindowCard key={logo.title} label={logo.title.toUpperCase().replace(/ /g,"_")} bodyClass={logo.bodyClass}>
                <div style={{background:logo.bg,border:"2px solid #1C1C27",borderRadius:12,padding:"28px 24px",display:"flex",alignItems:"center",justifyContent:"center",minHeight:180}}>
                  <img
                    src={`https://athenax.mypinx.store/Brand/${logo.src}`}
                    alt={logo.title}
                    width={520}
                    height={240}
                    style={{width:logo.title === "Icon Mark" ? 180 : "78%",height:"auto",display:"block"}}
                  />
                </div>
                <div style={{marginTop:14,fontSize:13,color:"#6B6B7A",lineHeight:1.65}}>
                  {logo.title === "Primary Lockup" && "Default mark for editorial coverage, decks, landing pages, and ecosystem references."}
                  {logo.title === "Inverse Lockup" && "Use on dark surfaces where maximum legibility is needed."}
                  {logo.title === "Accent Lockup" && "Best for highlighted placements, feature cards, and branded modules."}
                  {logo.title === "Icon Mark" && "Use the icon on its own in tight UI contexts or social/profile placements."}
                </div>
              </WindowCard>
            ))}
          </div>
        </DocSection>

        <DocSection title="Palette & Voice">
          <div className="grid-2" style={{gap:18,alignItems:"start"}}>
            <WindowCard label="PALETTE.TOKENS" bodyClass="window-body window-body-blue">
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {palette.map((color)=>(
                  <div key={color.name} style={{display:"grid",gridTemplateColumns:"88px 1fr",gap:14,alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(31,41,55,0.08)"}}>
                    <div style={{height:52,borderRadius:10,border:"2px solid #1C1C27",background:color.bg,boxShadow:"3px 3px 0 #1C1C27"}}/>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#1C1C27"}}>{color.name} <span style={{fontFamily:"'Space Mono',monospace",fontSize:11,color:"#6B6B7A"}}>{color.hex}</span></div>
                      <div style={{fontSize:13,color:"#6B6B7A",lineHeight:1.55}}>{color.use}</div>
                    </div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="VOICE_AND_COPY" bodyClass="window-body">
              <div style={{fontSize:14,lineHeight:1.8,color:"#1C1C27"}}>
                <div style={{marginBottom:12}}><strong>Core tone:</strong> rigorous, open, builder-literate, quietly ambitious.</div>
                <div style={{marginBottom:12}}><strong>Preferred language:</strong> research coordination, protocol ecosystems, public goods, frontier technology, open infrastructure.</div>
                <div style={{marginBottom:12}}><strong>Avoid:</strong> vague hype language, empty futurism, or framing AthenaX as just another media/news brand.</div>
                <div style={{marginBottom:16}}><strong>Short descriptor:</strong> AthenaX is a research operating system for frontier technology.</div>
                <div className="stat-card" style={{background:"#F2EFE9",padding:16}}>
                  <div className="stat-label">Recommended quote</div>
                  <div style={{fontSize:15,lineHeight:1.7}}>
                    “AthenaX helps serious research travel farther by giving it structure, visibility, and a path into products.”
                  </div>
                </div>
              </div>
            </WindowCard>
          </div>
        </DocSection>

        <DocSection title="Usage Rules">
          <div className="grid-2" style={{gap:18}}>
            <WindowCard label="DO" bodyClass="window-body window-body-yellow">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {usageGood.map((item, index)=>(
                  <div key={item} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:30,height:30,borderRadius:8,border:"2px solid #1C1C27",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,boxShadow:"2px 2px 0 #1C1C27"}}>{index + 1}</div>
                    <div style={{fontSize:14,lineHeight:1.7,color:"#1C1C27"}}>{item}</div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="DO_NOT" bodyClass="window-body">
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {usageBad.map((item, index)=>(
                  <div key={item} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <div style={{width:30,height:30,borderRadius:8,border:"2px solid #1C1C27",background:"#F5DDE0",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,boxShadow:"2px 2px 0 #1C1C27",color:"#E8323C"}}>{index + 1}</div>
                    <div style={{fontSize:14,lineHeight:1.7,color:"#1C1C27"}}>{item}</div>
                  </div>
                ))}
              </div>
            </WindowCard>
          </div>
        </DocSection>

        <DocSection title="Press Contact & Downloads">
          <div className="grid-2" style={{gap:18}}>
            <WindowCard label="PRESS_CONTACT" bodyClass="window-body">
              <div style={{fontSize:14,lineHeight:1.8,color:"#1C1C27"}}>
                <div style={{marginBottom:10}}><strong>Email:</strong> <a href="mailto:info@athenax.co" style={{color:"#E8323C",textDecoration:"underline"}}>info@athenax.co</a></div>
                <div style={{marginBottom:10}}><strong>Best for:</strong> press requests, partner decks, conference materials, podcast notes, sponsorship references.</div>
                <div><strong>Licence:</strong> CC0. Assets are open to use, adapt, and distribute, but usage must not falsely imply endorsement or a formal partnership.</div>
              </div>
            </WindowCard>

            <WindowCard label="DOWNLOADS" bodyClass="window-body window-body-blue">
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <Link href="https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}}>Download Brand Guidelines PDF</button>
                </Link>
                <Link href="https://athenax.mypinx.store/Brand/Logo.svg" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}}>Download SVG Mark</button>
                </Link>
                <Link href="https://athenax.mypinx.store/Brand/Logo_Dark.svg" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-outline" style={{width:"100%",justifyContent:"center"}}>Download Primary Lockup</button>
                </Link>
              </div>
            </WindowCard>
          </div>
        </DocSection>
      </div>
    </DocsShell>
  );
};

// ═══════════════════════════════════════════════════════════
// NEWSLETTER CARD — reusable sub/unsub widget
// ═══════════════════════════════════════════════════════════
const NewsletterCard = ({ nl, email }) => {
  const [subbed, setSubbed] = useState(() => email ? subscriberSvc.isSubscribed(email, nl.id) : false);
  const [localEmail, setLocalEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    const addr = email || localEmail.trim();
    if (!addr || !addr.includes("@")) { _globalShowToast("Enter a valid email.", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      if (subbed) {
        subscriberSvc.unsubscribe(addr, nl.id);
        setSubbed(false);
        _globalShowToast(`Unsubscribed from ${nl.name}.`, "info");
      } else {
        const r = subscriberSvc.subscribe(addr, nl.id);
        if (r.error) { _globalShowToast(r.error, "error"); }
        else { setSubbed(true); _globalShowToast(`Subscribed to ${nl.name}!`, "success"); }
      }
      setLoading(false);
    }, 350);
  };

  return (
    <WindowCard label={`NEWSLETTER: ${nl.id.toUpperCase()}`} bodyClass={subbed ? "window-body window-body-yellow" : "window-body"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14}}>
        <div>
          <h3 style={{fontSize:20,marginBottom:4}}>{nl.name}</h3>
          <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:"0.06em",color:"#6B6B7A",marginBottom:10}}>{nl.freq.toUpperCase()}</div>
          <p style={{fontSize:14,color:"#6B6B7A",lineHeight:1.6}}>{nl.desc}</p>
        </div>
        {subbed && (
          <div style={{flexShrink:0,background:"#D4EDDA",border:"1.5px solid #1C1C27",borderRadius:999,padding:"4px 12px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",whiteSpace:"nowrap"}}>
            ✓ SUBSCRIBED
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {nl.tags.map(t => <span key={t} className="ftag">{t}</span>)}
        <span className="ftag" style={{marginLeft:"auto",color:"#6B6B7A"}}>{(nl.count + (subbed ? 1 : 0)).toLocaleString()} readers</span>
      </div>
      <hr className="divider-sm"/>
      {!email && !subbed && (
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input className="inp" style={{flex:1,padding:"9px 12px",fontSize:13}} value={localEmail}
            onChange={e=>setLocalEmail(e.target.value)} placeholder="your@email.com"
            onKeyDown={e=>e.key==="Enter"&&handle()}/>
        </div>
      )}
      <button
        className={subbed ? "btn btn-ghost btn-sm" : "btn btn-primary btn-sm"}
        style={{justifyContent:"center"}}
        onClick={handle} disabled={loading}>
        {loading ? <span className="spinner"/> : subbed ? "Unsubscribe" : "Subscribe →"}
      </button>
    </WindowCard>
  );
};

// ═══════════════════════════════════════════════════════════
// DIGEST / NEWSLETTER PAGE
// ═══════════════════════════════════════════════════════════
const DigestPage = ({ setPage, user, showToast }) => {
  const pastIssues = SEED_MEDIA.filter(m => m.type === "Essay" || m.type === "Log").slice(0, 4);

  return (
    <div>
      <div className="page-wrap section section-stack-lg">
        <div className="section-heading">
          <div className="path-badge">/root/digest</div>
          <h1 style={{fontSize:48,marginBottom:0}}>Research Digest</h1>
          <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>Weekly dispatches from the AthenaX network. No noise, just signal.</p>
          <hr className="divider"/>
        </div>

        {/* Subscription cards */}
        <div className="section-stack-md">
          <div className="section-heading-tight">
            <h2 style={{fontSize:28,marginBottom:0}}>Choose Your Lists</h2>
            <p style={{fontSize:15,color:"#6B6B7A",marginBottom:0}}>Subscribe to one or all three. Unsubscribe any time.</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {NEWSLETTERS.map(nl => (
              <NewsletterCard key={nl.id} nl={nl} email={user?.email || ""} showToast={showToast}/>
            ))}
          </div>
        </div>

        {/* Past issues */}
        <div className="section-stack-md">
          <div className="section-heading-tight">
            <h2 style={{fontSize:28,marginBottom:0}}>Past Issues</h2>
            <p style={{fontSize:15,color:"#6B6B7A",marginBottom:0}}>The archive. Everything is CC0.</p>
          </div>
          {pastIssues.map(item => (
            <div key={item.id} className="archive-row" onClick={()=>setPage(`media:${item.id}`)}>
              <MediaIcon type={item.type}/>
              <div style={{flex:1}}>
                <div className="archive-title">{item.title}</div>
                <div className="archive-meta">{item.date} &nbsp;//&nbsp; {item.type}</div>
              </div>
              <span style={{color:"#6B6B7A",fontSize:18}}>→</span>
            </div>
          ))}
          <div style={{marginTop:16}}>
            <button className="link-arrow" onClick={()=>setPage("archive")}>View Full Archive →</button>
          </div>
        </div>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// SUBMIT PAPER PAGE
// ═══════════════════════════════════════════════════════════
const SubmitPaperPage = ({ setPage, user, showToast }) => {
  const [form,setForm] = useState({title:"",abstract:"",topic:"ZK Proofs",coauthors:"",university:user?.university||"",lab:user?.lab||"",year:new Date().getFullYear(),file:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!user){showToast("Sign in to submit a paper.","error");return;}
    if(!form.title||!form.abstract){showToast("Title and abstract are required.","error");return;}
    showToast("Paper submitted for peer review! You'll hear back within 14 days.","success");
    setPage("archive");
  };
  if(!user) return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/submit</div>
        <h1 style={{fontSize:42,marginBottom:16}}>Submit a Paper</h1>
        <p style={{fontSize:17,color:"#6B6B7A",marginBottom:24}}>You need to be signed in as a researcher to submit.</p>
        <button className="btn btn-primary" onClick={()=>setPage("home")}>← Back to Home</button>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-md section">
        <div className="path-badge">/root/submit</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Submit a Paper</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Open-access. Peer-reviewed. ARS-scored on acceptance.</p>
        <hr className="divider"/>
        <WindowCard label="PAPER_SUBMISSION.FORM">
          <div className="inp-group"><label className="inp-label">Paper Title *</label><input className="inp" value={form.title} onChange={set("title")} placeholder="A descriptive, full title"/></div>
          <div className="inp-group"><label className="inp-label">Abstract *</label><textarea className="inp" rows={5} value={form.abstract} onChange={set("abstract")} placeholder="250–500 words. Summarise the problem, method, and key findings."/></div>
          <div className="inp-group">
            <label className="inp-label">Research Topic</label>
            <select className="inp" value={form.topic} onChange={set("topic")}>
              {["ZK Proofs","DAO Governance","DeFi","Tokenomics","AI Agents","Protocol Economics","Security","Digital Nations","Consensus","Privacy"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid-2" style={{gap:16}}>
            <div className="inp-group"><label className="inp-label">University / Institution</label><input className="inp" value={form.university} onChange={set("university")} placeholder="MIT, Oxford…"/></div>
            <div className="inp-group"><label className="inp-label">Research Lab</label><input className="inp" value={form.lab} onChange={set("lab")} placeholder="Your lab or group"/></div>
          </div>
          <div className="inp-group"><label className="inp-label">Co-Authors (optional)</label><input className="inp" value={form.coauthors} onChange={set("coauthors")} placeholder="Full names, comma-separated"/></div>
          <div className="inp-group"><label className="inp-label">Publication Year</label><input className="inp" type="number" value={form.year} onChange={set("year")} min="2020" max="2030"/></div>
          <div className="inp-group">
            <label className="inp-label">Paper File (PDF link or arXiv URL)</label>
            <input className="inp" value={form.file} onChange={set("file")} placeholder="https://arxiv.org/abs/…"/>
          </div>
          <div style={{background:"#F2EFE9",border:"1.5px solid #D8D4CC",borderRadius:8,padding:"12px 14px",fontSize:13,color:"#6B6B7A",marginBottom:16,lineHeight:1.6}}>
            Submitted papers enter a 14-day blind peer review. Accepted papers are published open-access and immediately contribute to your ARS score. All work is CC0.
          </div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Submit for Review →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// APPLY AS LAB PAGE
// ═══════════════════════════════════════════════════════════
const ApplyLabPage = ({ setPage, showToast }) => {
  const [form,setForm] = useState({name:"",focus:"",university:"",contact:"",email:"",why:"",url:""});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.name||!form.email||!form.why){showToast("Please fill all required fields.","error");return;}
    showToast("Lab application submitted! We'll review and respond within one week.","success");
    setPage("labs");
  };
  return (
    <div>
      <div className="page-wrap page-wrap-narrow-sm section">
        <div className="path-badge">/root/network/labs/apply</div>
        <h1 style={{fontSize:42,marginBottom:8}}>Apply as a Research Lab</h1>
        <p style={{fontSize:16,color:"#6B6B7A",marginBottom:0}}>Join the AthenaX partner network. Get access to protocol sponsors, bounty funding, and the builder cohort pipeline.</p>
        <hr className="divider"/>
        <WindowCard label="LAB_APPLICATION.FORM">
          <div className="inp-group"><label className="inp-label">Lab Name *</label><input className="inp" value={form.name} onChange={set("name")} placeholder="e.g. Berkeley RDI"/></div>
          <div className="inp-group"><label className="inp-label">Research Focus *</label><input className="inp" value={form.focus} onChange={set("focus")} placeholder="e.g. Applied cryptography and ZK systems"/></div>
          <div className="inp-group"><label className="inp-label">University / Institution *</label><input className="inp" value={form.university} onChange={set("university")} placeholder="e.g. UC Berkeley"/></div>
          <div className="inp-group"><label className="inp-label">Primary Contact *</label><input className="inp" value={form.contact} onChange={set("contact")} placeholder="Name of lab director or PI"/></div>
          <div className="inp-group"><label className="inp-label">Email *</label><input className="inp" type="email" value={form.email} onChange={set("email")} placeholder="contact@lab.edu"/></div>
          <div className="inp-group"><label className="inp-label">Lab Website</label><input className="inp" value={form.url} onChange={set("url")} placeholder="https://yourlab.edu"/></div>
          <div className="inp-group"><label className="inp-label">Why join AthenaX? *</label><textarea className="inp" rows={3} value={form.why} onChange={set("why")} placeholder="What research are you working on and how would the network benefit your lab?"/></div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center"}} onClick={submit}>Submit Application →</button>
        </WindowCard>
      </div>
      <Footer setPage={setPage}/>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════
const AboutPage = ({ setPage }) => (
  <div>
    <div className="page-wrap section">
      <div className="path-badge">/root/about</div>
      <h1 style={{fontSize:48,marginBottom:8}}>About AthenaX</h1>
      <p style={{fontSize:17,color:"#6B6B7A",marginBottom:0}}>The research and innovation engine of Web3.</p>
      <hr className="divider"/>
      <div className="grid-2" style={{gap:22,marginBottom:44}}>
        <WindowCard label="MISSION.TXT">
          <h3 style={{fontSize:22,marginBottom:14}}>Why We Exist</h3>
          <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:14}}>The best blockchain research sits locked inside university labs, unread by the protocol teams that need it most. And the best protocol problems sit unlisted, unknown to the researchers who could solve them.</p>
          <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27"}}>AthenaX is the coordination layer between them. We fund open research, score it objectively, and turn the most validated ideas into funded startups.</p>
        </WindowCard>
        <WindowCard label="VALUES.TXT" bodyClass="window-body window-body-yellow">
          <h3 style={{fontSize:22,marginBottom:14}}>Principles</h3>
          {[
            ["Open by Default","All research published under CC0. No paywalls. No rights reserved."],
            ["Proof of Work","Reputation is earned through citations, peer reviews, and bounties — not credentials."],
            ["Public Goods First","The network exists to produce knowledge, not to capture it."],
            ["Onchain Everything","Funding, governance, and reputation flow onchain where possible."],
          ].map(([title,desc])=>(
            <div key={title} style={{marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{title}</div>
              <div style={{fontSize:14,color:"#6B6B7A",lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </WindowCard>
      </div>
      <div style={{marginBottom:44}}>
        <h2 style={{fontSize:32,marginBottom:6}}>The Team</h2>
        <p style={{fontSize:15,color:"#6B6B7A",marginBottom:28}}>AthenaX is built by a small, focused team.</p>
        <WindowCard label="TEAM.SYS" bodyClass="window-body window-body-cream">
          <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
            {["Founder & CEO","Research Lead","Protocol Relations","Engineering","Design"].map(role=>(
              <div key={role} style={{padding:"16px 20px",background:"#fff",border:"2px solid #1C1C27",borderRadius:10,minWidth:160}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:"#F5D94E",border:"2px solid #1C1C27",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,marginBottom:10}}>?</div>
                <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,color:"#6B6B7A",letterSpacing:"0.06em",textTransform:"uppercase"}}>{role}</div>
              </div>
            ))}
          </div>
        </WindowCard>
      </div>
      <WindowCard label="CONTACT.SYS" bodyClass="window-body window-body-blue">
        <h3 style={{fontSize:22,marginBottom:12}}>Get in Touch</h3>
        <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
          <button className="btn btn-primary" onClick={()=>setPage("sponsor-onboarding")}>Become a Sponsor →</button>
          <button className="btn btn-outline" onClick={()=>setPage("apply-lab")}>Join as a Lab →</button>
          <button className="btn btn-ghost" onClick={()=>setPage("apply-cohort")}>Apply to Cohort →</button>
        </div>
      </WindowCard>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

const PlaceholderPage = ({ title, description, setPage }) => (
  <div>
    <div className="page-wrap section">
      <h1 style={{fontSize:48,marginBottom:12}}>{title}</h1>
      <p style={{fontSize:17,color:"#6B6B7A",marginBottom:28}}>{description}</p>
      <button className="btn btn-outline" onClick={()=>setPage("home")}>← Back to Home</button>
    </div>
    <Footer setPage={setPage}/>
  </div>
);

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const routeState = getPageForPathname(pathname);
  const [page,setPage]               = useState("home");
  const [selectedLab,setSelectedLab] = useState(null);
  const [user,setUser]               = useState(null);
  const [toasts,setToasts]           = useState([]);
  const [showLogin,setShowLogin]     = useState(false);
  const [showRegister,setShowRegister] = useState(false);
  const { articles, research, loading: archiveLoading, error: archiveError } = useArchiveContent();
  const latestArticles = articles.slice(0, 5);

  useEffect(()=>{ initDB(); const session=authSvc.getSession(); if(session)setUser(session); },[]);
  useEffect(() => {
    setPage(routeState.page);
  }, [routeState.page]);

  const showToast = (text, type="info") => {
    const id=Math.random().toString(36).slice(2,8);
    setToasts(t=>[...t,{id,text,type}]);
  };
  // wire global ref so Footer can call showToast without prop drilling
  _globalShowToast = showToast;
  const removeToast = (id) => setToasts(t=>t.filter(x=>x.id!==id));

  const handleLogout = () => { authSvc.logout(); setUser(null); showToast("Signed out.","info"); navigate("home"); };

  const navigate = (target) => {
    const nextPath = getPathForPage(target);
    setPage(target);
    if (nextPath && nextPath !== pathname) {
      router.push(nextPath);
    }
    window.scrollTo({top:0,behavior:"smooth"});
  };

  const handleAuthClick = (action) => {
    if(action==="login")  { setShowLogin(true); return; }
    if(action==="register"){ setShowRegister(true); return; }
    if(action==="logout")  { handleLogout(); return; }
  };

  const renderPage = () => {
    if(page.startsWith("article:")) {
      const slug = page.replace("article:","");
      const initialItem = articles.find((item) => item.slug === slug) || null;
      return <ContentDetailPage kind="article" slug={slug} initialItem={initialItem} setPage={navigate}/>;
    }
    if(page.startsWith("research:")) {
      const slug = page.replace("research:","");
      const initialItem = research.find((item) => item.slug === slug) || null;
      return <ContentDetailPage kind="research" slug={slug} initialItem={initialItem} setPage={navigate}/>;
    }
    if(page.startsWith("paper:")) {
      const paperId = page.replace("paper:","");
      return <PaperPage paperId={paperId} setPage={navigate} user={user} showToast={showToast}/>;
    }
    if(page.startsWith("media:")) {
      const mediaId = page.replace("media:","");
      return <MediaPage mediaId={mediaId} setPage={navigate}/>;
    }
    if(page.startsWith("launch-detail:")) {
      const launchId = page.replace("launch-detail:","");
      return <LaunchDetailPage launchId={launchId} setPage={navigate} user={user} showToast={showToast}/>;
    }
    if(page.startsWith("terminal:topic:")) {
      const topic = page.replace("terminal:topic:","");
      return <TerminalPage setPage={navigate} user={user} showToast={showToast} initialQuery={`topic: ${topic}`}/>;
    }
    switch(page){
      case "home":              return <HomePage setPage={navigate} latestArticles={latestArticles} articlesLoading={archiveLoading} articlesError={archiveError}/>;
      case "how-it-works":     return <HowItWorksPage setPage={navigate}/>;
      case "about":            return <AboutPage setPage={navigate}/>;
      case "archive":          return <ArchivePage setPage={navigate} articles={articles} research={research} loading={archiveLoading} error={archiveError} initialTab={routeState.archiveTab}/>;
      case "leaderboard":      return <ArchivePage setPage={navigate} articles={articles} research={research} loading={archiveLoading} error={archiveError} initialTab={routeState.archiveTab}/>;
      case "submit-paper":     return <SubmitPaperPage setPage={navigate} user={user} showToast={showToast}/>;
      case "network":          return <NetworkPage setPage={navigate}/>;
      case "labs":             return <LabsPage setPage={navigate} setSelectedLab={setSelectedLab}/>;
      case "lab-profile":      return <LabProfilePage lab={selectedLab} setPage={navigate}/>;
      case "apply-lab":        return <ApplyLabPage setPage={navigate} showToast={showToast}/>;
      case "universities":     return <UniversitiesPage setPage={navigate}/>;
      case "sponsors":         return <SponsorsPage setPage={navigate}/>;
      case "sponsor-onboarding": return <SponsorOnboardingPage setPage={navigate} user={user} showToast={showToast}/>;
      case "talent":           return <TalentPage setPage={navigate} user={user} showToast={showToast}/>;
      case "funding":          return <FundingPage setPage={navigate}/>;
      case "bounties":         return <BountiesPage setPage={navigate} user={user} showToast={showToast}/>;
      case "post-bounty":      return <PostBountyPage setPage={navigate} user={user} showToast={showToast}/>;
      case "cohorts":          return <CohortsPage setPage={navigate}/>;
      case "launch":           return <LaunchPage setPage={navigate} user={user} showToast={showToast}/>;
      case "apply-cohort":     return <ApplyCohortPage setPage={navigate} user={user} showToast={showToast}/>;
      case "terminal":          return <TerminalPage setPage={navigate} user={user} showToast={showToast}/>;
      case "business-model":   return <BusinessModelPage setPage={navigate}/>;
      case "research-graph":   return <ResearchGraphPage setPage={navigate}/>;
      case "profile":          return <ProfilePage user={user} setPage={navigate} showToast={showToast} onUserUpdate={setUser}/>;
      case "digest":           return <DigestPage setPage={navigate} user={user} showToast={showToast}/>;
      case "docs":             return <DocsHomePage setPage={navigate}/>;
      case "docs-researchers": return <DocsResearchersPage setPage={navigate}/>;
      case "docs-protocols":   return <DocsProtocolsPage setPage={navigate}/>;
      case "docs-builders":    return <DocsBuilderPage setPage={navigate}/>;
      case "docs-standards":   return <DocsStandardsPage setPage={navigate}/>;
      case "docs-governance":  return <DocsGovernancePage setPage={navigate}/>;
      case "docs-media":       return <DocsMediaPage setPage={navigate}/>;
      case "brand":            return <DocsMediaPage setPage={navigate}/>;
      default: return <PlaceholderPage title={page} description="Page coming soon." setPage={navigate}/>;
    }
  };

  return (
    <>
      <GlobalStyles/>
      <div style={{minHeight:"100vh",background:"#F2EFE9"}}>
        <Navbar current={page} setPage={navigate} user={user} onAuthClick={handleAuthClick}/>
        {renderPage()}
      </div>
      <div className="toast-wrap">
        {toasts.map(t=><Toast key={t.id} msg={t} onClose={()=>removeToast(t.id)}/>)}
      </div>
      {showLogin    && <LoginModal    onClose={()=>setShowLogin(false)}    onSuccess={setUser} showToast={showToast}/>}
      {showRegister && <RegisterModal onClose={()=>setShowRegister(false)} onSuccess={setUser} showToast={showToast}/>}
    </>
  );
}
