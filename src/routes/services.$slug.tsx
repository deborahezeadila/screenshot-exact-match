import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { Button } from "@/components/ui/button";
import { useContact } from "@/components/site/contact-context";
import { serviceQuery, formatPrice } from "@/lib/queries";
import { seo } from "@/lib/seo";

const SITE = "https://deborahezeadila.lovable.app";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(serviceQuery(params.slug)),
  head: ({ params, loaderData }) => {
    const s = loaderData?.service;
    const base = s ? seo(s.title, s.summary) : seo("Service unavailable", "This service page isn't available.");
    return {
      ...base,
      meta: s ? base.meta : [...base.meta, { name: "robots", content: "noindex" }],
      links: [{ rel: "canonical", href: `${SITE}/services/${params.slug}` }],
    };
  },
  errorComponent: () => <p role="alert" className="container-site py-16">This service could not be loaded. Please try again.</p>,
  notFoundComponent: Unavailable,
  component: ServicePage,
});

function Unavailable() {
  return (
    <PageHero eyebrow="Service" title="This service page isn't available" intro="It may have moved or isn't published yet.">
      <Link to="/shopify-services" className="mt-6 inline-block font-semibold text-berry hover:underline">Browse Shopify services →</Link>
    </PageHero>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
      <h2 className="text-2xl text-oxblood md:text-3xl">{title}</h2>
      <div className="mt-4 leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-berry" /><span>{i}</span></li>
      ))}
    </ul>
  );
}

function ServicePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(serviceQuery(slug));
  const { open } = useContact();
  if (!data) return <><Unavailable /><ContactCta /></>;
  const s = data.service;
  const hasPrice = s.pricing_type === "starting" && typeof s.starting_price === "number";
  return (
    <>
      <PageHero eyebrow="Service" title={s.title} intro={s.hero_headline || s.title} />
      <section className="container-site grid gap-8 py-12 md:py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          {s.summary && <p className="text-lg leading-relaxed text-plum">{s.summary}</p>}
          {s.problem && <Block title="The problem"><p className="whitespace-pre-line">{s.problem}</p></Block>}
          {s.included.length > 0 && <Block title="What's included"><List items={s.included} /></Block>}
          {s.deliverables.length > 0 && <Block title="Deliverables"><List items={s.deliverables} /></Block>}
          {s.approach && <Block title="My approach"><p className="whitespace-pre-line">{s.approach}</p></Block>}
        </div>
        <aside className="min-w-0">
          <div className="rounded-2xl border border-border bg-secondary/60 p-6 lg:sticky lg:top-24">
            <p className="eyebrow">Pricing</p>
            <p className="mt-2 font-display text-2xl text-oxblood">
              {hasPrice ? `Starting from ${formatPrice(s.starting_price as number)}` : "Pricing: quote-based"}
            </p>
            {hasPrice && s.pricing_note && <p className="mt-2 text-sm text-muted-foreground">{s.pricing_note}</p>}
            <Button variant="cta" size="lg" className="mt-5 w-full" onClick={open}>Contact Me</Button>
          </div>
        </aside>
      </section>
      <ContactCta />
    </>
  );
}
