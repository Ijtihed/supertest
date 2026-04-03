import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ProfilePageContent } from "@/components/profile/profile-page-content";
import { requireProfile } from "@/lib/auth/require-profile";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", id).maybeSingle();
  return { title: profile?.display_name ?? "Profile" };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile();

  const { data: target, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (profileError || !target) notFound();

  const { data: games } = await supabase
    .from("games")
    .select("*")
    .eq("owner_id", id)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  const { count: reviewsGiven } = await supabase
    .from("feedback_responses")
    .select("*", { count: "exact", head: true })
    .eq("reviewer_id", id);

  const gamesPublished = games?.length ?? 0;

  return (
    <AppShell profile={profile} topnavTitle={target.display_name.toUpperCase()}>
      <ProfilePageContent
        target={target}
        games={games ?? []}
        reviewsGiven={reviewsGiven ?? 0}
        gamesPublished={gamesPublished}
      />
    </AppShell>
  );
}
