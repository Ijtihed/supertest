import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { AdminContent } from "@/components/admin/admin-content";
import { requireAdmin } from "@/lib/auth/require-profile";

export const metadata: Metadata = { title: "Admin" };

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { supabase, profile } = await requireAdmin();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: games } = await supabase
    .from("games")
    .select("*, profiles(display_name)")
    .order("created_at", { ascending: false });

  return (
    <AppShell profile={profile} topnavTitle="ADMIN">
      <AdminContent
        profiles={profiles ?? []}
        adminProfile={profile}
        games={games ?? []}
      />
    </AppShell>
  );
}
