import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="font-mono text-8xl font-light text-white mb-4">404</p>
        <h1 className="font-headline font-bold text-2xl text-white mb-2">
          ROUTE_NOT_FOUND
        </h1>
        <p className="font-mono text-[14px] text-muted tracking-widest mb-8">
          THE REQUESTED RESOURCE DOES NOT EXIST
        </p>
        <Link
          href="/"
          className="border border-outline-variant px-6 py-3 font-mono text-[14px] tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  );
}
