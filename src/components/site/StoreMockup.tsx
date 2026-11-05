/** Original illustrative storefront concept drawn with shapes only (no real brand or product). */
function Store({ compact }: { compact?: boolean }) {
  const cards = compact ? ["bg-blush", "bg-berry/70"] : ["bg-blush", "bg-berry/70", "bg-secondary", "bg-oxblood/80"];
  return (
    <div className="h-full overflow-hidden bg-petal">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="h-2 w-12 rounded bg-oxblood" />
        <span className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-5 rounded bg-plum/40" />)}</span>
      </div>
      <div className="relative flex flex-col justify-center gap-1.5 overflow-hidden bg-oxblood p-3" style={{ minHeight: compact ? "4.5rem" : "6rem" }}>
        <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-berry/60 blur-xl" />
        <span className="relative h-1.5 w-10 rounded bg-blush" />
        <span className="relative h-3 w-3/5 rounded bg-petal" />
        <span className="relative h-3 w-2/5 rounded bg-petal/80" />
        <span className="relative mt-1 h-3 w-14 rounded-full bg-berry" />
      </div>
      <div className={`grid gap-2 p-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        {cards.map((t, i) => (
          <div key={i}>
            <div className={`aspect-[4/5] rounded-md ${t}`} />
            <div className="mt-1.5 h-1.5 w-3/4 rounded bg-plum/60" />
            <div className="mt-1 h-1.5 w-1/3 rounded bg-berry" />
            <div className="mt-1.5 h-3 rounded-full bg-oxblood" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StoreMockup() {
  return (
    <figure className="relative mx-auto w-full max-w-2xl" role="img" aria-label="Illustrative storefront concept shown on a laptop and a phone">
      <div className="pointer-events-none absolute inset-0 -z-0 m-auto h-3/4 w-3/4 rounded-full bg-berry/40 blur-3xl" />
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-0">
        {/* Laptop */}
        <div className="w-full sm:w-[82%]">
          <div className="rounded-t-2xl border border-petal/15 bg-ink p-2 shadow-glow">
            <div className="aspect-[16/10] overflow-hidden rounded-lg"><Store /></div>
          </div>
          <div className="mx-auto h-3 w-[108%] -translate-x-[3.7%] rounded-b-xl bg-gradient-to-b from-plum to-ink" />
        </div>
        {/* Phone */}
        <div className="w-36 shrink-0 sm:-ml-10 sm:w-[26%]">
          <div className="rounded-[1.4rem] border border-petal/20 bg-ink p-1.5 shadow-glow">
            <div className="relative aspect-[9/18] overflow-hidden rounded-[1.1rem]">
              <span className="absolute left-1/2 top-1 z-10 h-1.5 w-8 -translate-x-1/2 rounded-full bg-ink" />
              <Store compact />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="relative mt-5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-blush/70">Illustrative storefront concept</figcaption>
    </figure>
  );
}
