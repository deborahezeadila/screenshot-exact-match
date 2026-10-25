import { createFileRoute } from "@tanstack/react-router";
import { PageHero, ContactCta } from "@/components/site/blocks";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/shopify-services/$slug")({
  head: () => seo("Shopify Service", "Shopify service details from Deborah Ezeadila."),
  component: () => (
    <>
      <PageHero eyebrow="Shopify Service" title="Shopify service" intro="Shopify service details from Deborah Ezeadila." />
      <ContactCta />
    </>
  ),
});
