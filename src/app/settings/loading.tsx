export default function SettingsLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING SETTINGS</p>
        </div>
        <div className="animate-pulse space-y-8 max-w-2xl">
          <div>
            <div className="h-10 w-40 bg-surface-container" />
            <div className="h-4 w-56 bg-surface-container mt-3" />
          </div>
          <div className="h-px bg-surface-container" />
          <div className="border border-surface-container p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-surface-container" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-surface-container" />
                <div className="h-3 w-48 bg-surface-container" />
              </div>
            </div>
            <div className="h-px bg-surface-container" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-surface-container" />
                  <div className="h-4 w-48 bg-surface-container" />
                </div>
              ))}
            </div>
          </div>
          <div className="border border-surface-container p-6 space-y-4">
            <div className="h-5 w-36 bg-surface-container" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 w-64 bg-surface-container" />
                  <div className="h-3 w-16 bg-surface-container" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
