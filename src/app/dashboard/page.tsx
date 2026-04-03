import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { requireProfile } from "@/lib/auth/require-profile";
import { getFeedbackCounts } from "@/lib/queries/feedback-counts";

export const metadata: Metadata = { title: "Dashboard" };

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { supabase, user, profile } = await requireProfile();

  const { data: myGames } = await supabase
    .from("games")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const countMap = await getFeedbackCounts(supabase, (myGames ?? []).map((g) => g.id));

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
