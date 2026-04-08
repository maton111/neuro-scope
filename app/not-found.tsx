import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background text-foreground">
      <div className="text-center">
        <p className="font-mono text-[10px] text-[#00f5d4]">404</p>
        <h1 className="mt-2 text-4xl font-bold">Signal lost.</h1>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          This page doesn&apos;t exist. Or it does, but we can&apos;t track it.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-10 items-center gap-2 rounded-full bg-[#00f5d4] px-6 text-sm font-semibold text-black transition-all hover:bg-[#00d4b6]"
      >
        Return to base
      </Link>
    </div>
  );
}