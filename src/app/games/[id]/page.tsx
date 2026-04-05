import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GameDetailContent } from "@/components/games/game-detail-content";
import { requireProfile } from "@/lib/auth/require-profile";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: game } = await supabase.from("games").select("title").eq("id", id).single();
  return { title: game?.title ?? "Game" };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();

  const [{ data: game }, { data: feedbackResponses }, { data: existingReview }] =
    await Promise.all([
      supabase
        .from("games")
        .select("*, profiles(display_name, avatar_url)")
        .eq("id", id)
        .single(),
      supabase
        .from("feedback_responses")
        .select("overall_rating")
        .eq("game_id", id),
      supabase
        .from("feedback_responses")
        .select("id")
        .eq("game_id", id)
        .eq("reviewer_id", user.id)
        .maybeSingle(),
    ]);

  if (!game) notFound();

  const feedbackCount = feedbackResponses?.length ?? 0;
  const avgRating =
    feedbackCount > 0
      ? (
          feedbackResponses!.reduce((a, b) => a + b.overall_rating, 0) /
          feedbackCount
        ).toFixed(1)
      : "0.0";
  const isOwner = user.id === game.owner_id;
  const isAdmin = profile.is_admin;
  const hasReviewed = !!existingReview;

  let collaborators: { id: string; display_name: string; avatar_url: string | null }[] = [];
  if (game.collaborator_ids?.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", game.collaborator_ids);
    collaborators = data ?? [];
  }

  return (
    <AppShell profile={profile}>
      <GameDetailContent
        game={game}
        feedbackCount={feedbackCount}
        avgRating={avgRating}
        isOwner={isOwner}
        isAdmin={isAdmin}
        hasReviewed={hasReviewed}
        collaborators={collaborators}
      />
    </AppShell>
  );
}
