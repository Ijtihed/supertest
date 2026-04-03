"use client";

import Link from "next/link";
import { useApp } from "@/lib/i18n/context";

export function Footer({ withSidebar = false }: { withSidebar?: boolean }) {
  const { t } = useApp();

  return (
    <footer
      className={`border-t border-surface-container py-4 px-8 bg-surface-lowest flex justify-between items-center ${
        withSidebar ? "ml-[220px]" : ""
      }`}
    >
      <div className="flex items-center gap-6">
        <span className="font-sans font-bold text-muted text-[14px]">
          {t.brand}
        </span>
        <span className="font-mono text-[13px] tracking-widest uppercase text-muted">
          {t.footer.license}
        </span>
      </div>
      <div className="flex gap-6">
        <a
          href="https://github.com/Ijtihed/supertest"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[13px] tracking-widest uppercase text-muted hover:text-primary underline underline-offset-4 transition-colors"
        >
          GITHUB
        </a>
        <Link
          href="/security"
          className="font-mono text-[13px] tracking-widest uppercase text-muted hover:text-primary underline underline-offset-4 transition-colors"
        >
          SECURITY
        </Link>
      </div>
    </footer>
  );
}
