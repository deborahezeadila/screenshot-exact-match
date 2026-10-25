import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/")({
  head: () => seo("Portfolio", "Shopify projects and case studies by Deborah Ezeadila. Client work and concept stores are clearly labelled."),
  component: () => (
    <>
      <PageHero eyebrow="Portfolio" title="Selected work." intro="Shopify projects and case studies by Deborah Ezeadila. Client work and concept stores are clearly labelled." />
      <ContactCta />
    </>
  ),
});
