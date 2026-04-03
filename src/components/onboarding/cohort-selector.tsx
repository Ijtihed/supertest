"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/lib/i18n/context";
import type { Cohort } from "@/lib/types/database";

const COHORTS: { id: Cohort; label: string; flag: string }[] = [
  { id: "helsinki", label: "HELSINKI", flag: "FI" },
  { id: "san_francisco", label: "SAN FRANCISCO", flag: "US" },
  { id: "tokyo", label: "TOKYO", flag: "JP" },
];

export function CohortSelector({
  currentCohort,
  onCohortSaved,
}: {
  currentCohort?: Cohort | null;
  onCohortSaved?: () => void;
}) {
  const { t } = useApp();
  const router = useRouter();
  const [selected, setSelected] = useState<Cohort | null>(
    currentCohort ?? null
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!selected) return;
    setSaving(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ cohort: selected })
        .eq("id", user.id);

      if (error) throw error;

      if (onCohortSaved) {
        onCohortSaved();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save cohort:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {COHORTS.map((cohort) => (
        <button
          key={cohort.id}
          onClick={() => setSelected(cohort.id)}
          className={`w-full p-6 border text-left flex items-center justify-between transition-all cursor-pointer ${
            selected === cohort.id
              ? "border-white bg-white/5"
              : "border-outline-variant hover:border-secondary"
          }`}
        >
          <div>
            <span
              className={`font-mono text-sm tracking-widest uppercase ${
                selected === cohort.id ? "text-white" : "text-muted"
              }`}
            >
              {cohort.label}
            </span>
            <span className="font-mono text-[13px] text-muted ml-3">
              {cohort.flag}
            </span>
          </div>
          {selected === cohort.id && (
            <span className="material-symbols-outlined text-white text-sm">
              check
            </span>
          )}
        </button>
      ))}

      <button
        onClick={handleSave}
        disabled={!selected || saving}
        className="w-full bg-white text-black py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 cursor-pointer mt-8"
      >
        {saving ? t.settings.saving : t.onboarding.continue}
      </button>
    </div>
  );
}
