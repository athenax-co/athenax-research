"use client";
import LabProfilePage from "@/components/page/labs-profile";
import { useGlobal } from "@/components/GlobalProvider";

export default function Page() {
  const { selectedLab } = useGlobal();
  return <LabProfilePage lab={selectedLab} />;
}
