"use client";
import LabsPage from "@/components/page/labs";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { selectedLab, setSelectedLab } = useGlobal();
  return <LabsPage selectedLab={selectedLab} onLabSelect={setSelectedLab} />;
}
