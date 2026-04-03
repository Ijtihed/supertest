import { AppShell } from "@/components/layout/app-shell";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { supabase, profile } = await requireProfile();

  const { data: rows } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "approved")
    .order("review_points", { ascending: false })
    .limit(50);

  return (
    <AppShell profile={profile} topnavTitle="LEADERBOARD">
      <LeaderboardContent rows={rows ?? []} />
    </AppShell>
  );
}
