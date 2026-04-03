import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { EditGameForm } from "@/components/games/edit-game-form";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, user, profile } = await requireProfile();

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (!game) notFound();
  if (game.owner_id !== user.id) {
    redirect(`/games/${id}`);
  }

  const { data: feedbackQuestions } = await supabase
    .from("feedback_questions")
    .select("*")
    .eq("game_id", id)
    .order("sort_order");

  return (
    <AppShell profile={profile} topnavTitle="EDIT BUILD">
      <EditGameForm
        game={game}
        existingQuestions={feedbackQuestions ?? []}
      />
    </AppShell>
  );
}
