import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("invite_code", code)
    .single();

  if (game) {
    redirect(`/games/${game.id}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline font-bold text-2xl text-white mb-4">INVITE_NOT_FOUND</h1>
        <p className="font-mono text-[14px] text-muted tracking-widest">
          THE INVITE CODE IS INVALID OR HAS EXPIRED
        </p>
      </div>
    </div>
  );
}
