"use client";

import { useEffect, useState } from "react";
import { useToast, type Toast } from "@/lib/toast/context";

function ToastItem({ toast }: { toast: Toast }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const hidden = toast.exiting || !shown;
  const bar =
    toast.type === "success" ? "border-l-success" : "border-l-error";

  return (
    <div
      className={[
        "max-w-sm border border-outline-variant bg-card font-mono text-[14px] px-4 py-3 border-l-2 shadow-lg",
        bar,
        "transition-all duration-300 ease-out",
        hidden ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0",
      ].join(" ")}
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
