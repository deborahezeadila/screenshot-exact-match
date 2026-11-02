import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/blocks";
import { useContact } from "@/components/site/contact-context";
import { Button } from "@/components/ui/button";
import { REFERENCE_LABEL, DESIGN_SAMPLES } from "@/lib/design-samples";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shopify-store-design-samples/")({
  head: () => ({
    ...seo(
      "Shopify Store Design Samples",
      "Third-party store examples shown for design reference only, with analysis of navigation, product pages and customer experience. Not client work.",
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
        intro="Explore third-party stores shown for design reference only, with observations on navigation, product presentation and customer experience. These are not my client projects."
      >
        <p className="mt-5 font-semibold text-berry">{REFERENCE_LABEL}</p>
      </PageHero>
      <section className="container-site grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3 md:py-16">
        {DESIGN_SAMPLES.map((s) => (
          <article key={s.slug} className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 shadow-card">
            <h2 className="text-2xl text-oxblood">{s.storeName}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-oxblood">{s.niche}</span>
              <span className="rounded-full bg-oxblood px-3 py-1 text-xs font-semibold text-petal">Design reference</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-berry">Design focus: {s.designFocus}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.summary}</p>
            <p className="mt-3 break-words text-sm text-muted-foreground">Store: {s.domain}</p>
            <p className="mt-3 text-xs font-semibold text-berry">{REFERENCE_LABEL}</p>
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
