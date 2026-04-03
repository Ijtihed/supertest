"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md">
        <h1 className="font-headline font-bold text-3xl text-white mb-4">
          SYSTEM_ERROR
        </h1>
        <p className="font-mono text-[14px] text-muted tracking-widest mb-2">
          {error.digest ? `DIGEST: ${error.digest}` : "UNEXPECTED_FAILURE"}
        </p>
        <p className="font-body text-sm text-secondary mb-8">
          {error.message || "Something went wrong. Please try again."}
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
