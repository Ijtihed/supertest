"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserOption {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

export function CollaboratorPicker({
  selected,
  onChange,
  excludeUserId,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  excludeUserId?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    if (!expanded || users.length > 0) return;
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .eq("status", "approved")
      .order("display_name")
      .then(({ data }) => {
        if (cancelled) return;
        setUsers(
          (data ?? []).filter((u) => u.id !== excludeUserId) as UserOption[]
        );
      });
    return () => { cancelled = true; };
  }, [expanded, users.length, excludeUserId]);

  const filtered = users.filter((u) =>
    u.display_name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUsers = users.filter((u) => selected.includes(u.id));

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 font-mono text-[14px] text-muted hover:text-white transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">
          {expanded ? "expand_less" : "expand_more"}
        </span>
        COLLABORATORS ({selected.length})
      </button>

      {expanded && (
        <div className="border border-outline-variant bg-surface-lowest p-4 space-y-3">
          {/* Selected */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-3 border-b border-outline-variant">
              {selectedUsers.map((u) => (
                <span
                  key={u.id}
                  className="flex items-center gap-2 bg-surface-container px-3 py-1.5 font-mono text-[13px] text-white"
                >
                  {u.display_name}
                  <button
                    type="button"
                    onClick={() => toggle(u.id)}
                    className="material-symbols-outlined text-muted hover:text-error text-sm cursor-pointer"
                  >
                    close
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-background border-0 border-b border-outline-variant focus:border-primary focus:ring-0 text-white font-mono text-sm placeholder:text-muted/50 px-2 py-2"
          />

          {/* User list */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {users.length === 0 && expanded && (
              <p className="font-mono text-[13px] text-muted py-2">Loading...</p>
            )}
            {users.length > 0 && filtered.length === 0 && (
              <p className="font-mono text-[13px] text-muted py-2">No users found</p>
            )}
            {filtered.map((u) => {
              const isSelected = selected.includes(u.id);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => toggle(u.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 text-white"
                      : "hover:bg-surface-container text-muted hover:text-white"
                  }`}
                >
                  <div className="w-6 h-6 bg-surface-high border border-outline-variant overflow-hidden shrink-0">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <span className="font-mono text-[13px] truncate">{u.display_name}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-success text-sm ml-auto shrink-0">check</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
