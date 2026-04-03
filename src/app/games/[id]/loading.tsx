export default function GameDetailLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING GAME</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-20 bg-surface-container" />
          <div className="flex gap-8">
            <div className="flex-1 space-y-6">
              <div className="aspect-video bg-surface-container w-full" />
              <div className="space-y-3">
                <div className="h-8 w-72 bg-surface-container" />
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-surface-container" />
                  <div className="h-4 w-32 bg-surface-container" />
                </div>
              </div>
              <div className="h-px bg-surface-container" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-surface-container" />
                <div className="h-4 w-3/4 bg-surface-container" />
                <div className="h-4 w-5/6 bg-surface-container" />
              </div>
            </div>
            <div className="w-72 space-y-4 shrink-0">
              <div className="border border-surface-container p-5 space-y-4">
                <div className="h-5 w-24 bg-surface-container" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-surface-container" />
                  <div className="h-16 bg-surface-container" />
                </div>
                <div className="h-10 bg-surface-container" />
              </div>
              <div className="border border-surface-container p-5 space-y-3">
                <div className="h-5 w-32 bg-surface-container" />
                <div className="h-4 w-full bg-surface-container" />
                <div className="h-4 w-2/3 bg-surface-container" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
