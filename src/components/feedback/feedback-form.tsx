"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast/context";
import type {
  Game,
  FeedbackQuestion,
  FeedbackResponse,
  PlayAgain,
} from "@/lib/types/database";

export function FeedbackForm({
  game,
  questions,
  existingFeedback,
}: {
  game: Game;
  questions: FeedbackQuestion[];
  existingFeedback?: FeedbackResponse;
}) {
  const isEditing = !!existingFeedback;
  const { t } = useApp();
  const { addToast } = useToast();
  const router = useRouter();
  const [overallRating, setOverallRating] = useState(existingFeedback?.overall_rating ?? 0);
  const [gameplayRating, setGameplayRating] = useState(existingFeedback?.gameplay_rating ?? 0);
  const [visualsRating, setVisualsRating] = useState(existingFeedback?.visuals_rating ?? 0);
  const [funFactorRating, setFunFactorRating] = useState(existingFeedback?.fun_factor_rating ?? 0);
  const [bugsEncountered, setBugsEncountered] = useState(existingFeedback?.bugs_encountered ?? "");
  const [wouldPlayAgain, setWouldPlayAgain] = useState<PlayAgain>(existingFeedback?.would_play_again ?? "maybe");
  const [videoLinks, setVideoLinks] = useState<string[]>(
    existingFeedback?.video_links?.length ? existingFeedback.video_links : [""]
  );
  const [freeText, setFreeText] = useState(existingFeedback?.free_text ?? "");
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>(
    (existingFeedback?.custom_answers as Record<string, string>) ?? {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function RatingSquares({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-6 h-6 border transition-colors cursor-pointer ${
              n <= value
                ? "border-white bg-white"
                : "border-outline-variant hover:border-white"
            }`}
          />
        ))}
      </div>
    );
  }

  async function handleSubmit() {
    if (overallRating === 0) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = {
        overall_rating: overallRating,
        gameplay_rating: gameplayRating || null,
        visuals_rating: visualsRating || null,
        fun_factor_rating: funFactorRating || null,
        bugs_encountered: bugsEncountered || null,
        would_play_again: wouldPlayAgain,
        free_text: freeText || null,
        video_links: videoLinks.filter((l) => l.trim()),
        custom_answers: customAnswers,
      };

      const { error } = isEditing
        ? await supabase
            .from("feedback_responses")
            .update(payload)
            .eq("id", existingFeedback!.id)
        : await supabase
            .from("feedback_responses")
            .insert({ ...payload, game_id: game.id, reviewer_id: user.id });

      if (error) {
        addToast("Failed to submit feedback", "error");
        return;
      }

      if (!isEditing) {
        const { data: p } = await supabase
          .from("profiles")
          .select("review_points")
          .eq("id", user.id)
          .single();
        if (p) {
          const { error: pointsError } = await supabase
            .from("profiles")
            .update({ review_points: (p.review_points ?? 0) + 10 })
            .eq("id", user.id);
          if (!pointsError) addToast("+10 points!", "success");
        }
      } else {
        addToast("Feedback updated", "success");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      addToast("Failed to submit feedback", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <span className="material-symbols-outlined text-6xl text-white">
          check_circle
        </span>
        <h2 className="font-headline font-bold text-3xl tracking-tighter text-white uppercase">
          {t.feedback.submitted}
        </h2>
        <p className="font-mono text-[14px] text-muted tracking-widest">
          {t.feedback.encryptedTransmission}
        </p>
        <button
          onClick={() => router.push(`/games/${game.id}`)}
          className="border border-outline-variant px-6 py-3 font-mono text-[14px] tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          {t.feedback.backToGame}
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[640px] mt-4">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 border border-white bg-surface-lowest p-1 overflow-hidden">
            {game.cover_image_url ? (
              <img
                src={game.cover_image_url}
                alt=""
                className="w-full h-full object-cover grayscale"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-muted">
                  sports_esports
                </span>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-headline font-bold text-3xl tracking-tighter text-white uppercase">
              {isEditing ? "EDIT FEEDBACK" : t.feedback.submitFeedback}
            </h2>
            <p className="font-mono text-[14px] tracking-widest uppercase text-muted">
              {game.title}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-16"
        >
          {/* Overall Rating */}
          <div className="pt-8 border-t border-outline-variant">
            <label className="font-mono text-[14px] tracking-widest uppercase text-muted block mb-6">
              {t.feedback.globalRating}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setOverallRating(n)}
                  className={`w-12 h-12 border transition-colors flex items-center justify-center font-mono text-lg cursor-pointer ${
                    overallRating === n
                      ? "border-white bg-white text-black"
                      : "border-outline-variant hover:border-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="pt-8 border-t border-outline-variant grid gap-8">
            <div className="flex justify-between items-center">
              <label className="font-mono text-[14px] tracking-widest uppercase text-muted">
                {t.feedback.gameplayMechanics}
              </label>
              <RatingSquares
                value={gameplayRating}
                onChange={setGameplayRating}
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="font-mono text-[14px] tracking-widest uppercase text-muted">
                {t.feedback.visualFidelity}
              </label>
              <RatingSquares
                value={visualsRating}
                onChange={setVisualsRating}
              />
            </div>
            <div className="flex justify-between items-center">
              <label className="font-mono text-[14px] tracking-widest uppercase text-muted">
                {t.feedback.funFactor}
              </label>
              <RatingSquares
                value={funFactorRating}
                onChange={setFunFactorRating}
              />
            </div>
          </div>

          {/* Bugs */}
          <div className="pt-8 border-t border-outline-variant">
            <label className="font-mono text-[14px] tracking-widest uppercase text-muted block mb-4">
              {t.feedback.bugReports}
            </label>
            <textarea
              value={bugsEncountered}
              onChange={(e) => setBugsEncountered(e.target.value)}
              placeholder={t.feedback.bugPlaceholder}
              rows={4}
              className="w-full bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3 resize-none"
            />
          </div>

          {/* Would Play Again */}
          <div className="pt-8 border-t border-outline-variant">
            <label className="font-mono text-[14px] tracking-widest uppercase text-muted block mb-6">
              {t.feedback.playAgain}
            </label>
            <div className="grid grid-cols-3 gap-0">
              {(["yes", "maybe", "no"] as const).map((option, i) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setWouldPlayAgain(option)}
                  className={`py-4 font-mono text-[14px] tracking-widest uppercase transition-all cursor-pointer ${
                    i === 0
                      ? "border border-outline-variant"
                      : "border-y border-r border-outline-variant"
                  } ${
                    wouldPlayAgain === option
                      ? "bg-white text-black"
                      : "hover:bg-white hover:text-black"
                  }`}
                >
                  {option === "yes"
                    ? t.feedback.yes
                    : option === "maybe"
                      ? t.feedback.maybe
                      : t.feedback.no}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Questions */}
          {questions.length > 0 && (
            <div className="pt-8 border-t border-outline-variant space-y-6">
              <label className="font-mono text-[14px] tracking-widest uppercase text-muted block">
                {t.feedback.devCustomFields}
              </label>
              {questions.map((q) => (
                <div key={q.id}>
                  <p className="font-mono text-[14px] text-white mb-3">
                    {q.question_text}
                  </p>
                  {q.question_type === "text" && (
                    <input
                      type="text"
                      value={customAnswers[q.id] ?? ""}
                      onChange={(e) =>
                        setCustomAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      placeholder={t.feedback.customAnswerPlaceholder}
                      className="w-full bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3"
                    />
                  )}
                  {q.question_type === "rating" && (
                    <RatingSquares
                      value={parseInt(customAnswers[q.id] ?? "0")}
                      onChange={(v) =>
                        setCustomAnswers((prev) => ({
                          ...prev,
                          [q.id]: String(v),
                        }))
                      }
                    />
                  )}
                  {q.question_type === "yes_no" && (
                    <div className="flex gap-0">
                      {(
                        [
                          { key: "yes", label: t.feedback.yes },
                          { key: "no", label: t.feedback.no },
                        ] as const
                      ).map((opt, i) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() =>
                            setCustomAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.key,
                            }))
                          }
                          className={`px-6 py-3 font-mono text-[14px] tracking-widest uppercase transition-all cursor-pointer ${
                            i === 0
                              ? "border border-outline-variant"
                              : "border-y border-r border-outline-variant"
                          } ${
                            customAnswers[q.id] === opt.key
                              ? "bg-white text-black"
                              : "hover:bg-white/10"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Video Links */}
          <div className="pt-8 border-t border-outline-variant">
            <label className="font-mono text-[14px] tracking-widest uppercase text-muted block mb-4">
              {t.feedback.videoLinks}
            </label>
            <div className="space-y-2">
              {videoLinks.map((link, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-surface-lowest border-b border-outline-variant px-3 py-3"
                >
                  <span className="material-symbols-outlined text-[18px] text-muted">
                    link
                  </span>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => {
                      const updated = [...videoLinks];
                      updated[i] = e.target.value;
                      setVideoLinks(updated);
                    }}
                    placeholder={t.feedback.videoPlaceholder}
                    className="bg-transparent border-none p-0 flex-grow font-mono text-sm text-white placeholder:text-muted/50 focus:ring-0"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVideoLinks((prev) => [...prev, ""])}
                className="font-mono text-[14px] text-muted hover:text-white transition-colors cursor-pointer"
              >
                {t.feedback.addLink}
              </button>
            </div>
          </div>

          {/* Free Text */}
          <div className="pt-8 border-t border-outline-variant">
            <label className="font-mono text-[14px] tracking-widest uppercase text-muted block mb-4">
              {t.feedback.anythingElse}
            </label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder={t.feedback.anythingPlaceholder}
              rows={3}
              className="w-full bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-12">
            <button
              type="submit"
              disabled={submitting || overallRating === 0}
              className="w-full bg-white text-black py-6 font-mono text-[18px] font-black tracking-[0.2em] uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? t.feedback.transmitting : t.feedback.submit}
            </button>
            <p className="mt-4 font-mono text-[13px] text-muted text-center tracking-widest">
              {t.feedback.encryptedTransmission}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
