import { AppShell } from "@/components/layout/app-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, user, profile } = await requireProfile();

  const { data: myGames } = await supabase
    .from("games")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const gameIds = (myGames ?? []).map((g) => g.id);
  const countMap: Record<string, number> = {};
  if (gameIds.length > 0) {
    const { data: feedbackCounts } = await supabase
      .from("feedback_responses")
      .select("game_id")
      .in("game_id", gameIds);
    (feedbackCounts ?? []).forEach((f) => {
      countMap[f.game_id] = (countMap[f.game_id] || 0) + 1;
    });
  }

  const { data: myReviews } = await supabase
    .from("feedback_responses")
    .select("*, games(*)")
    .eq("reviewer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile} topnavTitle="DASHBOARD">
      <DashboardContent
        myGames={myGames ?? []}
        myReviews={myReviews ?? []}
        reviewPoints={profile.review_points ?? 0}
        feedbackCounts={countMap}
      />
    </AppShell>
  );
}
