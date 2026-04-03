"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/i18n/context";
import type { Profile } from "@/lib/types/database";

export function Sidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useApp();

  const NAV_ITEMS = [
    { href: "/dashboard", label: t.nav.dashboard, icon: "dashboard" },
    { href: "/games", label: t.nav.browse, icon: "analytics" },
    { href: "/games/new", label: t.nav.builds, icon: "construction" },
    { href: "/leaderboard", label: t.nav.leaderboard, icon: "leaderboard" },
    { href: "/settings", label: t.nav.settings, icon: "settings" },
    ...(profile?.is_admin ? [{ href: "/admin", label: "ADMIN", icon: "admin_panel_settings" }] : []),
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] border-r border-surface-container bg-surface-lowest flex flex-col py-8 z-50">
      <div className="px-6 mb-12">
        <Link href="/">
          <h1 className="font-sans font-black text-xl tracking-tighter text-primary">
            {t.brand}
          </h1>
        </Link>
        <p className="font-mono text-[14px] tracking-widest uppercase text-muted mt-1">
          V1.0.0-BETA
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/leaderboard"
              ? pathname === "/leaderboard"
              : pathname === item.href ||
                (item.href === "/games" && pathname === "/games") ||
                (item.href === "/games/new" &&
                  pathname.startsWith("/games/new"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 py-3 font-mono text-[14px] tracking-widest uppercase transition-all duration-150 ${
                isActive
                  ? "text-primary border-l-2 border-primary pl-4 bg-primary/5"
                  : "text-muted pl-4 hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {profile && (
        <div className="px-6 mt-auto" onClick={() => router.push("/settings")}>
          <div className="flex items-center gap-3 p-2 bg-surface-container rounded-sm hover:bg-surface-high transition-colors cursor-pointer">
            <div className="w-8 h-8 bg-surface-high border border-outline-variant overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-sm">
                    person
                  </span>
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-mono text-[14px] text-primary truncate">
                {profile.display_name.toUpperCase()}
              </p>
              <p className="font-mono text-[13px] text-muted truncate">
                {profile.cohort?.toUpperCase().replace("_", " ") ?? "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
