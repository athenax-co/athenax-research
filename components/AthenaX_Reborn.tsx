"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LaunchPage, { LaunchDetailPage } from "./page/launch";
import Navbar from "./Navbar";
import { getArticles, getResearch, sortByPublishedAtDesc } from "../lib/api";
import Toast from "./ui/Toast";
import AboutPage from "./page/about";
import ApplyLabPage from "./page/apply-lab";
import SubmitPaperPage from "./page/submit-paper";
import PaperPage from "./page/paper";
import DocsMediaPage from "./page/docs-media";
import HomePage from "./page/home";
import HowItWorksPage from "./page/how-it-works";
import LoginModal from "./ui/LoginModal";
import RegisterModal from "./ui/RegisterModal";
import MediaPage from "./page/media";
import ContentDetailPage from "./page/content-details";
import ArchivePage from "./page/archive";
import ResearchGraphPage from "./page/research-grapg";
import TerminalPage from "./page/terminal";
import TalentPage from "./page/talent";
import NetworkPage from "./page/network";
import LabsPage from "./page/labs";
import LabProfilePage from "./page/labs-profile";
import UniversitiesPage from "./page/universities";
import SponsorOnboardingPage from "./page/sponsor-onboarding";
import SponsorsPage from "./page/sponsors";
import ProfilePage from "./page/profile";
import BountiesPage from "./page/bounties";
import CohortsPage from "./page/cohorts";
import DigestPage from "./page/digest";
import FundingPage from "./page/funding";
import BusinessModelPage from "./page/business-model";
import PostBountyPage from "./page/post-bounty";
import ApplyCohortPage from "./page/apply-cohort";
import PlaceholderPage from "./page/placeholder";
import DocsHomePage from "./page/docs";
import DocsResearchersPage from "./page/docs-researchers";
import DocsProtocolsPage from "./page/docs-protocols";
import DocsBuilderPage from "./page/docs-builder";
import DocsStandardsPage from "./page/docs-standards";
import DocsGovernancePage from "./page/docs-governance";
import { authSvc, initDB } from "@/lib/db-helper";

// Global toast ref — lets Footer call showToast without prop drilling
export let _globalShowToast = (text: string, type: string) => {};

type ArchiveItem = {
  slug: string;
  [key: string]: any;
};

type ToastItem = {
  id: string;
  text: string;
  type: string;
};

