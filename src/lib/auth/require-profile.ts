import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireProfile() {
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

  if (!profile?.cohort) redirect("/onboarding");
  if (!profile.supercell_email) redirect("/onboarding");
  if (profile.status === "pending") redirect("/pending");
  if (profile.status === "rejected") redirect("/rejected");

  return { supabase, user, profile };
}

export async function requireAdmin() {
  const result = await requireProfile();
  if (!result.profile.is_admin) redirect("/dashboard");
  return result;
}
