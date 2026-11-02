import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero } from "@/components/site/blocks";
import { useContact } from "@/components/site/contact-context";
import { Button } from "@/components/ui/button";
import { REFERENCE_LABEL, getDesignSample } from "@/lib/design-samples";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shopify-store-design-samples/$slug")({
  loader: ({ params }) => {
    if (!getDesignSample(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const s = getDesignSample(params.slug);
    if (!s) {
      const base = seo("Design Breakdown Unavailable", "This design breakdown isn't available.");
      return { meta: [...base.meta, { name: "robots", content: "noindex" }] };
    }
    return {
      ...seo(`${s.storeName} — Design Reference`, s.summary),
      links: [{ rel: "canonical", href: `https://deborahezeadila.lovable.app/shopify-store-design-samples/${s.slug}` }],
    };
  },
  errorComponent: () => <p role="alert" className="container-site py-16">This design breakdown could not be loaded. Please try again.</p>,
  notFoundComponent: Unavailable,
  component: Page,
});

function Unavailable() {
  return (
    <PageHero eyebrow="Design Breakdown" title="This design breakdown isn't available.">
      <Link to="/shopify-store-design-samples" className="mt-6 inline-block font-semibold text-berry hover:underline">← Back to all samples</Link>
    </PageHero>
  );
}

function Page() {
  const { slug } = Route.useParams();
  const { open } = useContact();
  const s = getDesignSample(slug);
  if (!s) return <Unavailable />;
  const sections = [
    ["Navigation", s.observations.navigation],
    ["Product pages", s.observations.productPages],
    ["Customer experience", s.observations.customerExperience],
    ["Design takeaway", s.observations.takeaway],
  ] as const;
  return (
    <>
      <PageHero eyebrow="Design Reference" title={s.storeName} intro={s.summary}>
        <p className="mt-5 font-semibold text-berry">{REFERENCE_LABEL}</p>
        <p className="mt-3 text-sm text-muted-foreground">Niche: {s.niche}</p>
        <p className="mt-2 break-words text-sm text-muted-foreground">Store: {s.domain}</p>
      </PageHero>
      <section className="container-site py-12 md:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map(([h, t]) => (
            <div key={h}>
              <h2 className="text-2xl text-oxblood md:text-3xl">{h}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{t}</p>
            </div>
          ))}
          <p className="text-sm leading-relaxed text-muted-foreground">These observations are based on the store's public homepage. They are my own analysis, not work I did for this store.</p>
          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
            <Link to="/shopify-store-design-samples" className="font-semibold text-berry hover:underline">← Back to all samples</Link>
            <Button variant="cta" size="lg" onClick={open}>Discuss a store like this</Button>
          </div>
        </div>
      </section>
    </>
  );
}
