import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/blocks";
import { DesignSampleVisual } from "@/components/site/DesignSampleVisual";
import { useContact } from "@/components/site/contact-context";
import { Button } from "@/components/ui/button";
import { CONCEPT_LABEL, DESIGN_SAMPLES } from "@/lib/design-samples";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shopify-store-design-samples/")({
  head: () => ({
    ...seo(
      "Shopify Store Design Samples",
      "Shopify store design concepts that show how navigation, product pages, mobile shopping and customer experience can improve a store.",
    ),
    links: [{ rel: "canonical", href: "https://deborahezeadila.lovable.app/shopify-store-design-samples" }],
  }),
  component: Page,
});

function Page() {
  const { open } = useContact();
  return (
    <>
      <PageHero
        eyebrow="Shopify Design"
        title="Shopify Store Design Samples"
        intro="Explore Shopify store design examples and see how thoughtful design can improve navigation, product presentation, mobile shopping and customer experience. These are original concept designs, not client projects."
      />
      <section className="container-site grid gap-8 py-12 md:grid-cols-2 md:py-16">
        {DESIGN_SAMPLES.map((s) => (
          <article key={s.slug} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card">
            <DesignSampleVisual visual={s.visual} />
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-oxblood">{s.niche}</span>
              <span className="rounded-full bg-oxblood px-3 py-1 text-xs font-semibold text-petal">{CONCEPT_LABEL}</span>
            </div>
            <h2 className="mt-3 text-2xl text-oxblood">{s.title}</h2>
            <p className="mt-1 text-sm font-semibold text-berry">Design focus: {s.focus}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
            <p className="mt-3 text-xs text-muted-foreground">{CONCEPT_LABEL} — illustrative design, not a client project</p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link to="/shopify-store-design-samples/$slug" params={{ slug: s.slug }}>View Design Breakdown</Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
      <section className="container-site pb-16 md:pb-24">
        <div className="rounded-3xl bg-oxblood px-6 py-12 text-center md:px-16">
          <h2 className="text-3xl text-petal md:text-4xl">Need a Shopify store designed or improved?</h2>
          <p className="mx-auto mt-3 max-w-xl text-petal/75">Tell me about your store and what you want to improve.</p>
          <div className="mt-6">
            <Button variant="cta" size="lg" onClick={open}>Contact Me</Button>
          </div>
        </div>
      </section>
    </>
  );
}
