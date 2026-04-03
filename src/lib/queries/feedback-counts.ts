import type { SupabaseClient } from "@supabase/supabase-js";

export async function getFeedbackCounts(
  supabase: SupabaseClient,
  gameIds: string[],
): Promise<Record<string, number>> {
  const countMap: Record<string, number> = {};
  if (gameIds.length === 0) return countMap;

  const { data } = await supabase
    .from("feedback_responses")
    .select("game_id")
    .in("game_id", gameIds);

  (data ?? []).forEach((f) => {
    countMap[f.game_id] = (countMap[f.game_id] || 0) + 1;
  });

  return countMap;
}
