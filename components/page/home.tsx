import { Suspense } from "react";
import { HomeArchiveSection, HomeArchiveSectionLoading } from "./home-archive-section";
import HomeClientSections from "./home-client-sections";

const HomePage = () => {
  return (
    <div>
      <div className="page-wrap section">
        <HomeClientSections />
        {/* <Suspense fallback={<HomeArchiveSectionLoading />}>
          <HomeArchiveSection />
        </Suspense> */}
      </div>
    </div>
  );
};

export default HomePage;
