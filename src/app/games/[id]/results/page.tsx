import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ResultsContent } from "@/components/feedback/results-content";
import { requireProfile } from "@/lib/auth/require-profile";

export const metadata: Metadata = { title: "Results" };

export const dynamic = "force-dynamic";

export default async function ResultsPage({
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
  if (game.owner_id !== user.id) redirect(`/games/${id}`);

  const { data: responses } = await supabase
    .from("feedback_responses")
    .select("*, profiles(display_name, avatar_url)")
    .eq("game_id", id)
    .order("created_at", { ascending: false });

  const { data: questions } = await supabase
    .from("feedback_questions")
    .select("*")
    .eq("game_id", id)
    .order("sort_order");

  return (
    <AppShell profile={profile} topnavTitle="RESULTS">
      <ResultsContent
        game={game}
        responses={responses ?? []}
        questions={questions ?? []}
      />
    </AppShell>
  );
}
