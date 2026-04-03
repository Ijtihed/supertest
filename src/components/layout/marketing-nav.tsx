"use client";

import Link from "next/link";
import { useApp } from "@/lib/i18n/context";

export function MarketingNav({ showSignIn }: { showSignIn?: React.ReactNode }) {
  const { locale, setLocale, t } = useApp();

  return (
    <nav className="fixed top-0 right-0 left-0 h-14 bg-black-absolute flex justify-between items-center px-6 z-50 border-b border-outline-variant">
      <Link href="/" className="font-mono font-black text-sm tracking-widest text-primary">
        {t.brand}
      </Link>
      <div className="flex items-center gap-4">
        <div className="flex">
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`font-mono text-[14px] tracking-wider px-3 py-1 border transition-all cursor-pointer ${
              locale === "en"
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-secondary hover:text-primary"
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
                : "border-outline-variant text-secondary hover:text-primary"
            }`}
          >
            日本語
          </button>
        </div>
        {showSignIn}
      </div>
    </nav>
  );
}
