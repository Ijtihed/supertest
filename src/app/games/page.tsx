import { BrowseShell } from "@/components/games/browse-shell";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function BrowseGamesPage() {
  const { supabase, profile } = await requireProfile();

  const { data: games } = await supabase
    .from("games")
    .select("*, profiles(display_name, avatar_url, cohort)")
    .eq("visibility", "public")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const gameIds = (games ?? []).map((g) => g.id);
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

  return (
    <BrowseShell profile={profile} games={games ?? []} feedbackCounts={countMap} />
  );
}
