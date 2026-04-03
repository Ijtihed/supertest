"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { BrowseContent } from "@/components/games/browse-content";
import type { Game, Profile } from "@/lib/types/database";

type GameWithProfile = Game & { profiles: Pick<Profile, "display_name" | "avatar_url" | "cohort"> };

export function BrowseShell({
  profile,
  games,
  feedbackCounts,
}: {
  profile: Profile;
  games: GameWithProfile[];
  feedbackCounts: Record<string, number>;
}) {
  const [search, setSearch] = useState("");

  return (
    <AppShell profile={profile} topnavTitle="BROWSE" showSearch searchValue={search} onSearchChange={setSearch}>
      <BrowseContent games={games} feedbackCounts={feedbackCounts} search={search} />
    </AppShell>
  );
}
