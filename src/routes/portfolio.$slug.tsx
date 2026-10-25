import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/$slug")({
  head: () => seo("Case Study", "A Shopify project case study by Deborah Ezeadila."),
  component: () => (
    <>
      <PageHero eyebrow="Case Study" title="Case study" intro="A Shopify project case study by Deborah Ezeadila." />
      <ContactCta />
    </>
  ),
});
