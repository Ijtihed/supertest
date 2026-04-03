export default function ProfileLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING PROFILE</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-surface-container shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-8 w-48 bg-surface-container" />
              <div className="h-4 w-32 bg-surface-container" />
              <div className="flex gap-6 mt-4">
                <div className="space-y-1">
                  <div className="h-6 w-12 bg-surface-container" />
                  <div className="h-3 w-20 bg-surface-container" />
                </div>
                <div className="space-y-1">
                  <div className="h-6 w-12 bg-surface-container" />
                  <div className="h-3 w-20 bg-surface-container" />
                </div>
                <div className="space-y-1">
                  <div className="h-6 w-12 bg-surface-container" />
                  <div className="h-3 w-20 bg-surface-container" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-px bg-surface-container" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-surface-container">
                <div className="aspect-video bg-surface-container" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-40 bg-surface-container" />
                  <div className="h-3 w-24 bg-surface-container" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
