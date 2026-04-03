export default function FeedbackLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING FEEDBACK FORM</p>
        </div>
        <div className="animate-pulse space-y-8 max-w-2xl">
          <div>
            <div className="h-8 w-64 bg-surface-container" />
            <div className="h-4 w-48 bg-surface-container mt-3" />
          </div>
          <div className="h-px bg-surface-container" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-surface-container" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 bg-surface-container" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-48 bg-surface-container" />
                <div className="h-24 w-full bg-surface-container" />
              </div>
            ))}
          </div>
          <div className="h-12 w-40 bg-surface-container" />
        </div>
      </div>
    </div>
  );
}
