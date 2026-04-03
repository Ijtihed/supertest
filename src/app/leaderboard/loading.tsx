export default function LeaderboardLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING LEADERBOARD</p>
        </div>
        <div className="animate-pulse space-y-6">
          <div>
            <div className="h-10 w-56 bg-surface-container" />
            <div className="h-4 w-72 bg-surface-container mt-3" />
          </div>
          <div className="h-px bg-surface-container" />
          <div className="border border-surface-container">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-surface-container">
              <div className="h-4 w-12 bg-surface-container" />
              <div className="h-4 w-24 bg-surface-container" />
              <div className="h-4 w-20 bg-surface-container" />
              <div className="h-4 w-16 bg-surface-container" />
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-surface-container last:border-0">
                <div className="h-4 w-8 bg-surface-container" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container" />
                  <div className="h-4 w-28 bg-surface-container" />
                </div>
                <div className="h-4 w-16 bg-surface-container" />
                <div className="h-4 w-12 bg-surface-container" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
