"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/lib/toast/context";
import type { GameType, Visibility, QuestionType } from "@/lib/types/database";

interface CustomQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
}

const GENRE_OPTIONS = [
  "Action", "Adventure", "RPG", "Strategy", "Puzzle",
  "Horror", "Survival", "Sandbox", "Platformer", "Simulation",
  "Racing", "Fighting", "Shooter", "Stealth", "Roguelike",
  "Metroidvania", "Visual Novel", "Rhythm", "Tower Defense",
  "Card Game", "Sports", "Casual", "Narrative", "Co-op",
  "Battle Royale", "Open World", "Souls-like", "Idle/Clicker",
];
const PLATFORM_OPTIONS = ["Windows", "Mac", "Linux", "Web", "Mobile", "Console"];

const PRESET_QUESTIONS_EN: CustomQuestion[] = [
  { id: crypto.randomUUID(), text: "How intuitive were the controls?", type: "rating" },
  { id: crypto.randomUUID(), text: "Did the tutorial explain things clearly?", type: "yes_no" },
  { id: crypto.randomUUID(), text: "What was the most confusing part of the game?", type: "text" },
  { id: crypto.randomUUID(), text: "How would you rate the difficulty curve?", type: "rating" },
  { id: crypto.randomUUID(), text: "Did you experience any crashes or freezes?", type: "yes_no" },
  { id: crypto.randomUUID(), text: "Were there any moments where you felt lost or stuck?", type: "text" },
  { id: crypto.randomUUID(), text: "How polished did the visuals feel?", type: "rating" },
  { id: crypto.randomUUID(), text: "Was the audio/music appropriate for the gameplay?", type: "yes_no" },
  { id: crypto.randomUUID(), text: "How responsive did the game feel? (input lag, frame rate)", type: "rating" },
  { id: crypto.randomUUID(), text: "Did the UI/HUD provide enough information?", type: "yes_no" },
  { id: crypto.randomUUID(), text: "What feature or mechanic would you add or change?", type: "text" },
  { id: crypto.randomUUID(), text: "How long did your play session last?", type: "text" },
  { id: crypto.randomUUID(), text: "Would you recommend this game to a friend?", type: "yes_no" },
  { id: crypto.randomUUID(), text: "How would you rate the overall game feel / 'juice'?", type: "rating" },
  { id: crypto.randomUUID(), text: "Any additional thoughts on level design or pacing?", type: "text" },
];

const PRESET_QUESTIONS_JA: CustomQuestion[] = [
  { id: crypto.randomUUID(), text: "操作は直感的でしたか？", type: "rating" },
  { id: crypto.randomUUID(), text: "チュートリアルはわかりやすかったですか？", type: "yes_no" },
  { id: crypto.randomUUID(), text: "ゲームで最も混乱した部分は何ですか？", type: "text" },
  { id: crypto.randomUUID(), text: "難易度の曲線はどうでしたか？", type: "rating" },
  { id: crypto.randomUUID(), text: "クラッシュやフリーズは発生しましたか？", type: "yes_no" },
  { id: crypto.randomUUID(), text: "迷ったり詰まったりした場面はありましたか？", type: "text" },
  { id: crypto.randomUUID(), text: "ビジュアルの完成度はどうでしたか？", type: "rating" },
  { id: crypto.randomUUID(), text: "オーディオ/音楽はゲームプレイに合っていましたか？", type: "yes_no" },
  { id: crypto.randomUUID(), text: "ゲームのレスポンスはどうでしたか？（入力遅延、フレームレート）", type: "rating" },
  { id: crypto.randomUUID(), text: "UI/HUDは十分な情報を提供していましたか？", type: "yes_no" },
  { id: crypto.randomUUID(), text: "追加または変更したい機能やメカニクスは何ですか？", type: "text" },
  { id: crypto.randomUUID(), text: "プレイセッションはどのくらいの長さでしたか？", type: "text" },
  { id: crypto.randomUUID(), text: "このゲームを友人に勧めますか？", type: "yes_no" },
  { id: crypto.randomUUID(), text: "全体的なゲームフィール/「手応え」の評価は？", type: "rating" },
  { id: crypto.randomUUID(), text: "レベルデザインやペーシングについて追加の感想はありますか？", type: "text" },
];

