import { DocSection, DocsShell, DocStep } from "../ui/Docs";
import WindowCard from "../ui/WindowCard";

const DocsResearchersPage = ({ setPage }: { setPage: (page: string) => void }) => (
  <DocsShell current="docs-researchers" setPage={setPage} title="For Researchers" subtitle="Get paid to do research." fileTag="/root/docs/researchers">
    <DocSection title="How Researchers Participate">
      <p style={{fontSize:15,lineHeight:1.7,color:"#1C1C27",marginBottom:16}}>Researchers submit papers, earn ARS scores, receive sponsor endorsements, and compete for bounties. Top researchers get placed in protocol roles via the Talent Marketplace.</p>
      <DocStep n={1} title="Submit a Paper" desc="Upload your research. It enters peer review immediately."/>
      <DocStep n={2} title="Earn ARS" desc="Citations, downloads, peer reviews, votes, and endorsements all contribute to your ARS score."/>
      <DocStep n={3} title="Apply for Bounties" desc="Compete for protocol-funded research challenges. Win by producing the best work."/>
      <DocStep n={4} title="Join a Cohort" desc="Top researchers join Builder Cohorts to turn their research into products."/>
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

export default DocsResearchersPage;