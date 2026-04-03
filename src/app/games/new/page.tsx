import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { NewGameForm } from "@/components/games/new-game-form";
import { requireProfile } from "@/lib/auth/require-profile";

export const metadata: Metadata = { title: "New Build" };

export const dynamic = "force-dynamic";

export default async function NewGamePage() {
  const { profile } = await requireProfile();

  return (
    <AppShell profile={profile} topnavTitle="NEW BUILD">
      <NewGameForm />
    </AppShell>
  );
}
