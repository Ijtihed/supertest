"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/lib/i18n/context";
import type { Profile, Cohort } from "@/lib/types/database";

const UPDATES: { date: string; note: string }[] = [
  { date: "Apr 3", note: "Feedback editing — pre-fill existing review, no double points" },
  { date: "Apr 3", note: "Admin — game builds section with delete capability" },
  { date: "Apr 3", note: "Collaborators — searchable picker on game form, team shown on detail" },
  { date: "Apr 3", note: "Multiplayer badge on browse cards" },
  { date: "Apr 3", note: "Live session — GO LIVE button, LIVE badge, join link for multiplayer games" },
  { date: "Apr 3", note: "Color images for active games, grayscale for paused" },
  { date: "Apr 3", note: "Platforms restored to filters, cards, detail, and game form" },
];

const COHORTS: { id: Cohort; label: string }[] = [
  { id: "helsinki", label: "Helsinki" },
  { id: "san_francisco", label: "San Francisco" },
  { id: "tokyo", label: "Tokyo" },
];

export function SettingsContent({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  const router = useRouter();
  const { locale, setLocale, t } = useApp();
  const [cohort, setCohort] = useState<Cohort | null>(profile.cohort);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleCohortChange(newCohort: Cohort) {
    setCohort(newCohort);
    setSaving(true);
    setSaved(false);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ cohort: newCohort })
        .eq("id", profile.id);

      if (error) throw error;
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update cohort:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[600px]">
      <h2 className="font-headline font-bold text-3xl tracking-tighter text-primary uppercase mb-8">
        {t.settings.title}
      </h2>

      <div className="space-y-8">
        <div className="border-b border-outline-variant pb-8">
          <label className="font-mono text-[14px] tracking-widest text-muted uppercase block mb-3">
            {t.settings.displayName}
          </label>
          <p className="font-mono text-sm text-primary">
            {profile.display_name}
          </p>
        </div>

        <div className="border-b border-outline-variant pb-8">
          <label className="font-mono text-[14px] tracking-widest text-muted uppercase block mb-3">
            {t.settings.email}
          </label>
          <p className="font-mono text-sm text-primary">{email}</p>
        </div>

        {/* Cohort */}
        <div className="border-b border-outline-variant pb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="font-mono text-[14px] tracking-widest text-muted uppercase">
              {t.settings.cohort}
            </label>
            {saving && (
              <span className="font-mono text-[13px] text-muted">
                {t.settings.saving}
              </span>
            )}
            {saved && (
              <span className="font-mono text-[13px] text-primary">
                {t.settings.saved}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {COHORTS.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCohortChange(c.id)}
                disabled={saving}
                className={`p-4 border text-center transition-all cursor-pointer ${
                  cohort === c.id
                    ? "border-primary bg-primary/5"
                    : "border-outline-variant hover:border-secondary"
                }`}
              >
                <span
                  className={`font-mono text-[14px] tracking-widest uppercase ${
                    cohort === c.id ? "text-primary" : "text-muted"
                  }`}
                >
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="border-b border-outline-variant pb-8">
          <label className="font-mono text-[14px] tracking-widest text-muted uppercase block mb-4">
            {t.settings.language}
          </label>
          <div className="flex">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`font-mono text-[14px] tracking-wider px-3 py-1 border transition-all cursor-pointer ${
                locale === "en"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-muted hover:text-primary"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLocale("ja")}
              className={`font-mono text-[14px] tracking-wider px-3 py-1 border-y border-r transition-all cursor-pointer ${
                locale === "ja"
                  ? "bg-primary text-on-primary border-primary"
                  : "border-outline-variant text-muted hover:text-primary"
              }`}
            >
              日本語
            </button>
          </div>
        </div>

        <div className="border-b border-outline-variant pb-8">
          <label className="font-mono text-[14px] tracking-widest text-muted uppercase block mb-3">
            {t.settings.accountId}
          </label>
          <p className="font-mono text-[14px] text-muted">{profile.id}</p>
        </div>

        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="border border-outline-variant px-6 py-3 font-mono text-[14px] tracking-widest uppercase text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
          >
            {t.settings.signOut}
          </button>
        </form>

        {/* Updates */}
        <div className="pt-4">
          <label className="font-mono text-[14px] tracking-widest text-muted uppercase block mb-6">
            Updates
          </label>
          <div className="space-y-4">
            {UPDATES.map((update, i) => (
              <div key={i} className="flex gap-4">
                <span className="font-mono text-[12px] text-muted shrink-0 pt-0.5">
                  {update.date}
                </span>
                <span className="font-mono text-[13px] text-primary/70">
                  {update.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
