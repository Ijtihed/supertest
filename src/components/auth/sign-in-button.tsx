"use client";

import { signInWithGoogle } from "@/lib/actions/auth";
import { useApp } from "@/lib/i18n/context";

export function SignInButton({
  variant = "primary",
}: {
  variant?: "primary" | "link";
}) {
  const { t } = useApp();

  if (variant === "link") {
    return (
      <button
        onClick={() => signInWithGoogle()}
        className="font-mono text-[14px] tracking-widest text-secondary hover:text-white transition-colors cursor-pointer"
      >
        {t.nav.signIn}
      </button>
    );
  }

  return (
    <button
      onClick={() => signInWithGoogle()}
      className="w-full sm:w-auto bg-white text-black px-8 py-4 font-mono text-xs font-bold tracking-widest hover:bg-transparent hover:text-white hover:ring-1 hover:ring-white transition-all flex items-center justify-center gap-2 cursor-pointer"
    >
      <span className="material-symbols-outlined !text-lg">login</span>
      {t.landing.signInGoogle}
    </button>
  );
}
