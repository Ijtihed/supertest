import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RejectedPage() {
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

  if (!profile) redirect("/");
  if (!profile.cohort || !profile.supercell_email) redirect("/onboarding");
  if (profile.status === "approved") redirect("/dashboard");
  if (profile.status === "pending") redirect("/pending");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-headline font-bold text-3xl tracking-tighter text-primary uppercase">
          Account Not Approved
        </h1>
        <p className="font-mono text-[14px] text-muted leading-relaxed">
          Your access request was not approved. Contact an administrator.
        </p>
        <form action="/auth/signout" method="POST" className="pt-2">
          <button
            type="submit"
            className="border border-outline-variant px-6 py-3 font-mono text-[14px] tracking-widest uppercase text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
