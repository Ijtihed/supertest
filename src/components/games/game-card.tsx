"use client";

import Link from "next/link";
import type { Game } from "@/lib/types/database";
import { useApp } from "@/lib/i18n/context";

export function GameCard({
  game,
  feedbackCount = 0,
}: {
  game: Game;
  feedbackCount?: number;
}) {
  const { t } = useApp();
  const title = game.title?.trim() || "Untitled";
  const genres = game.genres ?? [];
  const platforms = game.platforms ?? [];

  return (
    <Link
      href={`/games/${game.id}`}
      className="border border-surface-container bg-card overflow-hidden group hover:border-outline-variant transition-all block"
    >
      <div className="aspect-video w-full overflow-hidden bg-surface-lowest relative">
        {game.cover_image_url ? (
          <img
            src={game.cover_image_url}
            alt={title}
            className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-muted">
              sports_esports
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 border border-white/20">
          <span className="font-mono text-[13px] tracking-tighter text-white">
            {game.game_type.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-headline font-bold text-lg tracking-tight uppercase">
              {title}
            </h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-mono text-[13px] text-muted mb-1">
              {t.common.status}
            </span>
            <span
              className={`font-mono text-[13px] px-2 py-0.5 border ${
                game.status === "active"
                  ? "bg-success-dim text-success border-success-border"
                  : "bg-surface-container text-muted border-outline-variant"
              }`}
            >
              {game.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="border-t border-surface-container pt-4">
          <p className="font-mono text-[13px] text-muted uppercase mb-1">
            {t.gameDetail.feedback}
          </p>
          <p className="font-mono text-sm text-white">{feedbackCount}</p>
        </div>
      </div>
    </Link>
  );
}
