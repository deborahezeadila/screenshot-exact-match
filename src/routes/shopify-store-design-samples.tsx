import { createFileRoute } from "@tanstack/react-router";
import { ContactCta, EmptyState, PageHero, SectionHeading } from "@/components/site/blocks";
import { useContact } from "@/components/site/contact-context";
import { Button } from "@/components/ui/button";
import { seo } from "@/lib/seo";

const URL = "https://deborahezeadila.lovable.app/shopify-store-design-samples";

export const Route = createFileRoute("/shopify-store-design-samples")({
  head: () => ({
    ...seo(
      "Shopify Store Design Samples",
      "Shopify store design studies and confirmed project work by Deborah Ezeadila, with design observations and UX lessons.",
    ),
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Page,
});

const SECTIONS = [
  {
    title: "Shopify Store Design Inspiration",
    text: "Third-party stores I study for visual and UX ideas. Each store is added only after it has been checked, and it is clearly labelled as inspiration, not my work.",
    empty: "Store studies will be added once each store has been verified.",
  },
  {
    title: "My Shopify Projects",
    text: "Stores I have personally designed, developed, redesigned or optimised, with the scope of work described.",
    empty: "Confirmed client projects will appear here once they have been approved.",
  },
  {
    title: "Design Breakdown",
    text: "My own observations and recommendations about store design, presented as analysis rather than ownership.",
    empty: "Design breakdowns will be published here.",
  },
] as const;

function Page() {
  const { open } = useContact();
  return (
    <>
      <PageHero
        eyebrow="Shopify Design"
        title="Shopify Store Design Samples"
        intro="A look at how I study Shopify store design, the UX observations behind it, and the confirmed project work I can share."
      >
        <div className="mt-8">
          <Button variant="cta" size="lg" onClick={open}>
            Discuss Your Shopify Store
          </Button>
        </div>
      </PageHero>
      <section className="container-site space-y-20 py-16 md:py-24">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <SectionHeading eyebrow="Samples" title={s.title} intro={s.text} />
            <div className="mt-10">
              <EmptyState title="Coming soon" text={s.empty} />
            </div>
          </div>
        ))}
      </section>
      <ContactCta
        title="Want a Shopify store that looks and sells this well?"
        text="Tell me about your store and what you want to improve, and I'll get back to you with next steps."
      />
    </>
  );
}
