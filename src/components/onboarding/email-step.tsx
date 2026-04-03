"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/lib/i18n/context";

function isValidEmailFormat(value: string): boolean {
  const at = value.indexOf("@");
  if (at <= 0) return false;
  const afterAt = value.slice(at + 1);
  return afterAt.includes(".");
}

export function EmailStep() {
  const { t } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  async function handleContinue() {
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!isValidEmailFormat(trimmed)) {
      setEmailError("Enter a valid email address (include @ and a domain with a dot).");
      return;
    }
    setEmailError(null);
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ supercell_email: trimmed })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/pending");
      router.refresh();
    } catch (err) {
      console.error("Failed to save Supercell email:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleContinue(); }} className="space-y-6">
      <p className="font-mono text-[14px] text-muted leading-relaxed text-center">
        {t.onboarding.emailStepHint}
      </p>
      <div className="flex flex-col gap-3">
        <label className="font-mono text-[14px] tracking-widest text-muted uppercase">
          {t.onboarding.supercellEmail}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          placeholder={t.onboarding.supercellEmailPlaceholder}
          autoComplete="email"
          className="bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3"
        />
        {emailError && (
          <p className="font-mono text-[13px] text-error" role="alert">
            {emailError}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!email.trim() || saving}
        className="w-full bg-white text-black py-4 font-mono text-[14px] font-bold tracking-[0.2em] uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-30 cursor-pointer mt-4"
      >
        {saving ? t.settings.saving : t.onboarding.continue}
      </button>
    </form>
  );
}
