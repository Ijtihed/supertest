export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border border-white border-t-transparent animate-spin" />
        <p className="font-mono text-[14px] text-muted tracking-widest">
          LOADING...
        </p>
      </div>
    </div>
  );
}
