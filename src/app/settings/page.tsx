import { AppShell } from "@/components/layout/app-shell";
import { requireProfile } from "@/lib/auth/require-profile";
import { SettingsContent } from "@/components/settings/settings-content";

export const dynamic = "force-dynamic";

async function fetchRecentCommits(): Promise<{ message: string; date: string }[]> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Ijtihed/supertest/commits?per_page=10",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data as { commit: { message: string; author: { date: string } } }[]).map((c) => ({
      message: c.commit.message.split("\n")[0],
      date: new Date(c.commit.author.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  } catch {
    return [];
  }
}

export default async function SettingsPage() {
  const { user, profile } = await requireProfile();
  const commits = await fetchRecentCommits();

  return (
    <AppShell profile={profile} topnavTitle="SETTINGS">
      <SettingsContent profile={profile} email={user.email ?? "—"} commits={commits} />
    </AppShell>
  );
}
