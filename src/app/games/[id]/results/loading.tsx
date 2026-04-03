export default function ResultsLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING RESULTS</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-8 w-56 bg-surface-container" />
              <div className="h-4 w-40 bg-surface-container mt-3" />
            </div>
            <div className="h-10 w-36 bg-surface-container" />
          </div>
          <div className="h-px bg-surface-container" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-surface-container p-5 space-y-2">
                <div className="h-8 w-16 bg-surface-container" />
                <div className="h-4 w-24 bg-surface-container" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-surface-container p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container" />
                  <div className="h-4 w-32 bg-surface-container" />
                  <div className="ml-auto h-3 w-24 bg-surface-container" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-surface-container" />
                  <div className="h-3 w-2/3 bg-surface-container" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
