import GlobalProvider from "@/components/GlobalProvider";
import QueryProvider from "@/providers/QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <GlobalProvider>{children}</GlobalProvider>
    </QueryProvider>
  );
}
