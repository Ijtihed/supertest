export default function DashboardLoading() {
  return (
    <div className="ml-[220px] pt-14 min-h-screen p-8">
      <div className="animate-pulse space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <div className="h-12 w-64 bg-surface-container" />
            <div className="h-4 w-48 bg-surface-container mt-3" />
          </div>
          <div className="h-10 w-32 bg-surface-container" />
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
  );
}
