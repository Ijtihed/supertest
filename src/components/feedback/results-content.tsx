"use client";

import { useState } from "react";
import { useApp } from "@/lib/i18n/context";
import { relativeTime } from "@/lib/utils/relative-time";
import type {
  Game,
  FeedbackResponse,
  FeedbackQuestion,
  Profile,
} from "@/lib/types/database";

type ResponseWithProfile = FeedbackResponse & {
  profiles: Pick<Profile, "display_name" | "avatar_url">;
};

export function ResultsContent({
  game,
  responses,
  questions,
}: {
  game: Game;
  responses: ResponseWithProfile[];
  questions: FeedbackQuestion[];
}) {
  const { t, locale } = useApp();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const count = responses.length;
  const avgRating =
    count > 0
      ? (responses.reduce((a, b) => a + b.overall_rating, 0) / count).toFixed(1)
      : "0.0";
  const funResponses = responses.filter((r) => r.fun_factor_rating);
  const avgFun =
    funResponses.length > 0
      ? (
          funResponses.reduce((a, b) => a + (b.fun_factor_rating ?? 0), 0) /
          funResponses.length
        ).toFixed(1)
      : "0.0";
  const playAgainPct =
    count > 0
      ? Math.round(
          (responses.filter((r) => r.would_play_again === "yes").length /
            count) *
            100
        )
      : 0;

  function exportCsv() {
    const headers = [
      "Date",
      "Reviewer",
      "Overall Rating",
      "Gameplay",
      "Visuals",
      "Fun Factor",
      "Would Play Again",
      "Bugs",
      "Free Text",
      "Video Links",
    ];
    const escape = (val: string) => {
      if (/[",\n\r]/.test(val)) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    const rows = responses.map((r) => {
      const cells = [
        new Date(r.created_at).toISOString(),
        r.profiles?.display_name ?? "ANONYMOUS",
        String(r.overall_rating),
        r.gameplay_rating != null ? String(r.gameplay_rating) : "",
        r.visuals_rating != null ? String(r.visuals_rating) : "",
        r.fun_factor_rating != null ? String(r.fun_factor_rating) : "",
        r.would_play_again,
        r.bugs_encountered ?? "",
        r.free_text ?? "",
        (r.video_links ?? []).join(" "),
      ];
      return cells.map(escape).join(",");
    });
    const csv = [headers.map(escape).join(","), ...rows].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeTitle =
      game.title.replace(/[/\\?%*:|"<>]/g, "-").trim() || "export";
    a.download = `feedback-${safeTitle}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function runAiSummary() {
    setAiLoading(true);
    try {
      const { generateSummary } = await import("@/lib/utils/summarize");
      const summary = generateSummary(responses, locale);
      setAiSummary(summary);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="-m-8">
      {/* Page Header */}
      <div className="px-8 py-10 border-b border-surface-container flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-white uppercase">
            {t.results.results} &middot;{" "}
            <span className="text-muted">{game.title}</span>
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="font-mono text-[14px] tracking-widest text-muted uppercase">
              SESSION ID: {game.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={responses.length === 0}
          className="shrink-0 border border-outline-variant bg-transparent font-mono text-[13px] tracking-widest uppercase text-white px-4 py-2 hover:border-white hover:text-white transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          EXPORT CSV
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 w-full border-b border-surface-container">
        {[
          { label: t.results.responses, value: String(count) },
          { label: t.results.avgRating, value: avgRating },
          { label: t.results.avgFun, value: avgFun },
          { label: t.results.playAgainPct, value: `${playAgainPct}%` },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`px-8 py-10 ${i < 3 ? "border-r border-surface-container" : ""}`}
          >
            <p className="font-mono text-[14px] tracking-widest text-muted uppercase mb-2">
              {stat.label}
            </p>
            <p className="font-mono text-5xl font-light text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* AI Summary */}
      <section className="bg-card px-8 py-12 flex flex-col md:flex-row gap-12 border-b border-surface-container">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={runAiSummary}
              disabled={aiLoading || count === 0}
              className="border border-outline-variant px-4 py-1 font-mono text-[14px] tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 cursor-pointer"
            >
              {aiLoading ? t.results.processing : t.results.runSummary}
            </button>
            <span className="font-mono text-[14px] tracking-widest text-muted uppercase">
              {t.results.aiEngine}
            </span>
          </div>
          {aiSummary ? (
            <>
              <p className="font-body text-xl text-white leading-relaxed max-w-3xl whitespace-pre-wrap">
                {aiSummary}
              </p>
              <p className="font-mono text-[13px] text-muted uppercase mt-8 tracking-widest">
                {t.results.generatedLocally}
              </p>
            </>
          ) : (
            <p className="font-body text-secondary text-lg">
              {t.results.aiPrompt}
            </p>
          )}
        </div>
      </section>

      {/* Custom Questions Results */}
      {questions.length > 0 && (
        <section className="px-8 py-12 border-b border-surface-container">
          <h3 className="font-mono text-[15px] tracking-[0.2em] text-muted uppercase mb-8">
            {t.results.survey}
          </h3>
          <div className="space-y-10">
            {questions.map((q) => {
              const answers = responses
                .map((r) => {
                  const val = (r.custom_answers as Record<string, string>)?.[
                    q.id
                  ];
                  return val;
                })
                .filter(Boolean);

              if (
                q.question_type === "yes_no" ||
                q.question_type === "multiple_choice"
              ) {
                const counts: Record<string, number> = {};
                answers.forEach((a) => {
                  counts[a] = (counts[a] ?? 0) + 1;
                });
                const total = answers.length || 1;

                return (
                  <div key={q.id} className="max-w-4xl">
                    <p className="font-mono text-[14px] text-white uppercase mb-4 tracking-wider">
                      {q.question_text}
                    </p>
                    <div className="space-y-3">
                      {Object.entries(counts).map(([label, c]) => (
                        <div key={label} className="flex items-center gap-4">
                          <span className="font-mono text-[14px] text-muted w-24 uppercase">
                            {label}
                          </span>
                          <div className="flex-1 bg-black h-4 overflow-hidden border border-surface-container">
                            <div
                              className="bg-white h-full"
                              style={{
                                width: `${Math.round((c / total) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="font-mono text-[14px] text-white">
                            {Math.round((c / total) * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={q.id} className="max-w-4xl">
                  <p className="font-mono text-[14px] text-white uppercase mb-4 tracking-wider">
                    {q.question_text}
                  </p>
                  <div className="space-y-2">
                    {answers.map((a, i) => (
                      <p
                        key={i}
                        className="font-body text-sm text-on-surface pl-4 border-l border-outline-variant"
                      >
                        {a}
                      </p>
                    ))}
                    {answers.length === 0 && (
                      <p className="font-mono text-[14px] text-muted">
                        {t.results.noResponses}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Individual Responses */}
      <section className="px-8 py-12">
        <h3 className="font-mono text-[15px] tracking-[0.2em] text-muted uppercase mb-8">
          {t.results.verbatimLogs}
        </h3>
        <div className="flex flex-col">
          {responses.map((r, i) => (
            <div
              key={r.id}
              className="flex items-start py-6 border-b border-surface-container hover:bg-white/5 transition-colors px-4 -mx-4 gap-4"
            >
              <div className="w-12 font-mono text-[14px] text-muted shrink-0">
                {String(i + 1).padStart(3, "0")}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[14px] text-white">
                    {r.profiles?.display_name ?? "ANONYMOUS"}
                  </span>
                  <span className="font-mono text-[13px] text-muted">
                    {relativeTime(r.created_at, locale)}
                  </span>
                  <span className="font-mono text-[13px] text-muted">
                    RATING: {r.overall_rating}/5
                  </span>
                </div>
                {r.bugs_encountered && (
                  <p className="font-body text-sm text-on-surface">
                    &quot;{r.bugs_encountered}&quot;
                  </p>
                )}
                {r.free_text && (
                  <p className="font-body text-sm text-on-surface">
                    &quot;{r.free_text}&quot;
                  </p>
                )}
                {r.video_links.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {r.video_links.map((link, j) => (
                      <a
                        key={j}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[13px] text-muted hover:text-white underline underline-offset-2"
                      >
                        VIDEO_{j + 1}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="w-32 text-right shrink-0">
                <span
                  className={`font-mono text-[14px] uppercase ${
                    r.would_play_again === "yes"
                      ? "text-white"
                      : r.would_play_again === "no"
                        ? "text-error"
                        : "text-muted"
                  }`}
                >
                  {r.would_play_again === "yes"
                    ? "STABLE"
                    : r.would_play_again === "no"
                      ? "FIX_REQUIRED"
                      : "REVIEW"}
                </span>
              </div>
            </div>
          ))}
          {responses.length === 0 && (
            <p className="font-mono text-[14px] text-muted text-center py-12">
              {t.results.noFeedback}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
