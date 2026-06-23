import GlobalProvider from "@/components/GlobalProvider";
import QueryProvider from "@/providers/QueryProvider";
import PostHogProvider from "@/providers/PostHogProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <QueryProvider>
        <NuqsAdapter>
          <GlobalProvider>{children}</GlobalProvider>
        </NuqsAdapter>
      </QueryProvider>
    </PostHogProvider>
  );
}
