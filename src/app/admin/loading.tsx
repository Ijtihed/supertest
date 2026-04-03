export default function AdminLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border border-primary border-t-transparent animate-spin" />
          <p className="font-mono text-[13px] text-muted tracking-widest">LOADING ADMIN PANEL</p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <div className="h-10 w-40 bg-surface-container" />
              <div className="h-4 w-56 bg-surface-container mt-3" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-24 bg-surface-container" />
              <div className="h-8 w-24 bg-surface-container" />
            </div>
          </div>
          <div className="h-px bg-surface-container" />
          <div className="border border-surface-container">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-surface-container">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-20 bg-surface-container" />
              ))}
            </div>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-surface-container last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container" />
                  <div className="h-4 w-24 bg-surface-container" />
                </div>
                <div className="h-4 w-32 bg-surface-container" />
                <div className="h-4 w-16 bg-surface-container" />
                <div className="h-4 w-20 bg-surface-container" />
                <div className="h-6 w-16 bg-surface-container" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
