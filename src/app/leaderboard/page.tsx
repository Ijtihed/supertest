import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { LeaderboardContent } from "@/components/leaderboard/leaderboard-content";
import { requireProfile } from "@/lib/auth/require-profile";

export const metadata: Metadata = { title: "Leaderboard" };

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { supabase, profile } = await requireProfile();

  const { data: rows } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "approved")
    .order("review_points", { ascending: false })
    .limit(50);

  // Fetch game upload counts for tiebreaker
  const profileIds = (rows ?? []).map((r) => r.id);
  const gameCountMap: Record<string, number> = {};
  if (profileIds.length > 0) {
    const { data: gameCounts } = await supabase
      .from("games")
      .select("owner_id")
      .in("owner_id", profileIds);
    (gameCounts ?? []).forEach((g) => {
      gameCountMap[g.owner_id] = (gameCountMap[g.owner_id] || 0) + 1;
    });
  }

  // Sort: review_points desc, tiebreak by games uploaded desc
  const sorted = [...(rows ?? [])].sort((a, b) => {
    const pointsDiff = (b.review_points ?? 0) - (a.review_points ?? 0);
    if (pointsDiff !== 0) return pointsDiff;
    return (gameCountMap[b.id] ?? 0) - (gameCountMap[a.id] ?? 0);
  });

  return (
    <AppShell profile={profile} topnavTitle="LEADERBOARD">
      <LeaderboardContent rows={sorted} />
    </AppShell>
  );
}
