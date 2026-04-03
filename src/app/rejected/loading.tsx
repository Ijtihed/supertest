export default function RejectedLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 border border-primary/30 animate-ping" />
          <div className="absolute inset-0 border border-primary border-t-transparent animate-spin" />
        </div>
        <p className="font-mono text-[13px] text-muted tracking-widest">CHECKING ACCOUNT STATUS</p>
      </div>
    </div>
  );
}
