export default function NewGameLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING NEW BUILD</p>
        </div>
        <div className="animate-pulse space-y-8 max-w-2xl">
          <div>
            <div className="h-10 w-56 bg-surface-container" />
            <div className="h-4 w-72 bg-surface-container mt-3" />
          </div>
          <div className="h-px bg-surface-container" />
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-surface-container" />
              <div className="h-10 w-full bg-surface-container" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-surface-container" />
              <div className="h-32 w-full bg-surface-container" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-28 bg-surface-container" />
              <div className="h-10 w-full bg-surface-container" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-36 bg-surface-container" />
              <div className="h-10 w-full bg-surface-container" />
            </div>
          </div>
          <div className="h-12 w-40 bg-surface-container" />
        </div>
      </div>
    </div>
  );
}
