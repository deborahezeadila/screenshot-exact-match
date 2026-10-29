import type { DesignSample } from "@/lib/design-samples";

function Skincare() {
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      <div className="col-span-2 grid grid-rows-2 gap-2">
        <div className="rounded-lg bg-blush" />
        <div className="rounded-lg bg-berry/70" />
      </div>
      <div className="flex flex-col gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-1 items-center gap-1 rounded-lg bg-secondary p-1">
            <div className="h-full w-3 rounded-full bg-oxblood/70" />
            <div className="h-1.5 flex-1 rounded bg-plum/20" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Fashion() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-1 gap-2">
        <div className="w-1/2 rounded-lg bg-berry/70" />
        <div className="w-1/3 rounded-lg bg-blush" />
        <div className="w-1/6 rounded-lg bg-oxblood/50" />
      </div>
      <div className="flex gap-1.5">
        {["XS", "S", "M", "L", "XL"].map((s, i) => (
          <span key={s} className={`flex-1 rounded-md py-1 text-center text-[0.6rem] font-semibold ${i === 2 ? "bg-oxblood text-petal" : "bg-secondary text-oxblood"}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
      <div className="col-span-2 row-span-2 rounded-lg bg-blush" />
      <div className="rounded-lg bg-berry/60" />
      <div className="rounded-lg bg-oxblood/60" />
    </div>
  );
}

function Accessories() {
  return (
    <div className="grid h-full grid-cols-5 gap-2">
      <div className="col-span-3 flex items-center justify-center rounded-lg bg-blush">
        <div className="h-12 w-12 rounded-full border-4 border-berry" />
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className={`flex flex-1 items-center gap-1.5 rounded-lg p-1.5 ${n === 1 ? "bg-oxblood" : "bg-secondary"}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[0.55rem] font-bold ${n === 1 ? "bg-petal text-oxblood" : "bg-oxblood text-petal"}`}>{n}</span>
            <div className={`h-1.5 flex-1 rounded ${n === 1 ? "bg-petal/50" : "bg-plum/20"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

const LAYOUTS = { skincare: Skincare, fashion: Fashion, home: Home, accessories: Accessories };

export function DesignSampleVisual({ visual, className = "" }: { visual: DesignSample["visual"]; className?: string }) {
  const Layout = LAYOUTS[visual];
  return (
    <div role="img" aria-label="Concept illustration, not a real store"
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-card ${className}`}>
      <div className="flex items-center gap-1.5 bg-oxblood px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-blush" />
        <span className="h-2 w-2 rounded-full bg-berry" />
        <span className="h-2 w-2 rounded-full bg-petal/60" />
        <span className="ml-3 h-2 flex-1 rounded-full bg-petal/15" />
      </div>
      <div className="aspect-[16/10] bg-petal p-3">
        <Layout />
      </div>
    </div>
  );
}
