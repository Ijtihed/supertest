import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GameDetailContent } from "@/components/games/game-detail-content";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();

  const { data: game } = await supabase
    .from("games")
    .select("*, profiles(display_name, avatar_url)")
    .eq("id", id)
    .single();

  if (!game) notFound();

  const { data: feedbackResponses } = await supabase
    .from("feedback_responses")
    .select("*")
    .eq("game_id", id);

  const feedbackCount = feedbackResponses?.length ?? 0;
  const avgRating =
    feedbackCount > 0
      ? (
          feedbackResponses!.reduce((a, b) => a + b.overall_rating, 0) /
          feedbackCount
        ).toFixed(1)
      : "0.0";
  const isOwner = user.id === game.owner_id;

  return (
    <AppShell profile={profile}>
      <GameDetailContent
        game={game}
        feedbackCount={feedbackCount}
        avgRating={avgRating}
        isOwner={isOwner}
      />
    </AppShell>
  );
}
