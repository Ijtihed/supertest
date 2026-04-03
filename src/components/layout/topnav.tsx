"use client";

import Link from "next/link";
import { useApp } from "@/lib/i18n/context";

export function Topnav({
  title,
  showSearch = false,
  searchValue = "",
  onSearchChange,
}: {
  title?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}) {
  const { locale, setLocale, t } = useApp();

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-220px)] h-14 border-b border-surface-container bg-surface flex justify-between items-center px-6 z-40">
      <div className="flex items-center gap-8">
        {title && (
          <span className="font-mono text-[14px] tracking-widest uppercase text-primary font-bold">
            {title}
          </span>
        )}
        {showSearch && (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-muted text-sm">
              search
            </span>
            <input
              type="text"
              aria-label={locale === "ja" ? "ゲームを検索" : "Search games"}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder={locale === "ja" ? "ゲームを検索..." : "Search games..."}
              className="bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-primary font-mono text-sm placeholder:text-muted/50 pl-9 pr-3 py-2 w-64"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Language toggle */}
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

        <div className="h-4 w-px bg-outline-variant" />

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/games"
            className="font-mono text-[14px] tracking-widest uppercase text-muted hover:text-primary transition-colors"
          >
            {t.nav.browse}
          </Link>
          <Link
            href="/dashboard"
            className="font-mono text-[14px] tracking-widest uppercase text-muted hover:text-primary transition-colors"
          >
            {t.nav.dashboard}
          </Link>
        </nav>
        <div className="h-4 w-px bg-outline-variant" />
        <Link
          href="/games/new"
          className="bg-primary text-on-primary font-mono text-[14px] tracking-widest uppercase px-4 py-1.5 hover:bg-transparent hover:text-primary border border-transparent hover:border-primary transition-all active:scale-95"
        >
          {t.nav.newGame}
        </Link>
      </div>
    </header>
  );
}
