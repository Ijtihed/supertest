"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useApp } from "@/lib/i18n/context";
import { useToast } from "@/lib/toast/context";
import type { Profile } from "@/lib/types/database";

export function AdminContent({
  profiles,
  adminProfile,
}: {
  profiles: Profile[];
  adminProfile: Profile;
}) {
  const router = useRouter();
  const { addToast } = useToast();
  const { t } = useApp();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [bulkApproving, setBulkApproving] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProfiles = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => {
      const name = (p.display_name ?? "").toLowerCase();
      const email = (p.supercell_email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [profiles, search]);

  const col = {
    name: t.settings.displayName,
    email: t.onboarding.supercellEmail,
    cohort: t.settings.cohort,
    status: t.common.status,
  };

  const stats = useMemo(() => {
    const total = profiles.length;
    const pending = profiles.filter((p) => p.status === "pending").length;
    const approved = profiles.filter((p) => p.status === "approved").length;
    const rejected = profiles.filter((p) => p.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [profiles]);

  async function setStatus(userId: string, status: "approved" | "rejected") {
    if (userId === adminProfile.id) return;
    setBusyId(userId);
    try {
      const supabase = createClient();
      const { error, count } = await supabase
        .from("profiles")
        .update({ status })
        .eq("id", userId)
        .select();
      if (error) {
        addToast(`Failed: ${error.message}`, "error");
      } else if (!count || count === 0) {
        addToast("Update failed - check admin RLS policy in Supabase", "error");
      } else {
        addToast(`User ${status}`, "success");
        router.refresh();
      }
    } catch {
      addToast("Failed to update user", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function approveAllPending() {
    const pending = profiles.filter(
      (p) => p.status === "pending" && p.id !== adminProfile.id,
    );
    if (pending.length === 0) return;
    setBulkApproving(true);
    try {
      const supabase = createClient();
      await Promise.all(
        pending.map((p) =>
          supabase
            .from("profiles")
            .update({ status: "approved" })
            .eq("id", p.id),
        ),
      );
      const approvedCount = pending.length;
      addToast(
        approvedCount === 1
          ? "Approved 1 pending user."
          : `Approved ${approvedCount} pending users.`,
        "success",
      );
      router.refresh();
    } finally {
      setBulkApproving(false);
    }
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="font-headline font-black text-4xl tracking-tighter text-white uppercase">
          ADMIN PANEL
        </h2>
        <p className="font-mono text-[13px] text-muted mt-2">
          <span className="text-primary">{adminProfile.display_name}</span>
          <span className="text-muted"> · admin</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 min-w-0">
          {[
            { label: "Total users", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "Approved", value: stats.approved },
            { label: "Rejected", value: stats.rejected },
          ].map((row) => (
            <div
              key={row.label}
              className="border border-outline-variant bg-surface-lowest px-4 py-3"
            >
              <p className="font-mono text-[14px] text-muted uppercase tracking-widest mb-1">
                {row.label}
              </p>
              <p className="font-mono text-2xl text-primary tabular-nums">
                {row.value}
              </p>
            </div>
          ))}
        </div>
        {stats.pending > 0 && (
          <button
            type="button"
            disabled={bulkApproving}
            onClick={() => void approveAllPending()}
            className="shrink-0 self-start lg:self-stretch flex items-center justify-center px-6 py-3 bg-white text-black font-mono text-[14px] uppercase tracking-widest hover:bg-white/90 disabled:opacity-60 transition-opacity"
          >
            {bulkApproving ? "APPROVING..." : "APPROVE ALL PENDING"}
          </button>
        )}
      </div>

      <div className="mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-md bg-surface-lowest border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-3 py-3 outline-none transition-colors"
          aria-label="Search users"
        />
      </div>

      <div className="border border-outline-variant overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[1.2fr_1.4fr_0.9fr_0.9fr_0.7fr_1fr_auto] gap-0 font-mono text-[14px] text-muted uppercase tracking-widest border-b border-outline-variant bg-surface-container px-3 py-2">
            <span>{col.name}</span>
            <span>{col.email}</span>
            <span>{col.cohort}</span>
            <span>{col.status}</span>
            <span>Points</span>
            <span>Created</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-outline-variant">
            {filteredProfiles.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-[1.2fr_1.4fr_0.9fr_0.9fr_0.7fr_1fr_auto] gap-0 items-center px-3 py-3 bg-surface-lowest font-mono text-[14px] text-primary"
              >
                <span className="truncate pr-2">{p.display_name}</span>
                <span className="truncate pr-2 text-muted">
                  {p.supercell_email ?? "—"}
                </span>
                <span className="text-muted">{p.cohort ?? "—"}</span>
                <span
                  className={
                    p.status === "pending"
                      ? "text-secondary"
                      : p.status === "approved"
                        ? "text-success"
                        : "text-error"
                  }
                >
                  {p.status}
                </span>
                <span className="text-muted tabular-nums">{p.review_points}</span>
                <span className="text-muted text-[13px]">
                  {new Date(p.created_at).toLocaleString()}
                </span>
                <div className="flex justify-end gap-2 shrink-0">
                  {p.id !== adminProfile.id && (
                    <>
                      {p.status !== "approved" && (
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => setStatus(p.id, "approved")}
                          className="border border-outline-variant px-3 py-1.5 font-mono text-[13px] uppercase tracking-wider text-primary hover:bg-primary hover:text-on-primary disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {p.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={busyId === p.id}
                          onClick={() => setStatus(p.id, "rejected")}
                          className="border border-outline-variant px-3 py-1.5 font-mono text-[13px] uppercase tracking-wider text-muted hover:border-error hover:text-error disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
