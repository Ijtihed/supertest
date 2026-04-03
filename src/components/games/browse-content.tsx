"use client";

import { useState } from "react";
import Link from "next/link";
import type { Game, Profile } from "@/lib/types/database";
import { useApp } from "@/lib/i18n/context";

type GameWithProfile = Game & { profiles: Pick<Profile, "display_name" | "avatar_url"> };

const PLATFORMS = ["ALL", "PC", "WEB", "MOBILE", "CONSOLE"];

export function BrowseContent({
  games,
  feedbackCounts,
}: {
  games: GameWithProfile[];
  feedbackCounts: Record<string, number>;
}) {
  const { t } = useApp();
  const [activePlatform, setActivePlatform] = useState("ALL");

  const filtered = games.filter((game) => {
    if (activePlatform === "ALL") return true;
    return (game.platforms ?? []).some((p) => p.toUpperCase().includes(activePlatform));
  });

  return (
    <>
      {/* Platform Filter */}
      <div className="flex items-center mb-8 pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3 flex-wrap">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              className={`px-3 py-1 font-mono text-[13px] tracking-widest uppercase transition-all cursor-pointer ${
                activePlatform === platform
                  ? "bg-white text-black"
                  : "border border-outline-variant text-secondary hover:border-white hover:text-white"
              }`}
            >
              {platform === "ALL" ? t.browse.allGenres : platform}
            </button>
          ))}
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="group border border-outline-variant bg-surface-lowest hover:border-white transition-all duration-300 block"
          >
            <div className="aspect-video overflow-hidden relative transition-all duration-500">
              {game.cover_image_url ? (
                <img
                  src={game.cover_image_url}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-lowest">
                  <span className="material-symbols-outlined text-4xl text-muted">
                    sports_esports
                  </span>
                </div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                {game.is_live && (
                  <span className="bg-success text-black px-2 py-0.5 font-mono text-[13px] font-bold tracking-wider animate-pulse">
                    MULTIPLAYER
                  </span>
                )}
                <span className="bg-black/80 px-2 py-0.5 border border-white/20 font-mono text-[13px] tracking-tighter text-white">
                  {game.game_type.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-4">
                <h3 className="font-headline font-bold text-lg leading-tight uppercase tracking-tight text-white">
                  {game.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4 mb-6">
                <div>
                  <p className="font-mono text-[13px] text-muted uppercase mb-1">
                    {t.browse.platform}
                  </p>
                  <p className="font-mono text-sm text-white">
                    {(game.platforms ?? []).join(", ") || t.common.na}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[13px] text-muted uppercase mb-1">
                    {t.gameDetail.feedback}
                  </p>
                  <p className="font-mono text-sm text-white">
                    {feedbackCounts[game.id] ?? 0}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/30">
                <div className="w-6 h-6 bg-surface-container border border-outline-variant overflow-hidden">
                  {game.profiles?.avatar_url ? (
                    <img
                      src={game.profiles.avatar_url}
                      alt=""
                      className="w-full h-full opacity-60"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-high" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-mono text-[13px] text-secondary uppercase">
                    {t.browse.dev}
                  </p>
                  <p className="font-mono text-[14px] text-white">
                    {game.profiles?.display_name ?? t.common.unknown}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <span className="material-symbols-outlined text-4xl text-muted mb-4">
              search_off
            </span>
            <p className="font-mono text-[14px] text-muted mb-4">
              {t.browse.noGamesMatchFilters ?? "No games match your filters"}
            </p>
            <button
              onClick={() => setActivePlatform("ALL")}
              className="border border-outline-variant px-4 py-2 font-mono text-[13px] text-muted hover:text-white hover:border-white transition-all cursor-pointer"
            >
              {t.browse.clearFilters ?? "Clear filters"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
