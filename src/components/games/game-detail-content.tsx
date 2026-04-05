"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast/context";
import { SimpleMarkdown } from "@/components/ui/simple-markdown";
import { createClient } from "@/lib/supabase/client";
import type { Game, Profile } from "@/lib/types/database";

type GameWithProfile = Game & {
  profiles: Pick<Profile, "display_name" | "avatar_url">;
};

export function GameDetailContent({
  game,
  feedbackCount,
  avgRating,
  isOwner,
  isAdmin = false,
  hasReviewed = false,
  collaborators = [],
}: {
  game: GameWithProfile;
  feedbackCount: number;
  avgRating: string;
  isOwner: boolean;
  isAdmin?: boolean;
  hasReviewed?: boolean;
  collaborators?: { id: string; display_name: string; avatar_url: string | null }[];
}) {
  const { t, locale } = useApp();
  const { addToast } = useToast();
  const router = useRouter();
  const stars = Math.round(parseFloat(avgRating));
  const [inviteOrigin, setInviteOrigin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disableRedirect, setDisableRedirect] = useState("");
  const [disableSubmitting, setDisableSubmitting] = useState(false);
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [liveSubmitting, setLiveSubmitting] = useState(false);
  const [confirmingAdminDelete, setConfirmingAdminDelete] = useState(false);
  const [adminDeleting, setAdminDeleting] = useState(false);

  const isPaused = game.status === "paused";
  const hideHowToPlayForVisitor = isPaused && !isOwner;

  useEffect(() => {
    setInviteOrigin(window.location.origin);
  }, []);

  const inviteUrl =
    inviteOrigin && game.invite_code
      ? `${inviteOrigin}/invite/${game.invite_code}`
      : "";

  async function copyInviteLink() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      addToast("Copied to clipboard", "success");
    } catch {
      /* ignore */
    }
  }

  async function copyGameId() {
    try {
      await navigator.clipboard.writeText(game.id);
      addToast("Copied to clipboard", "success");
    } catch {
      /* ignore */
    }
  }

  async function confirmDisable() {
    setDisableSubmitting(true);
    try {
      const supabase = createClient();
      const trimmed = disableRedirect.trim();
      const update: { status: "paused"; game_url?: string } = {
        status: "paused",
      };
      if (trimmed) update.game_url = trimmed;
      const { error } = await supabase
        .from("games")
        .update(update)
        .eq("id", game.id);
      if (error) return;
      setShowDisableForm(false);
      setDisableRedirect("");
      addToast("Build disabled", "success");
      router.refresh();
    } finally {
      setDisableSubmitting(false);
    }
  }

  async function goLive() {
    setLiveSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("games")
        .update({ is_live: true, live_session_url: liveUrl.trim() || null })
        .eq("id", game.id);
      if (error) return;
      setShowLiveForm(false);
      setLiveUrl("");
      addToast("Multiplayer session started", "success");
      router.refresh();
    } finally {
      setLiveSubmitting(false);
    }
  }

  async function endLive() {
    setLiveSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("games")
        .update({ is_live: false, live_session_url: null })
        .eq("id", game.id);
      if (error) return;
      addToast("Session ended", "success");
      router.refresh();
    } finally {
      setLiveSubmitting(false);
    }
  }

  async function adminDeleteGame() {
    setAdminDeleting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("games").delete().eq("id", game.id);
      if (error) {
        addToast("Failed to delete game", "error");
        return;
      }
      addToast("Game deleted", "success");
      router.push("/games");
    } finally {
      setAdminDeleting(false);
    }
  }

  async function reEnableBuild() {
    setDisableSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("games")
        .update({ status: "active" })
        .eq("id", game.id);
      if (error) return;
      addToast("Build re-enabled", "success");
      router.refresh();
    } finally {
      setDisableSubmitting(false);
    }
  }

  return (
    <div className="-m-8">
      {/* Cover Image */}
      <div className="w-full aspect-[21/9] bg-surface-lowest relative overflow-hidden">
        {game.cover_image_url ? (
          <img
            alt={game.title}
            className="w-full h-full object-cover grayscale opacity-60"
            src={game.cover_image_url}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-muted">
              sports_esports
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter uppercase mb-2">
            {game.title}
          </h2>
          <div className="flex gap-4 items-center">
            {game.is_live && (
              <span className="px-3 py-1 bg-success text-black font-mono text-[13px] font-bold tracking-widest uppercase animate-pulse">
                MULTIPLAYER
              </span>
            )}
            <span className="px-2 py-0.5 border border-white font-mono text-[13px] tracking-widest text-white uppercase">
              {game.game_type}
            </span>
            {(game.platforms ?? []).map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 border border-outline-variant font-mono text-[13px] tracking-widest text-secondary uppercase"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Metadata Bar */}
      <div className="w-full h-16 border-b border-outline-variant flex items-center px-8 gap-12 bg-surface">
        <div className="flex flex-col">
          <span className="font-mono text-[13px] text-muted uppercase tracking-widest mb-1">
            {t.gameDetail.author}
          </span>
          <span className="font-mono text-xs text-white uppercase font-bold">
            {game.profiles?.display_name ?? t.common.unknown}
          </span>
        </div>
        {collaborators.length > 0 && (
          <div className="flex flex-col">
            <span className="font-mono text-[13px] text-muted uppercase tracking-widest mb-1">
              Team
            </span>
            <div className="flex items-center gap-2">
              {collaborators.map((c) => (
                <span key={c.id} className="font-mono text-xs text-white uppercase font-bold">
                  {c.display_name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <span className="font-mono text-[13px] text-muted uppercase tracking-widest mb-1">
            {t.gameDetail.feedback}
          </span>
          <span className="font-mono text-xs text-white uppercase font-bold">
            {feedbackCount}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[13px] text-muted uppercase tracking-widest mb-1">
            {t.dashboard.date}
          </span>
          <span className="font-mono text-xs text-white uppercase font-bold">
            {new Date(game.created_at).toLocaleDateString(
              locale === "ja" ? "ja-JP" : "en-US",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-[65%_35%] gap-12 items-start">
        {/* Left Column */}
        <div className="space-y-12">
          {hideHowToPlayForVisitor && (
            <section className="border border-outline-variant bg-surface-lowest p-8">
              <p className="font-body text-secondary leading-relaxed text-lg mb-6">
                {t.gameDetail.buildDisabledMessage}
              </p>
              {game.game_url ? (
                <a
                  href={game.game_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-white border border-white px-4 py-3 hover:bg-white hover:text-black transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    open_in_new
                  </span>
                  {t.gameDetail.viewSuccessorBuild}
                </a>
              ) : null}
            </section>
          )}

          <section>
            <h3 className="font-mono text-[14px] tracking-[0.2em] text-outline-variant uppercase mb-6 flex items-center gap-4">
              <span className="w-8 h-px bg-outline-variant" />
              {t.gameDetail.projectDescription}
            </h3>
            <SimpleMarkdown
              content={game.description || t.gameDetail.noDescription}
            />
          </section>

          {(game.game_url || game.file_path) && !hideHowToPlayForVisitor && (
            <section>
              <h3 className="font-mono text-[14px] tracking-[0.2em] text-outline-variant uppercase mb-6 flex items-center gap-4">
                <span className="w-8 h-px bg-outline-variant" />
                {t.gameDetail.howToPlay}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.game_url && (
                  <a
                    href={game.game_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-6 bg-surface-lowest border border-outline-variant group hover:border-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-white mb-4 block">
                      open_in_new
                    </span>
                    <h4 className="font-mono text-xs font-bold text-white uppercase mb-2">
                      {t.gameDetail.playDownload}
                    </h4>
                    <p className="font-mono text-[14px] text-muted uppercase truncate">
                      {game.game_url}
                    </p>
                  </a>
                )}
                {game.file_path && (
                  <a
                    href={game.file_path}
                    className="p-6 bg-surface-lowest border border-outline-variant group hover:border-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-white mb-4 block">
                      download
                    </span>
                    <h4 className="font-mono text-xs font-bold text-white uppercase mb-2">
                      {t.gameDetail.downloadBuild}
                    </h4>
                    <p className="font-mono text-[14px] text-muted uppercase">
                      Direct Download
                    </p>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column — Sticky Card */}
        <aside className="sticky top-24 space-y-4">
          <div className="bg-surface-container border border-outline-variant p-8">
            {isOwner && (
              <div className="flex flex-col items-center mb-8">
                <span className="font-mono text-[14px] text-muted tracking-[0.3em] uppercase mb-2">
                  {t.gameDetail.systemRating}
                </span>
                <div className="font-mono text-7xl font-bold text-white tracking-tighter">
                  {avgRating}
                </div>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-primary"
                      style={{
                        fontVariationSettings: `'FILL' ${i <= stars ? 1 : 0}`,
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="font-mono text-[13px] text-muted uppercase mt-2 tracking-widest">
                  {locale === "ja"
                    ? `${feedbackCount}${t.gameDetail.samples}`
                    : `${t.gameDetail.basedOn} ${feedbackCount} ${t.gameDetail.samples}`}
                </span>
              </div>
            )}

            <div className={`${isOwner ? "mt-12" : ""} space-y-3`}>
              {isOwner ? (
                <>
                  <Link
                    href={`/games/${game.id}/results`}
                    className="w-full bg-white text-black py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-white border border-white transition-all block text-center"
                  >
                    {t.gameDetail.viewResults}
                  </Link>
                  <Link
                    href={`/games/${game.id}/edit`}
                    className="w-full border border-outline-variant py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-white hover:border-white transition-all block text-center"
                  >
                    {t.gameDetail.editBuild}
                  </Link>
                  {isPaused ? (
                    <button
                      type="button"
                      disabled={disableSubmitting}
                      onClick={reEnableBuild}
                      className="w-full border border-success/50 py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-success hover:bg-success/10 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {disableSubmitting ? "..." : "RE-ENABLE BUILD"}
                    </button>
                  ) : showDisableForm ? (
                      <div className="border border-outline-variant bg-surface-lowest p-4 space-y-3">
                        <label className="block">
                          <span className="font-mono text-[11px] text-muted uppercase tracking-widest block mb-2">
                            {t.gameDetail.redirectOptional}
                          </span>
                          <input
                            type="url"
                            value={disableRedirect}
                            onChange={(e) => setDisableRedirect(e.target.value)}
                            placeholder={t.gameDetail.redirectPlaceholder}
                            className="w-full bg-background border border-outline-variant px-3 py-2.5 font-mono text-[13px] text-white placeholder:text-muted focus:outline-none focus:border-white/40"
                          />
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            disabled={disableSubmitting}
                            onClick={confirmDisable}
                            className="flex-1 border border-error/70 bg-error-container/20 text-error py-3 font-mono text-[13px] font-bold tracking-[0.15em] uppercase hover:bg-error-container/35 transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            {t.gameDetail.confirmDisable}
                          </button>
                          <button
                            type="button"
                            disabled={disableSubmitting}
                            onClick={() => {
                              setShowDisableForm(false);
                              setDisableRedirect("");
                            }}
                            className="flex-1 border border-outline-variant py-3 font-mono text-[13px] font-bold tracking-[0.15em] uppercase text-white hover:border-white transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {t.newGame.cancel}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDisableForm(true)}
                        className="w-full border border-outline-variant py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-secondary hover:border-white hover:text-white transition-all cursor-pointer"
                      >
                        {t.gameDetail.disableBuild}
                      </button>
                    )}
                  {/* Live Session Controls */}
                  <div className="pt-6 border-t border-outline-variant mt-6">
                    {game.is_live ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span className="font-mono text-[14px] text-white font-bold tracking-widest">MULTIPLAYER SESSION</span>
                        </div>
                        {game.live_session_url && (
                          <p className="font-mono text-[13px] text-secondary break-all leading-relaxed">{game.live_session_url}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const url = `${inviteOrigin}/games/${game.id}`;
                            navigator.clipboard.writeText(url);
                            addToast("Session link copied", "success");
                          }}
                          className="w-full border border-outline-variant py-3 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-white hover:border-white transition-all cursor-pointer"
                        >
                          COPY SESSION LINK
                        </button>
                        <button
                          type="button"
                          disabled={liveSubmitting}
                          onClick={endLive}
                          className="w-full border border-error/50 py-3 font-mono text-[13px] font-bold tracking-[0.15em] uppercase text-error hover:bg-error/10 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          END SESSION
                        </button>
                      </div>
                    ) : showLiveForm ? (
                      <div className="space-y-3">
                        <label className="block">
                          <span className="font-mono text-[13px] text-muted uppercase tracking-widest block mb-2">
                            Session link (optional)
                          </span>
                          <input
                            type="url"
                            value={liveUrl}
                            onChange={(e) => setLiveUrl(e.target.value)}
                            placeholder="Discord, Steam lobby, or game server link..."
                            className="w-full bg-background border border-outline-variant px-3 py-2.5 font-mono text-[13px] text-white placeholder:text-muted focus:outline-none focus:border-white/40"
                          />
                        </label>
                        <button
                          type="button"
                          disabled={liveSubmitting}
                          onClick={goLive}
                          className="w-full bg-success text-black py-3 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:bg-success/80 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {liveSubmitting ? "..." : "START SESSION"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowLiveForm(false); setLiveUrl(""); }}
                          className="w-full border border-outline-variant py-2 font-mono text-[13px] tracking-[0.15em] uppercase text-muted hover:text-white transition-all cursor-pointer"
                        >
                          CANCEL
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowLiveForm(true)}
                        className="w-full border border-outline-variant py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-white hover:border-white transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span className="w-2 h-2 bg-success rounded-full" />
                        MULTIPLAYER SESSION
                      </button>
                    )}
                  </div>

                  <div className="pt-6 border-t border-outline-variant mt-6">
                    <p className="font-mono text-[13px] tracking-widest text-muted uppercase mb-3">
                      {t.gameDetail.inviteLink}
                    </p>
                    <p className="font-mono text-[12px] text-secondary break-all mb-3 leading-relaxed">
                      {inviteUrl || "—"}
                    </p>
                    <button
                      type="button"
                      onClick={copyInviteLink}
                      disabled={!inviteUrl}
                      className="w-full border border-outline-variant py-3 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-white hover:border-white transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {t.gameDetail.copy}
                    </button>
                  </div>
                  <div className="pt-4 border-t border-outline-variant mt-4">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] text-muted uppercase tracking-widest mb-1">
                          {t.gameDetail.gameIdLabel}
                        </p>
                        <p className="font-mono text-[13px] text-secondary truncate">
                          {game.id.slice(0, 8)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={copyGameId}
                        className="shrink-0 border border-outline-variant px-3 py-1.5 font-mono text-[11px] font-bold tracking-widest uppercase text-white hover:border-white transition-all cursor-pointer"
                      >
                        {t.gameDetail.copy}
                      </button>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="pt-4 border-t border-outline-variant mt-4">
                      {confirmingAdminDelete ? (
                        <div className="space-y-3">
                          <p className="font-mono text-[12px] text-error uppercase tracking-widest">
                            This will permanently delete this game and all its feedback. Are you sure?
                          </p>
                          <button
                            type="button"
                            disabled={adminDeleting}
                            onClick={adminDeleteGame}
                            className="w-full border border-error bg-error/20 text-error py-3 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:bg-error/30 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {adminDeleting ? "DELETING..." : "CONFIRM DELETE"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingAdminDelete(false)}
                            className="w-full border border-outline-variant py-2 font-mono text-[13px] tracking-[0.15em] uppercase text-muted hover:text-white transition-all cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingAdminDelete(true)}
                          className="w-full border border-error/40 py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-error/70 hover:border-error hover:text-error transition-all cursor-pointer"
                        >
                          DELETE BUILD (ADMIN)
                        </button>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isAdmin && (
                    <div className="pt-4 border-t border-outline-variant mt-4">
                      {confirmingAdminDelete ? (
                        <div className="space-y-3">
                          <p className="font-mono text-[12px] text-error uppercase tracking-widest">
                            This will permanently delete this game and all its feedback. Are you sure?
                          </p>
                          <button
                            type="button"
                            disabled={adminDeleting}
                            onClick={adminDeleteGame}
                            className="w-full border border-error bg-error/20 text-error py-3 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:bg-error/30 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            {adminDeleting ? "DELETING..." : "CONFIRM DELETE"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingAdminDelete(false)}
                            className="w-full border border-outline-variant py-2 font-mono text-[13px] tracking-[0.15em] uppercase text-muted hover:text-white transition-all cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmingAdminDelete(true)}
                          className="w-full border border-error/40 py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-error/70 hover:border-error hover:text-error transition-all cursor-pointer"
                        >
                          DELETE BUILD (ADMIN)
                        </button>
                      )}
                    </div>
                  )}
                  {game.is_live && (
                    <div className="border border-success/50 bg-success/10 p-4 mb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="font-mono text-[14px] text-white font-bold tracking-widest">MULTIPLAYER SESSION</span>
                      </div>
                      {game.live_session_url && (
                        <a
                          href={game.live_session_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-success text-black py-3 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:bg-success/80 transition-all block text-center mb-2"
                        >
                          JOIN SESSION
                        </a>
                      )}
                      <p className="font-mono text-[13px] text-muted">
                        {game.live_session_url ? game.live_session_url : "Session is active - contact the developer to join"}
                      </p>
                    </div>
                  )}
                  {!isPaused && (
                    hasReviewed ? (
                      <Link
                        href={`/games/${game.id}/feedback`}
                        className="w-full border border-outline-variant py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase text-white hover:border-white transition-all block text-center"
                      >
                        EDIT FEEDBACK
                      </Link>
                    ) : (
                      <Link
                        href={`/games/${game.id}/feedback`}
                        className="w-full bg-white text-black py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:bg-transparent hover:text-white border border-white transition-all block text-center"
                      >
                        {t.gameDetail.giveFeedback}
                      </Link>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
