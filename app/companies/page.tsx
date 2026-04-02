import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import { IconBuilders, IconLabs, IconResearchers, IconSponsors, IconTalent, IconUniversities } from "@/components/Icons";

export default function Page() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-7 lg:px-10">
        <div className="mb-4.5 inline-block rounded-md border border-ink bg-cream px-2.75 py-1 font-['Space_Mono',monospace] text-[11px] tracking-[0.05em] text-ink">
          /root/companies
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-[-0.02em] text-ink md:text-5xl">Research Network</h1>
        <p className="text-[17px] text-muted">Universities, labs, and companies across frontier technology.</p>

        <hr className="my-7 border-0 border-t border-t-[#d8d4cc] md:mb-11" />

        <div className="mb-11 grid gap-5.5 sm:grid-cols-1 lg:grid-cols-2">
          <WindowCard label="DIR: /LABS" bodyClass="bg-[#eaf0f6] px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#dbeafe] text-[26px]">
              <IconLabs />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Research Labs</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              Partner labs producing credentialed open research. From MIT DCI to EF Research.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger" href="/labs">
              Open Directory -&gt;
            </Link>
          </WindowCard>

          <WindowCard label="DIR: /UNIVERSITIES" bodyClass="bg-[#f9f5dc] px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#fef3c7] text-[26px]">
              <IconUniversities />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Universities</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              Institutional partnerships with the world&apos;s leading research-focused universities.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger"
              href="/network/universities"
            >
              Open Directory -&gt;
            </Link>
          </WindowCard>

          <WindowCard label="DIR: /SPONSORS" bodyClass="bg-white px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#d4edda] text-[26px]">
              <IconSponsors />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Protocol Sponsors</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              AI companies, infrastructure providers, and venture investors sponsoring the research that shapes the global AI stack.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger" href="/sponsors">
              Open Directory -&gt;
            </Link>
          </WindowCard>

          <WindowCard label="DIR: /RESEARCHERS" bodyClass="bg-[#f9f5dc] px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#fef3c7] text-[26px]">
              <IconResearchers />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Researcher Directory</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              Browse ARS-scored researchers by topic and lab. Filter by cohort eligibility and hiring status.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger" href="/researchers">
              Browse Researchers -&gt;
            </Link>
          </WindowCard>

          <WindowCard label="DIR: /FOUNDERS" bodyClass="bg-white px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#f5dde0] text-[26px]">
              <IconBuilders />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Founders</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              ARS-scored founders who have launched research-backed products. Browse by sector, ARS score, and funding stage.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger" href="/founders">
              Browse Founders -&gt;
            </Link>
          </WindowCard>

          <WindowCard label="DIR: /INVESTORS" bodyClass="bg-white px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#d4edda] text-[26px]">
              <IconSponsors />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Investors</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              Venture investors and funds using Terminal to discover pre-formation founders early.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger" href="/investors">
              Browse Investors -&gt;
            </Link>
          </WindowCard>

          <WindowCard label="DIR: /STARTUPS" bodyClass="bg-white px-[30px] py-7">
            <div className="mb-4.5 flex h-15 w-15 items-center justify-center rounded-xl border-2 border-ink bg-[#f5dde0] text-[26px]">
              <IconTalent />
            </div>
            <h3 className="mb-2.5 text-[22px] font-bold tracking-[-0.02em] text-ink">Startup Marketplace</h3>
            <p className="mb-5 text-[15px] leading-[1.6] text-muted">
              Companies, products, protocols, and infrastructure. Each listing shows research lineage, launch history, and open roles.
            </p>
            <hr className="my-3.5 border-0 border-t border-t-[#d8d4cc]" />
            <Link className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors hover:text-danger" href="/startups">
              Browse Companies -&gt;
            </Link>
          </WindowCard>
        </div>
      </div>
    </div>
  );
}