const useArchiveContent = () => {
  const [articles, setArticles] = useState<ArchiveItem[]>([]);
  const [research, setResearch] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [articleItems, researchItems] = await Promise.all([getArticles(), getResearch()]);
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

const ROUTED_PAGES: Record<string, string> = {
  archive: "/archive",
  home: "/",
  research: "/research",
};

const getPathForPage = (page: string) => {
  if (!page) return "/";
  if (page.startsWith("article:")) {
    return `/archive/${page.replace("article:", "")}`;
  }
  if (page.startsWith("research:")) {
    return `/research/${page.replace("research:", "")}`;
  }
  return ROUTED_PAGES[page] ?? null;
};

const getPageForPathname = (pathname: string) => {
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
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const router = useRouter();
  const pathname = usePathname();
  const routeState = getPageForPathname(pathname);
  const [page, setPage] = useState("home");
  const [selectedLab, setSelectedLab] = useState(null);
  const [user, setUser] = useState(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { articles, research, loading: archiveLoading, error: archiveError } = useArchiveContent();
  const latestArticles = articles.slice(0, 5);

  useEffect(() => {
    initDB();
    const session = authSvc.getSession();
    if (session) setUser(session);
  }, []);
  useEffect(() => {
    setPage(routeState.page);
  }, [routeState.page]);

  const showToast = (text: string, type: string = "info") => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((t) => [...t, { id, text, type }]);
  };
  // wire global ref so Footer can call showToast without prop drilling
  _globalShowToast = showToast;
  const removeToast = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  const handleLogout = () => {
    authSvc.logout();
    setUser(null);
    showToast("Signed out.", "info");
    navigate("home");
  };

  const navigate = (target: string) => {
    const nextPath = getPathForPage(target);
    setPage(target);
    if (nextPath && nextPath !== pathname) {
      router.push(nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthClick = (action: string) => {
    if (action === "login") {
      setShowLogin(true);
      return;
    }
    if (action === "register") {
      setShowRegister(true);
      return;
    }
    if (action === "logout") {
      handleLogout();
      return;
    }
  };

  const renderPage = () => {
    if (page.startsWith("article:")) {
      const slug = page.replace("article:", "");
      const initialItem = articles.find((item) => item.slug === slug) || null;
      return <ContentDetailPage kind="article" slug={slug} initialItem={initialItem} setPage={navigate} />;
    }
    if (page.startsWith("research:")) {
      const slug = page.replace("research:", "");
      const initialItem = research.find((item) => item.slug === slug) || null;
      return <ContentDetailPage kind="research" slug={slug} initialItem={initialItem} setPage={navigate} />;
    }
    if (page.startsWith("paper:")) {
      const paperId = page.replace("paper:", "");
      return <PaperPage paperId={paperId} setPage={navigate} user={user} showToast={showToast} />;
    }
    if (page.startsWith("media:")) {
      const mediaId = page.replace("media:", "");
      return <MediaPage mediaId={mediaId} setPage={navigate} />;
    }
    if (page.startsWith("launch-detail:")) {
      const launchId = page.replace("launch-detail:", "");
      return <LaunchDetailPage launchId={launchId} setPage={navigate} user={user} showToast={showToast} />;
    }
    if (page.startsWith("terminal:topic:")) {
      const topic = page.replace("terminal:topic:", "");
      return <TerminalPage setPage={navigate} user={user} showToast={showToast} initialQuery={`topic: ${topic}`} />;
    }
    switch (page) {
      case "home":
        return <HomePage setPage={navigate} latestArticles={latestArticles} articlesLoading={archiveLoading} articlesError={archiveError} />;
      case "how-it-works":
        return <HowItWorksPage setPage={navigate} />;
      case "about":
        return <AboutPage setPage={navigate} />;
      case "archive":
        return (
          <ArchivePage
            setPage={navigate}
            articles={articles}
            research={research}
            loading={archiveLoading}
            error={archiveError}
            initialTab={routeState.archiveTab}
          />
        );
      case "leaderboard":
        return (
          <ArchivePage
            setPage={navigate}
            articles={articles}
            research={research}
            loading={archiveLoading}
            error={archiveError}
            initialTab={routeState.archiveTab}
          />
        );
      case "submit-paper":
        return <SubmitPaperPage setPage={navigate} user={user} showToast={showToast} />;
      case "network":
        return <NetworkPage setPage={navigate} />;
      case "labs":
        return <LabsPage setPage={navigate} setSelectedLab={setSelectedLab} />;
      case "lab-profile":
        return <LabProfilePage lab={selectedLab} setPage={navigate} />;
      case "apply-lab":
        return <ApplyLabPage setPage={navigate} showToast={showToast} />;
      case "universities":
        return <UniversitiesPage setPage={navigate} />;
      case "sponsors":
        return <SponsorsPage setPage={navigate} />;
      case "sponsor-onboarding":
        return <SponsorOnboardingPage setPage={navigate} user={user} showToast={showToast} />;
      case "talent":
        return <TalentPage setPage={navigate} user={user} showToast={showToast} />;
      case "funding":
        return <FundingPage setPage={navigate} />;
      case "bounties":
        return <BountiesPage setPage={navigate} user={user} showToast={showToast} />;
      case "post-bounty":
        return <PostBountyPage setPage={navigate} user={user} showToast={showToast} />;
      case "cohorts":
        return <CohortsPage setPage={navigate} />;
      case "launch":
        return <LaunchPage setPage={navigate} user={user} showToast={showToast} />;
      case "apply-cohort":
        return <ApplyCohortPage setPage={navigate} user={user} showToast={showToast} />;
      case "terminal":
        return <TerminalPage setPage={navigate} user={user} showToast={showToast} />;
      case "business-model":
        return <BusinessModelPage setPage={navigate} />;
      case "research-graph":
        return <ResearchGraphPage setPage={navigate} />;
      case "profile":
        return <ProfilePage user={user} setPage={navigate} showToast={showToast} onUserUpdate={setUser} />;
      case "digest":
        return <DigestPage setPage={navigate} user={user} showToast={showToast} />;
      case "docs":
        return <DocsHomePage setPage={navigate} />;
      case "docs-researchers":
        return <DocsResearchersPage setPage={navigate} />;
      case "docs-protocols":
        return <DocsProtocolsPage setPage={navigate} />;
      case "docs-builders":
        return <DocsBuilderPage setPage={navigate} />;
      case "docs-standards":
        return <DocsStandardsPage setPage={navigate} />;
      case "docs-governance":
        return <DocsGovernancePage setPage={navigate} />;
      case "docs-media":
        return <DocsMediaPage setPage={navigate} />;
      case "brand":
        return <DocsMediaPage setPage={navigate} />;
      default:
        return <PlaceholderPage title={page} description="Page coming soon." setPage={navigate} />;
    }
  };

  return (
    <>
      <div style={{ minHeight: "100vh", background: "#F2EFE9" }}>
        <Navbar current={page} setPage={navigate} user={user} onAuthClick={handleAuthClick} />
        {renderPage()}
      </div>
      <div className="toast-wrap">
        {toasts.map((t) => (
          <Toast key={t.id} msg={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={setUser} showToast={showToast} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onSuccess={setUser} showToast={showToast} />}
    </>
  );
}
