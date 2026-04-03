import { AppShell } from "@/components/layout/app-shell";
import { requireProfile } from "@/lib/auth/require-profile";
import { SettingsContent } from "@/components/settings/settings-content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { user, profile } = await requireProfile();

  return (
    <AppShell profile={profile} topnavTitle="SETTINGS">
      <SettingsContent profile={profile} email={user.email ?? "—"} />
    </AppShell>
  );
}