export function NewGameForm() {
  const { t, locale } = useApp();
  const { addToast } = useToast();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gameType, setGameType] = useState<GameType>("link");
  const [gameUrl, setGameUrl] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(
    () => (locale === "ja" ? PRESET_QUESTIONS_JA : PRESET_QUESTIONS_EN).map(q => ({ ...q, id: crypto.randomUUID() }))
  );
  const [submitting, setSubmitting] = useState(false);

  function toggleArrayItem(arr: string[], item: string) {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  function addQuestion() {
    setCustomQuestions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: "", type: "text" },
    ]);
  }

  function removeQuestion(id: string) {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, updates: Partial<CustomQuestion>) {
    setCustomQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let coverImageUrl: string | null = null;

      if (coverFile) {
        if (coverFile.size > 5 * 1024 * 1024) {
          addToast("Cover image must be under 5MB", "error");
        } else {
        const ext = coverFile.name.split(".").pop();
        const path = `${user.id}/covers/${Date.now()}.${ext}`;
        const { error: coverErr } = await supabase.storage
          .from("game-assets")
          .upload(path, coverFile);
        if (coverErr) {
          addToast("Cover image upload failed", "error");
        } else {
          const { data: { publicUrl } } = supabase.storage.from("game-assets").getPublicUrl(path);
          coverImageUrl = publicUrl;
        }
        }
      }

      const { data: game, error } = await supabase
        .from("games")
        .insert({
          owner_id: user.id,
          title,
          description,
          cover_image_url: coverImageUrl,
          game_type: gameType,
          game_url: gameUrl || null,
          file_path: null,
          platforms,
          genres,
          visibility,
        })
        .select()
        .single();

      if (error) {
        addToast("Failed to create game", "error");
        return;
      }

      const activeQuestions = customQuestions.filter((q) => q.text.trim());
      if (activeQuestions.length > 0 && game) {
        await supabase.from("feedback_questions").insert(
          activeQuestions.map((q, i) => ({
            game_id: game.id,
            question_text: q.text,
            question_type: q.type,
            options: q.options ?? null,
            sort_order: i,
          }))
        );
      }

      addToast("Game published!", "success");
      router.push(`/games/${game.id}`);
    } catch (err) {
      console.error("Failed to create game:", err);
      addToast("Failed to create game", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[750px] flex flex-col gap-12">
        {/* Header */}
        <section>
          <div className="flex items-center gap-4 mb-2">
            <span className="font-mono text-[14px] tracking-widest text-muted uppercase">
              {t.newGame.stepConfig}
            </span>
          </div>
          <h2 className="text-3xl font-headline font-bold tracking-tight text-white uppercase">
            {t.newGame.title}
          </h2>
          <div className="h-px w-full bg-outline-variant mt-6" />
        </section>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="flex flex-col gap-10"
        >
          {/* Title */}
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">
              {t.newGame.projectIdentity}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.newGame.titlePlaceholder}
              className="bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3"
              required
            />
          </div>

          {/* Cover Image */}
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">
              {t.newGame.heroVisual}
            </label>
            <label className="group relative w-full aspect-video border border-dashed border-outline-variant hover:border-primary transition-colors flex flex-col items-center justify-center cursor-pointer bg-surface-lowest overflow-hidden">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  if (file && file.size > 5 * 1024 * 1024) {
                    addToast("Cover image must be under 5MB", "error");
                    e.target.value = "";
                    return;
                  }
                  setCoverFile(file);
                }}
              />
              {coverFile ? (
                <div className="relative w-full h-full">
                  <img src={URL.createObjectURL(coverFile)} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={(e) => { e.preventDefault(); setCoverFile(null); }} className="absolute top-2 right-2 bg-black/80 p-1">
                    <span className="material-symbols-outlined text-white text-sm">close</span>
                  </button>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary mb-2">upload_file</span>
                  <p className="font-mono text-[14px] tracking-widest text-muted group-hover:text-primary">{t.newGame.dragDrop}</p>
                  <p className="font-mono text-[13px] text-muted mt-1">{t.newGame.maxSize}</p>
                </>
              )}
            </label>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">
              {t.newGame.description}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.newGame.descPlaceholder}
              rows={4}
              className="bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3 resize-none"
            />
          </div>

          <div className="h-px w-full bg-outline-variant" />

          {/* Game Type */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">{t.newGame.deliveryMethod}</label>
            <div className="grid grid-cols-2 gap-1 bg-outline-variant p-px">
              {(["link", "web"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setGameType(type)}
                  className={`py-5 font-mono text-[14px] tracking-widest uppercase transition-all cursor-pointer ${
                    gameType === type ? "bg-primary text-on-primary" : "bg-surface text-secondary hover:bg-surface-high"
                  }`}
                >
                  {type === "link" ? t.newGame.externalLink : t.newGame.webEmbed}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={gameUrl}
              onChange={(e) => setGameUrl(e.target.value)}
              placeholder={gameType === "link" ? "https://itch.io/your-game or Google Drive link..." : "https://your-web-game.com..."}
              className="bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3"
            />
            <p className="font-mono text-[13px] text-muted leading-relaxed">
              {locale === "ja"
                ? "itch.io、Google Drive、またはその他のホスティングサービスにビルドをアップロードし、ここにリンクを貼り付けてください。直接ファイルアップロードはサポートされていません。"
                : "Upload your build to itch.io, Google Drive, or any hosting service and paste the link here. Direct file uploads are not supported."}
            </p>
          </div>

          {/* Platforms */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">{t.newGame.targetArchitectures}</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_OPTIONS.map((p) => (
                <button key={p} type="button" onClick={() => setPlatforms(toggleArrayItem(platforms, p))}
                  className={`px-4 py-2 border font-mono text-[14px] uppercase transition-all cursor-pointer ${
                    platforms.includes(p) ? "border-primary text-white" : "border-outline-variant text-muted hover:border-secondary hover:text-secondary"
                  }`}
                >{p}</button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant" />

          {/* Genres */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">{t.newGame.genreTags}</label>
            <div className="flex flex-wrap gap-3">
              {GENRE_OPTIONS.map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={genres.includes(g)} onChange={() => setGenres(toggleArrayItem(genres, g))}
                    className="w-4 h-4 bg-surface border-outline-variant text-primary rounded-none focus:ring-0" />
                  <span className="font-mono text-[14px] text-muted uppercase group-hover:text-white transition-colors">{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div className="flex flex-col gap-4">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">{t.newGame.visibility}</label>
            <div className="flex gap-4">
              {(["public", "private"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setVisibility(v)}
                  className={`flex-1 p-5 border flex items-center justify-between cursor-pointer transition-colors ${
                    visibility === v ? "border-primary bg-white/5" : "border-outline-variant hover:border-secondary"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className={`font-mono text-[14px] uppercase ${visibility === v ? "text-white" : "text-muted"}`}>
                      {v === "public" ? t.newGame.publicAccess : t.newGame.privateRepo}
                    </span>
                    <span className="font-mono text-[13px] text-muted leading-relaxed max-w-[240px]">
                      {v === "public" ? t.newGame.publicDesc : t.newGame.privateDesc}
                    </span>
                  </div>
                  <span className={`material-symbols-outlined ${visibility === v ? "text-primary" : "text-muted"}`}>
                    {v === "public" ? "dashboard" : "link"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-outline-variant" />

          {/* Game Tester Questions */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-[14px] tracking-widest text-muted uppercase">
                  {t.newGame.customFields}
                </label>
                <button type="button" onClick={addQuestion}
                  className="font-mono text-[14px] text-white hover:underline uppercase cursor-pointer">
                  {t.newGame.addField}
                </button>
              </div>
              <p className="font-mono text-[14px] text-muted leading-relaxed">
                {t.newGame.customFieldsDesc}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {customQuestions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-3 p-4 border border-outline-variant bg-surface-lowest">
                  <span className="material-symbols-outlined text-outline-variant cursor-grab active:cursor-grabbing text-sm">
                    drag_indicator
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[13px] text-muted uppercase block mb-1">
                      Q{String(i + 1).padStart(2, "0")} {"/ "}{q.type.toUpperCase().replace("_", "/")}
                    </span>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      placeholder={t.newGame.questionPlaceholder}
                      className="w-full bg-transparent border-0 p-0 font-mono text-[14px] text-white focus:ring-0 placeholder:text-muted/40"
                    />
                  </div>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                    className="bg-surface-lowest border border-outline-variant font-mono text-[14px] text-muted px-2 py-1 shrink-0"
                  >
                    <option value="text">TEXT</option>
                    <option value="rating">RATING</option>
                    <option value="yes_no">YES/NO</option>
                    <option value="multiple_choice">MULTI</option>
                  </select>
                  <button type="button" onClick={() => removeQuestion(q.id)}
                    className="material-symbols-outlined text-outline-variant hover:text-error cursor-pointer text-sm shrink-0">
                    close
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end items-center gap-3 pt-8 border-t border-outline-variant">
            <button type="button" onClick={() => router.back()}
              className="px-6 py-3 border border-outline-variant text-white font-mono text-[14px] tracking-widest uppercase hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer">
              {t.newGame.cancel}
            </button>
            <button type="submit" disabled={submitting || !title.trim()}
              className="px-8 py-3 bg-white text-black font-mono text-[14px] tracking-widest font-bold uppercase hover:bg-on-background active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer">
              {submitting ? t.newGame.deploying : t.newGame.publish}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
