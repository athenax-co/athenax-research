import GlobalProvider from "@/components/GlobalProvider";
import QueryProvider from "@/providers/QueryProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <NuqsAdapter>
        <GlobalProvider>{children}</GlobalProvider>
      </NuqsAdapter>
    </QueryProvider>
  );
}
