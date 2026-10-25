import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard, EmptyState } from "./blocks";
import type { Service } from "@/lib/content.functions";
import { matchServices } from "@/lib/service-search";

export function ServiceDirectory({ services }: { services: Service[] }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => matchServices(services, q), [services, q]);
  return (
    <div>
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <label htmlFor="svc-search" className="sr-only">Search services</label>
        <Input id="svc-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder='Try "speed", "SEO" or "product page"'
          className="h-13 rounded-full bg-card pl-12 text-base" />
      </div>
      <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{results.length} service{results.length === 1 ? "" : "s"}</p>
      {results.length ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => <ServiceCard key={s.id} s={s} index={services.indexOf(s)} />)}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState title="No matching service" text="Try a different word, or get in touch and describe what you need — I'll tell you if I can help." />
          <div className="mt-4 text-center"><Button variant="ghost" onClick={() => setQ("")}>Clear search</Button></div>
        </div>
      )}
    </div>
  );
}
