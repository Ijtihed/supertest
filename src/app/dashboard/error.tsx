"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="max-w-md">
        <h2 className="font-headline font-bold text-2xl text-white mb-2">DASHBOARD_ERROR</h2>
        <p className="font-mono text-[13px] text-muted tracking-widest mb-1">
          {error.digest ? `DIGEST: ${error.digest}` : "FAILED TO LOAD DASHBOARD"}
        </p>
        <p className="font-body text-sm text-secondary mb-6">
          {error.message || "Something went wrong loading your dashboard."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="border border-outline-variant px-6 py-3 font-mono text-[14px] tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all cursor-pointer"
        >
          RETRY
        </button>
      </div>
    </div>
  );
}
