export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header skeleton */}
      <header className="flex items-center justify-between border-b border-white/6 px-6 py-3">
        <div className="h-3 w-16 animate-pulse rounded-full bg-white/8" />
        <div className="h-3 w-24 animate-pulse rounded-full bg-white/8" />
        <div className="h-3 w-12 animate-pulse rounded-full bg-white/8" />
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-[minmax(0,480px)_1fr] lg:gap-6 lg:p-6">
        {/* Left — webcam skeleton */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-white/4" />
        </div>

        {/* Right — metrics skeleton */}
        <div className="flex flex-col gap-4">
          <div className="h-32 animate-pulse rounded-2xl bg-white/4" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-white/4" />
            ))}
          </div>
          <div className="h-48 animate-pulse rounded-2xl bg-white/4" />
          <div className="h-32 animate-pulse rounded-2xl bg-white/4" />
        </div>
      </main>
    </div>
  );
}