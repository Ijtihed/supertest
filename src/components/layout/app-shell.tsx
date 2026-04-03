import { Sidebar } from "./sidebar";
import { Topnav } from "./topnav";
import { Footer } from "./footer";
import type { Profile } from "@/lib/types/database";

export function AppShell({
  children,
  profile,
  topnavTitle,
  showSearch = false,
}: {
  children: React.ReactNode;
  profile: Profile | null;
  topnavTitle?: string;
  showSearch?: boolean;
}) {
  return (
    <>
      <Sidebar profile={profile} />
      <Topnav title={topnavTitle} showSearch={showSearch} />
      <main className="ml-[220px] pt-14 min-h-screen flex flex-col">
        <div className="flex-1 p-8">{children}</div>
        <Footer />
      </main>
    </>
  );
}
