import type { Metadata } from "next";
import { BrowseShell } from "@/components/games/browse-shell";
import { requireProfile } from "@/lib/auth/require-profile";
import { getFeedbackCounts } from "@/lib/queries/feedback-counts";

export const metadata: Metadata = { title: "Browse Games" };

export const dynamic = "force-dynamic";

export default async function BrowseGamesPage() {
  const { supabase, profile } = await requireProfile();

  const { data: games } = await supabase
    .from("games")
    .select("*, profiles(display_name, avatar_url, cohort)")
    .eq("visibility", "public")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const countMap = await getFeedbackCounts(supabase, (games ?? []).map((g) => g.id));

  return (
    <BrowseShell profile={profile} games={games ?? []} feedbackCounts={countMap} />
  );
}
