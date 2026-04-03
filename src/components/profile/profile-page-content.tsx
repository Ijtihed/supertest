"use client";

import { GameCard } from "@/components/games/game-card";
import { useApp } from "@/lib/i18n/context";
import type { Game, Profile } from "@/lib/types/database";

export function ProfilePageContent({
  target,
  games,
  reviewsGiven,
  gamesPublished,
}: {
  target: Profile;
  games: Game[];
  reviewsGiven: number;
  gamesPublished: number;
}) {
  const { t, locale } = useApp();

  const memberSince = new Date(target.created_at).toLocaleDateString(
    locale === "ja" ? "ja-JP" : "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const cohortLabel =
    target.cohort?.replace("_", " ").toUpperCase() ?? "—";

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-outline-variant">
        <div className="w-28 h-28 shrink-0 border border-outline-variant bg-surface-lowest overflow-hidden">
          {target.avatar_url ? (
            <img
              src={target.avatar_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-muted">
                person
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-headline font-bold text-3xl tracking-tighter text-white uppercase mb-2">
            {target.display_name}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[14px] text-muted">
            <span>
              <span className="text-[14px] uppercase tracking-widest">
                {t.settings.cohort}:{" "}
              </span>
              <span className="text-white">{cohortLabel}</span>
            </span>
            <span>
              <span className="text-[14px] uppercase tracking-widest">
                {t.profile.memberSince}:{" "}
              </span>
              <span className="text-white">{memberSince}</span>
            </span>
          </div>
          <p className="mt-4 font-mono text-lg text-primary tracking-tight">
            {target.review_points ?? 0}{" "}
            <span className="text-[14px] text-muted uppercase tracking-widest">
              {t.profile.points}
            </span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-b border-outline-variant">
        <div className="border border-outline-variant bg-surface-lowest/50 p-4">
          <p className="font-mono text-[14px] text-muted uppercase tracking-widest mb-2">
            {t.profile.gamesPublished}
          </p>
          <p className="font-mono text-2xl text-white tabular-nums">
            {gamesPublished}
          </p>
        </div>
        <div className="border border-outline-variant bg-surface-lowest/50 p-4">
          <p className="font-mono text-[14px] text-muted uppercase tracking-widest mb-2">
            {t.profile.reviewsGiven}
          </p>
          <p className="font-mono text-2xl text-white tabular-nums">
            {reviewsGiven}
          </p>
        </div>
        <div className="border border-outline-variant bg-surface-lowest/50 p-4">
          <p className="font-mono text-[14px] text-muted uppercase tracking-widest mb-2">
            {t.profile.points}
          </p>
          <p className="font-mono text-2xl text-white tabular-nums">
            {target.review_points ?? 0}
          </p>
        </div>
      </div>

      <div className="pt-8">
        <h2 className="font-mono text-[14px] tracking-widest uppercase text-muted mb-6">
          {t.profile.gamesPublished}
        </h2>
        {games.length === 0 ? (
          <p className="font-mono text-[14px] text-muted border border-outline-variant border-dashed p-8 text-center">
            —
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
