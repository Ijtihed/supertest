"use client";

import Link from "next/link";
import { useApp } from "@/lib/i18n/context";
import type { Profile } from "@/lib/types/database";

export function LeaderboardContent({ rows }: { rows: Profile[] }) {
  const { t } = useApp();

  return (
    <div className="max-w-4xl">
      <div className="hidden sm:grid grid-cols-[48px_1fr_120px_140px] gap-4 px-4 py-3 border-b border-outline-variant font-mono text-[14px] text-muted uppercase tracking-widest">
        <span>{t.leaderboard.rank}</span>
        <span>{t.leaderboard.player}</span>
        <span className="text-right">{t.leaderboard.points}</span>
        <span className="text-right">{t.leaderboard.cohort}</span>
      </div>
      <ul className="divide-y divide-outline-variant border border-outline-variant sm:border-t-0">
        {rows.map((row, i) => {
          const rank = i + 1;
          const top3 = rank <= 3;
          const cohortLabel =
            row.cohort?.replace("_", " ").toUpperCase() ?? "—";

          return (
            <li key={row.id}>
              <Link
                href={`/profile/${row.id}`}
                className={`block px-4 py-4 sm:py-3 transition-colors hover:bg-surface-container/50 ${
                  top3 ? "text-white" : "text-muted"
                }`}
              >
                <div className="flex flex-col gap-2 sm:hidden font-mono text-[14px]">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 tabular-nums shrink-0 ${top3 ? "text-primary" : ""}`}
                    >
                      {rank}
                    </span>
                    <div className="w-10 h-10 shrink-0 border border-outline-variant bg-surface-lowest overflow-hidden">
                      {row.avatar_url ? (
                        <img
                          src={row.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-muted text-sm">
                            person
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate uppercase tracking-tight">
                        {row.display_name}
                      </p>
                      <p className="text-[13px] text-muted uppercase truncate">
                        {cohortLabel}
                      </p>
                    </div>
                    <span
                      className={`tabular-nums shrink-0 ${top3 ? "text-primary" : ""}`}
                    >
                      {row.review_points ?? 0}
                    </span>
                  </div>
                </div>
                <div
                  className={`hidden sm:grid grid-cols-[48px_1fr_120px_140px] gap-4 items-center font-mono text-[14px]`}
                >
                  <span
                    className={`tabular-nums ${top3 ? "text-primary" : ""}`}
                  >
                    {rank}
                  </span>
                  <span className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 border border-outline-variant bg-surface-lowest overflow-hidden">
                      {row.avatar_url ? (
                        <img
                          src={row.avatar_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-muted text-sm">
                            person
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="truncate uppercase tracking-tight">
                      {row.display_name}
                    </span>
                  </span>
                  <span
                    className={`text-right tabular-nums ${top3 ? "text-primary" : ""}`}
                  >
                    {row.review_points ?? 0}
                  </span>
                  <span className="text-right truncate uppercase">
                    {cohortLabel}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
