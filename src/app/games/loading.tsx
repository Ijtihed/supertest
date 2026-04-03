export default function BrowseGamesLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING GAMES</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-10 w-48 bg-surface-container" />
              <div className="h-4 w-64 bg-surface-container mt-3" />
            </div>
            <div className="h-8 w-64 bg-surface-container" />
          </div>
          <div className="h-px bg-surface-container" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-surface-container">
                <div className="aspect-video bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-40 bg-surface-container" />
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-surface-container" />
                    <div className="h-3 w-24 bg-surface-container" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-3 w-16 bg-surface-container" />
                    <div className="h-3 w-16 bg-surface-container" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
