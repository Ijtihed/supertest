import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = { title: "Onboarding" };

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.cohort && profile?.supercell_email) {
    redirect("/pending");
  }

  const showEmailStep = Boolean(profile?.cohort && !profile?.supercell_email);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <OnboardingFlow showEmailStep={showEmailStep} />
      </div>
    </div>
  );
}
