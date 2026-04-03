"use client";

import { useState } from "react";
import Link from "next/link";
import type { Game, FeedbackResponse } from "@/lib/types/database";
import { useApp } from "@/lib/i18n/context";
import { GameCard } from "@/components/games/game-card";

type ReviewWithGame = FeedbackResponse & { games: Game };

export function DashboardContent({
  myGames,
  myReviews,
  reviewPoints,
  feedbackCounts,
}: {
  myGames: Game[];
  myReviews: ReviewWithGame[];
  reviewPoints: number;
  feedbackCounts: Record<string, number>;
}) {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<"games" | "reviews">("games");
  const [gameStatusFilter, setGameStatusFilter] = useState<"ALL" | "ACTIVE">(
    "ALL",
  );

  const displayedGames =
    gameStatusFilter === "ACTIVE"
      ? myGames.filter((g) => g.status === "active")
      : myGames;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline font-black text-5xl tracking-tighter text-white uppercase">
            {t.dashboard.title}
          </h2>
          <p className="font-mono text-[14px] text-muted mt-2 tracking-widest flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              {t.dashboard.systemStatus}:{" "}
              <span className="text-white">{t.dashboard.operational}</span>{" / "}{myGames.filter((g) => g.status === "active").length} {t.dashboard.activeBuilds}
            </span>
            <span className="font-mono text-white">POINTS: {reviewPoints}</span>
          </p>
        </div>
        <Link
          href="/games/new"
          className="border border-outline-variant bg-transparent text-white font-mono text-[14px] tracking-widest px-6 py-3 hover:bg-white hover:text-black transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t.nav.newGame}
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-8 border-b border-surface-container">
        {(["games", "reviews"] as const).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 border-b-2 font-mono text-[14px] tracking-widest uppercase transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-white text-white"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            {tab === "games" ? t.dashboard.myGames : t.dashboard.myReviews}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "games" && (
        <>
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setGameStatusFilter("ALL")}
              className={`px-3 py-1 font-mono text-[13px] tracking-widest uppercase transition-all cursor-pointer ${
                gameStatusFilter === "ALL"
                  ? "bg-white text-black"
                  : "border border-outline-variant text-secondary hover:border-white hover:text-white"
              }`}
            >
              ALL
            </button>
            <button
              type="button"
              onClick={() => setGameStatusFilter("ACTIVE")}
              className={`px-3 py-1 font-mono text-[13px] tracking-widest uppercase transition-all cursor-pointer ${
                gameStatusFilter === "ACTIVE"
                  ? "bg-white text-black"
                  : "border border-outline-variant text-secondary hover:border-white hover:text-white"
              }`}
            >
              ACTIVE
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                feedbackCount={feedbackCounts[game.id] || 0}
              />
            ))}
            {myGames.length === 0 && (
              <Link
                href="/games/new"
                className="border border-outline-variant border-dashed bg-transparent flex flex-col items-center justify-center p-12 hover:bg-white/5 transition-colors cursor-pointer group col-span-full max-w-sm"
              >
                <span className="material-symbols-outlined text-4xl text-muted group-hover:text-white transition-colors mb-4">
                  add_circle
                </span>
                <p className="font-mono text-[14px] tracking-widest uppercase text-muted group-hover:text-white transition-colors">
                  {t.dashboard.submitNewBuild}
                </p>
              </Link>
            )}
          </div>
        </>
      )}

      {activeTab === "reviews" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myReviews.map((review) => (
            <Link
              key={review.id}
              href={`/games/${review.game_id}`}
              className="border border-surface-container bg-card p-4 hover:border-outline-variant transition-all"
            >
              <h3 className="text-white font-headline font-bold text-lg tracking-tight">
                {review.games?.title ?? t.common.unknown}
              </h3>
              <div className="flex gap-4 mt-3 border-t border-surface-container pt-3">
                <div>
                  <p className="font-mono text-[13px] text-muted uppercase mb-1">
                    {t.dashboard.rating}
                  </p>
                  <p className="font-mono text-lg text-white font-bold">
                    {review.overall_rating}/5
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[13px] text-muted uppercase mb-1">
                    {t.dashboard.date}
                  </p>
                  <p className="font-mono text-sm text-white">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {myReviews.length === 0 && (
            <Link
              href="/games"
              className="border border-outline-variant border-dashed bg-transparent flex flex-col items-center justify-center p-12 hover:bg-white/5 transition-colors cursor-pointer group col-span-full max-w-sm"
            >
              <span className="material-symbols-outlined text-4xl text-muted group-hover:text-white transition-colors mb-4">
                search
              </span>
              <p className="font-mono text-[14px] tracking-widest uppercase text-muted group-hover:text-white transition-colors">
                {t.dashboard.browseGamesToTest}
              </p>
            </Link>
          )}
        </div>
      )}
    </>
  );
}
