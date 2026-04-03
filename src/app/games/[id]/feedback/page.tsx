import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { requireProfile } from "@/lib/auth/require-profile";

export const dynamic = "force-dynamic";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile, user } = await requireProfile();

  const { data: game } = await supabase
    .from("games")
    .select("*")
    .eq("id", id)
    .single();

  if (!game) notFound();
  if (game.owner_id === user.id) redirect(`/games/${id}`);
  if (game.status === "paused") redirect(`/games/${id}`);

  const { data: existing } = await supabase
    .from("feedback_responses")
    .select("*")
    .eq("game_id", id)
    .eq("reviewer_id", user.id)
    .maybeSingle();

  const { data: questions } = await supabase
    .from("feedback_questions")
    .select("*")
    .eq("game_id", id)
    .order("sort_order");

  return (
    <AppShell profile={profile} topnavTitle="FEEDBACK">
      <FeedbackForm
        game={game}
        questions={questions ?? []}
        existingFeedback={existing ?? undefined}
      />
    </AppShell>
  );
}
